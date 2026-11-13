// Phone and computer on the same home Wi-Fi, with no account, no cloud and no internet.
// The computer is home base: it answers a phone that is looking for it, and a phone it has paired with can join records with it.
//
// Pairing: the computer shows six digits. The phone proves it saw them by sealing its first message with a key made from them,
// and receives a long random key of its own, sealed the same way. Every later message is sealed with that key
// (AES-256-CBC, then HMAC-SHA256 over the whole), so a neighbour on the same Wi-Fi can neither read nor fake one.
//
// Wire format, one request and one answer per connection:
//   request  "MFT1" | type (1) | id length (1) | phone id (ascii) | length (4, big-endian) | sealed payload
//   answer   status (1) | length (4, big-endian) | sealed payload
// Discovery: the phone sends "MFT1?" by UDP broadcast to port 47732; the computer answers "MFT1!" and a small JSON card.
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace Miftah {
    static class Seal {
        public static byte[] Sub(byte[] key, string label) { using (var h = new HMACSHA256(key)) return h.ComputeHash(Encoding.ASCII.GetBytes(label)); }
        public static byte[] PairKey(string code, string pcId) {
            using (var d = new Rfc2898DeriveBytes(Encoding.UTF8.GetBytes(code), Encoding.UTF8.GetBytes("miftah-pair:" + pcId), 50000, HashAlgorithmName.SHA256)) return d.GetBytes(32);
        }
        public static byte[] Close(byte[] key, byte[] plain) {
            using (var aes = Aes.Create()) {
                aes.KeySize = 256; aes.Mode = CipherMode.CBC; aes.Padding = PaddingMode.PKCS7; aes.Key = Sub(key, "miftah-enc"); aes.GenerateIV();
                byte[] ct; using (var e = aes.CreateEncryptor()) ct = e.TransformFinalBlock(plain, 0, plain.Length);
                var body = new byte[16 + ct.Length + 32];
                Buffer.BlockCopy(aes.IV, 0, body, 0, 16); Buffer.BlockCopy(ct, 0, body, 16, ct.Length);
                byte[] mac; using (var h = new HMACSHA256(Sub(key, "miftah-mac"))) mac = h.ComputeHash(body, 0, 16 + ct.Length);
                Buffer.BlockCopy(mac, 0, body, 16 + ct.Length, 32);
                return body;
            }
        }
        /* null when the seal is broken: wrong key, or changed on the way */
        public static byte[] Open(byte[] key, byte[] body) {
            if (body == null || body.Length < 16 + 16 + 32) return null;
            byte[] mac; using (var h = new HMACSHA256(Sub(key, "miftah-mac"))) mac = h.ComputeHash(body, 0, body.Length - 32);
            int diff = 0; for (int i = 0; i < 32; i++) diff |= mac[i] ^ body[body.Length - 32 + i];
            if (diff != 0) return null;
            using (var aes = Aes.Create()) {
                aes.KeySize = 256; aes.Mode = CipherMode.CBC; aes.Padding = PaddingMode.PKCS7; aes.Key = Sub(key, "miftah-enc");
                var iv = new byte[16]; Buffer.BlockCopy(body, 0, iv, 0, 16); aes.IV = iv;
                using (var d = aes.CreateDecryptor()) return d.TransformFinalBlock(body, 16, body.Length - 48);
            }
        }
    }

    class Link {
        public const int TcpPort = 47731, UdpPort = 47732;
        const byte PAIR = 1, HELLO = 2, GET = 3, PUT = 4, SYNC = 5;
        const byte OK = 0, NOAUTH = 1, BADCODE = 2, FAIL = 3, LOCKED = 4;
        const long MaxBody = 420L * 1024 * 1024;

        public Func<string, string, string> Merge;   // (state json, phone name) -> answer json; runs the page's own merge
        public Action<string> Event;                 // tells the page what happened, as a small JSON object
        TcpListener tcp; UdpClient udp; volatile bool running;
        string code; DateTime codeUntil; int codeTries;
        readonly object gate = new object();

        public bool Running { get { return running; } }
        public string Id {
            get {
                var id = Store.Get("pcId", null) as string;
                if (id == null) { var b = new byte[8]; using (var r = RandomNumberGenerator.Create()) r.GetBytes(b); id = BitConverter.ToString(b).Replace("-", "").ToLowerInvariant(); Store.Set("pcId", id); }
                return id;
            }
        }
        public string Name { get { var n = Store.Get("pcName", null) as string; return string.IsNullOrEmpty(n) ? Environment.MachineName : n; } }

        public bool Start() {
            if (running) return true;
            try {
                /* MIFTAH_LINK_LOCAL=1 (tests, and the Android emulator, which reaches this computer as 10.0.2.2) listens on this computer only */
                var at = Environment.GetEnvironmentVariable("MIFTAH_LINK_LOCAL") == "1" ? IPAddress.Loopback : IPAddress.Any;
                tcp = new TcpListener(at, TcpPort); tcp.Start();
                udp = new UdpClient(new IPEndPoint(at, UdpPort)); udp.EnableBroadcast = true;
            } catch {
                try { if (tcp != null) tcp.Stop(); } catch { }
                tcp = null; udp = null; return false;
            }
            running = true;
            var t1 = new Thread(AcceptLoop) { IsBackground = true, Name = "link-tcp" }; t1.Start();
            var t2 = new Thread(Answer) { IsBackground = true, Name = "link-udp" }; t2.Start();
            return true;
        }
        public void Stop() {
            running = false;
            try { if (tcp != null) tcp.Stop(); } catch { }
            try { if (udp != null) udp.Close(); } catch { }
            tcp = null; udp = null;
        }

        /* six digits for the phone to type, for ten minutes */
        public string NewCode() {
            lock (gate) {
                var b = new byte[4]; using (var r = RandomNumberGenerator.Create()) r.GetBytes(b);
                code = ((BitConverter.ToUInt32(b, 0) % 900000) + 100000).ToString();
                codeUntil = DateTime.UtcNow.AddMinutes(10); codeTries = 0;
                return code;
            }
        }
        public void EndCode() { lock (gate) { code = null; } }

        public static List<string> Addresses() {
            var o = new List<string>();
            try {
                foreach (var ni in System.Net.NetworkInformation.NetworkInterface.GetAllNetworkInterfaces()) {
                    if (ni.OperationalStatus != System.Net.NetworkInformation.OperationalStatus.Up) continue;
                    var t = ni.NetworkInterfaceType;
                    if (t == System.Net.NetworkInformation.NetworkInterfaceType.Loopback || t == System.Net.NetworkInformation.NetworkInterfaceType.Tunnel) continue;
                    var d = (ni.Description + " " + ni.Name).ToLowerInvariant();
                    if (d.Contains("virtual") || d.Contains("vethernet") || d.Contains("hyper-v") || d.Contains("vmware") || d.Contains("virtualbox") || d.Contains("wsl")) continue;
                    foreach (var a in ni.GetIPProperties().UnicastAddresses)
                        if (a.Address.AddressFamily == AddressFamily.InterNetwork && Private(a.Address) && !IPAddress.IsLoopback(a.Address)) o.Add(a.Address.ToString());
                }
            } catch { }
            return o;
        }
        static bool Private(IPAddress ip) {
            if (IPAddress.IsLoopback(ip)) return true;
            var b = ip.GetAddressBytes(); if (b.Length != 4) return false;
            return b[0] == 10 || (b[0] == 172 && b[1] >= 16 && b[1] < 32) || (b[0] == 192 && b[1] == 168) || (b[0] == 169 && b[1] == 254);
        }

        /* ---------- paired phones ---------- */
        public List<Dictionary<string, object>> Phones() {
            var o = new List<Dictionary<string, object>>();
            var l = Store.Get("phones", null) as System.Collections.ArrayList;
            if (l != null) foreach (var x in l) { var d = x as Dictionary<string, object>; if (d != null) o.Add(d); }
            return o;
        }
        Dictionary<string, object> Phone(string id) { foreach (var p in Phones()) if ((p["id"] as string) == id) return p; return null; }
        void KeepPhones(List<Dictionary<string, object>> l) { var a = new System.Collections.ArrayList(); foreach (var x in l) a.Add(x); Store.Set("phones", a); }
        public void Forget(string id) { var l = Phones(); l.RemoveAll(p => (p["id"] as string) == id); KeepPhones(l); }
        static long Now() { return (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds; }
        void Touch(string id, string name) {
            var l = Phones();
            foreach (var p in l) if ((p["id"] as string) == id) { p["last"] = Now(); if (!string.IsNullOrEmpty(name)) p["name"] = name; }
            KeepPhones(l);
        }

        /* ---------- discovery ---------- */
        void Answer() {
            var u = udp;
            while (running) {
                try {
                    var from = new IPEndPoint(IPAddress.Any, 0);
                    var msg = u.Receive(ref from);
                    if (!Private(from.Address) || msg.Length < 5 || Encoding.ASCII.GetString(msg, 0, 5) != "MFT1?") continue;
                    var card = "MFT1!" + Store.Json.Serialize(new Dictionary<string, object> { { "id", Id }, { "name", Name }, { "port", TcpPort }, { "pairing", code != null && DateTime.UtcNow < codeUntil } });
                    var b = Encoding.UTF8.GetBytes(card);
                    u.Send(b, b.Length, from);
                } catch { if (!running) return; Thread.Sleep(50); }
            }
        }

        /* ---------- requests ---------- */
        void AcceptLoop() {
            var l = tcp;
            while (running) {
                TcpClient c;
                try { c = l.AcceptTcpClient(); } catch { if (!running) return; continue; }
                ThreadPool.QueueUserWorkItem(delegate { Serve(c); });
            }
        }
        static byte[] ReadN(Stream s, long n) {
            if (n < 0 || n > MaxBody) throw new IOException("too big");
            var b = new byte[n]; int at = 0;
            while (at < n) { int r = s.Read(b, at, (int)Math.Min(n - at, 1 << 20)); if (r <= 0) throw new IOException("short"); at += r; }
            return b;
        }
        static int Int(byte[] b, int at) { return (b[at] << 24) | (b[at + 1] << 16) | (b[at + 2] << 8) | b[at + 3]; }
        static void Reply(Stream s, byte status, byte[] body) {
            body = body ?? new byte[0];
            var h = new byte[] { status, (byte)(body.Length >> 24), (byte)(body.Length >> 16), (byte)(body.Length >> 8), (byte)body.Length };
            s.Write(h, 0, 5); if (body.Length > 0) s.Write(body, 0, body.Length); s.Flush();
        }
        void Serve(TcpClient c) {
            using (c) try {
                var remote = ((IPEndPoint)c.Client.RemoteEndPoint).Address;
                if (remote.IsIPv4MappedToIPv6) remote = remote.MapToIPv4();
                if (!Private(remote)) return;
                c.ReceiveTimeout = 60000; c.SendTimeout = 120000;
                var s = c.GetStream();
                var head = ReadN(s, 6);
                if (Encoding.ASCII.GetString(head, 0, 4) != "MFT1") return;
                byte type = head[4]; string dev = Encoding.ASCII.GetString(ReadN(s, head[5]));
                long len = (uint)Int(ReadN(s, 4), 0);
                var body = ReadN(s, len);
                if (type == PAIR) { Pair(s, dev, body); return; }
                var ph = Phone(dev);
                if (ph == null) { Reply(s, NOAUTH, null); return; }
                var key = Convert.FromBase64String(ph["key"] as string);
                var plain = Seal.Open(key, body);
                if (plain == null) { Reply(s, NOAUTH, null); return; }
                switch (type) {
                    case HELLO: {
                        var q = Store.Json.Deserialize<Dictionary<string, object>>(Encoding.UTF8.GetString(plain));
                        object nm; Touch(dev, q.TryGetValue("name", out nm) ? nm as string : null);
                        var a = new Dictionary<string, object> { { "id", Id }, { "name", Name }, { "media", Store.Names(Store.MediaDir) }, { "voice", Store.Names(Store.VoiceDir) } };
                        Reply(s, OK, Seal.Close(key, Encoding.UTF8.GetBytes(Store.Json.Serialize(a))));
                        Say(new Dictionary<string, object> { { "link", "hello" }, { "name", ph["name"] } });
                        return;
                    }
                    case GET: {
                        var q = Store.Json.Deserialize<Dictionary<string, object>>(Encoding.UTF8.GetString(plain));
                        var f = FileOf(q["kind"] as string, q["name"] as string);
                        if (f == null || !File.Exists(f) || new FileInfo(f).Length > MaxBody - 1024) { Reply(s, FAIL, null); return; }
                        Reply(s, OK, Seal.Close(key, File.ReadAllBytes(f)));
                        return;
                    }
                    case PUT: {
                        int hl = Int(plain, 0);
                        var q = Store.Json.Deserialize<Dictionary<string, object>>(Encoding.UTF8.GetString(plain, 4, hl));
                        var f = FileOf(q["kind"] as string, q["name"] as string);
                        if (f == null) { Reply(s, FAIL, null); return; }
                        if (!File.Exists(f)) { var tmp = f + ".tmp"; using (var o = File.Create(tmp)) o.Write(plain, 4 + hl, plain.Length - 4 - hl); File.Move(tmp, f); }
                        Reply(s, OK, Seal.Close(key, Encoding.ASCII.GetBytes("ok")));
                        return;
                    }
                    case SYNC: {
                        var name = ph["name"] as string;
                        var answer = Merge == null ? null : Merge(Encoding.UTF8.GetString(plain), name);
                        if (answer == null) { Reply(s, FAIL, null); return; }
                        Touch(dev, null);
                        Reply(s, OK, Seal.Close(key, Encoding.UTF8.GetBytes(answer)));
                        return;
                    }
                }
                Reply(s, FAIL, null);
            } catch { }
        }
        static string FileOf(string kind, string name) {
            var n = Store.Safe(name); if (n == null) return null;
            if (kind == "media") return Path.Combine(Store.MediaDir, n);
            if (kind == "voice") return Path.Combine(Store.VoiceDir, n);
            return null;
        }
        void Pair(Stream s, string dev, byte[] body) {
            string c;
            lock (gate) {
                if (code == null || DateTime.UtcNow > codeUntil) { Reply(s, BADCODE, null); return; }
                if (codeTries >= 8) { code = null; Reply(s, LOCKED, null); Say(new Dictionary<string, object> { { "link", "locked" } }); return; }
                codeTries++; c = code;
            }
            var pk = Seal.PairKey(c, Id);
            var plain = Seal.Open(pk, body);
            if (plain == null) { Reply(s, BADCODE, null); Say(new Dictionary<string, object> { { "link", "badcode" } }); return; }
            var q = Store.Json.Deserialize<Dictionary<string, object>>(Encoding.UTF8.GetString(plain));
            object nm; var name = q.TryGetValue("name", out nm) && nm is string && ((string)nm).Length > 0 ? ((string)nm) : "Phone";
            if (name.Length > 60) name = name.Substring(0, 60);
            if (dev.Length < 8 || dev.Length > 40) { Reply(s, FAIL, null); return; }
            var token = new byte[32]; using (var r = RandomNumberGenerator.Create()) r.GetBytes(token);
            var l = Phones(); l.RemoveAll(p => (p["id"] as string) == dev);
            l.Add(new Dictionary<string, object> { { "id", dev }, { "name", name }, { "key", Convert.ToBase64String(token) }, { "since", Now() } });
            KeepPhones(l);
            EndCode();
            var a = new Dictionary<string, object> { { "id", Id }, { "name", Name }, { "key", Convert.ToBase64String(token) } };
            Reply(s, OK, Seal.Close(pk, Encoding.UTF8.GetBytes(Store.Json.Serialize(a))));
            Say(new Dictionary<string, object> { { "link", "paired" }, { "name", name } });
        }
        void Say(Dictionary<string, object> o) { var e = Event; if (e != null) try { e(Store.Json.Serialize(o)); } catch { } }
    }
}
