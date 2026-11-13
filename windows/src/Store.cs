// Everything Miftah keeps on this computer, in one folder the family can see: %LOCALAPPDATA%\Miftah
//   state.json        the family's record (the same file the phone keeps)
//   backups\          one copy a day, the last 30 days
//   media\ voice\     the family's photos, videos, simulations and voice recordings
//   audio\            recitations fetched once from their source, then kept
//   desk.json         this computer's own settings (window, tray, reminder, paired phones)
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Text;
using System.Threading;
using System.Web.Script.Serialization;

namespace Miftah {
    static class Store {
        public static string Root, AppDir, MediaDir, VoiceDir, AudioDir, BackupDir, StateFile, DeskFile;
        public static readonly JavaScriptSerializer Json = new JavaScriptSerializer { MaxJsonLength = int.MaxValue, RecursionLimit = 256 };
        static readonly object stateLock = new object(), deskLock = new object();

        public static void Init() {
            string over = Environment.GetEnvironmentVariable("MIFTAH_DATA");
            Root = string.IsNullOrEmpty(over) ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Miftah") : over;
            Directory.CreateDirectory(Root);
            MediaDir = Dir("media"); VoiceDir = Dir("voice"); AudioDir = Dir("audio"); BackupDir = Dir("backups");
            StateFile = Path.Combine(Root, "state.json"); DeskFile = Path.Combine(Root, "desk.json");
        }
        static string Dir(string n) { var d = Path.Combine(Root, n); Directory.CreateDirectory(d); return d; }

        /* ---------- the record ---------- */
        public static string LoadState() {
            lock (stateLock) {
                try { return File.Exists(StateFile) ? File.ReadAllText(StateFile, Encoding.UTF8) : null; } catch { return null; }
            }
        }
        /* written whole to a side file, then swapped in, so a power cut never leaves half a record */
        public static void SaveState(string json) {
            if (json == null || json.Length < 2 || json.Length > 60000000) return;
            ThreadPool.QueueUserWorkItem(delegate {
                lock (stateLock) {
                    try {
                        var tmp = StateFile + ".tmp";
                        using (var f = new FileStream(tmp, FileMode.Create, FileAccess.Write, FileShare.None, 65536, FileOptions.WriteThrough)) {
                            var b = new UTF8Encoding(false).GetBytes(json); f.Write(b, 0, b.Length); f.Flush(true);
                        }
                        if (File.Exists(StateFile)) File.Replace(tmp, StateFile, null); else File.Move(tmp, StateFile);
                        var today = Path.Combine(BackupDir, DateTime.Now.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + ".json");
                        if (!File.Exists(today)) {
                            File.Copy(StateFile, today);
                            var all = Directory.GetFiles(BackupDir, "*.json"); Array.Sort(all);
                            for (int i = 0; i < all.Length - 30; i++) try { File.Delete(all[i]); } catch { }
                        }
                    } catch { }
                }
            });
        }
        public static List<Dictionary<string, object>> Backups() {
            var o = new List<Dictionary<string, object>>();
            var all = Directory.GetFiles(BackupDir, "*.json"); Array.Sort(all); Array.Reverse(all);
            foreach (var f in all) {
                var fi = new FileInfo(f);
                o.Add(new Dictionary<string, object> { { "name", Path.GetFileNameWithoutExtension(f) }, { "bytes", fi.Length } });
            }
            return o;
        }
        public static string ReadBackup(string name) {
            var n = Safe(name); if (n == null) return null;
            var f = Path.Combine(BackupDir, n + ".json");
            return File.Exists(f) ? File.ReadAllText(f, Encoding.UTF8) : null;
        }

        /* ---------- this computer's own settings ---------- */
        static Dictionary<string, object> desk;
        public static Dictionary<string, object> Desk {
            get {
                lock (deskLock) {
                    if (desk == null) {
                        try { desk = File.Exists(DeskFile) ? Json.Deserialize<Dictionary<string, object>>(File.ReadAllText(DeskFile, Encoding.UTF8)) : null; } catch { desk = null; }
                        if (desk == null) desk = new Dictionary<string, object>();
                    }
                    return desk;
                }
            }
        }
        public static object Get(string k, object fallback) { object v; return Desk.TryGetValue(k, out v) && v != null ? v : fallback; }
        public static bool Flag(string k) { object v = Get(k, false); return v is bool && (bool)v; }
        public static void Set(string k, object v) {
            lock (deskLock) { Desk[k] = v; SaveDesk(); }
        }
        public static void SaveDesk() {
            lock (deskLock) {
                try { var tmp = DeskFile + ".tmp"; File.WriteAllText(tmp, Json.Serialize(Desk), new UTF8Encoding(false)); if (File.Exists(DeskFile)) File.Replace(tmp, DeskFile, null); else File.Move(tmp, DeskFile); } catch { }
            }
        }

        /* ---------- the family's files ---------- */
        public static string Safe(string name) {
            var n = Path.GetFileName((name ?? "").Replace('\\', '/'));
            if (n.Length == 0 || n.Contains("..") || n.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0) return null;
            return n;
        }
        public static string KindOf(string file) {
            switch (Path.GetExtension(file).ToLowerInvariant()) {
                case ".mp4": case ".webm": case ".mov": case ".m4v": case ".mkv": return "video";
                case ".mp3": case ".m4a": case ".ogg": case ".opus": case ".wav": case ".aac": return "audio";
                case ".png": case ".jpg": case ".jpeg": case ".webp": case ".gif": case ".bmp": return "image";
                case ".html": case ".htm": return "html";
            }
            return null;
        }
        /* a picked or dropped file is copied in under a fresh name; the original stays where it was */
        public static string ImportMedia(string path) {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            var refName = "m" + DateTime.UtcNow.Ticks.ToString("x") + (ext == ".htm" ? ".html" : ext);
            File.Copy(path, Path.Combine(MediaDir, refName));
            return refName;
        }
        public static List<string> Names(string dir) {
            var o = new List<string>();
            foreach (var f in Directory.GetFiles(dir)) { var n = Path.GetFileName(f); if (!n.EndsWith(".tmp") && !n.EndsWith(".part")) o.Add(n); }
            return o;
        }

        /* the family file: the record, with photos, videos, simulations and recordings. The same zip the phone makes. */
        public static void PackFamily(Stream os, string json) {
            using (var z = new ZipArchive(os, ZipArchiveMode.Create, true)) {
                var e = z.CreateEntry("family.json", CompressionLevel.Optimal);
                using (var w = e.Open()) { var b = Encoding.UTF8.GetBytes(json); w.Write(b, 0, b.Length); }
                foreach (var f in Directory.GetFiles(MediaDir)) if (!f.EndsWith(".tmp")) z.CreateEntryFromFile(f, "media/" + Path.GetFileName(f), CompressionLevel.NoCompression);
                foreach (var f in Directory.GetFiles(VoiceDir)) if (!f.EndsWith(".tmp")) z.CreateEntryFromFile(f, "voice/" + Path.GetFileName(f), CompressionLevel.NoCompression);
            }
        }
        /* reads a family file, a plain record or a challenge; files land only in their own folder and never replace what is here */
        public static bool ReadImport(string path, out string json, out bool files) {
            json = null; files = false;
            using (var fs = File.OpenRead(path)) {
                int a = fs.ReadByte(), b = fs.ReadByte(); fs.Position = 0;
                if (a == 'P' && b == 'K') {
                    files = true;
                    using (var z = new ZipArchive(fs, ZipArchiveMode.Read)) foreach (var e in z.Entries) {
                        if (e.FullName == "family.json" || e.FullName == "challenge.json") { using (var r = new StreamReader(e.Open(), Encoding.UTF8)) json = r.ReadToEnd(); continue; }
                        string dir = e.FullName.StartsWith("media/") ? MediaDir : e.FullName.StartsWith("voice/") ? VoiceDir : null; var n = Safe(e.Name);
                        if (dir == null || n == null) continue;
                        var dst = Path.Combine(dir, n); if (!File.Exists(dst)) e.ExtractToFile(dst);
                    }
                } else {
                    if (fs.Length > 60000000) return false;
                    using (var r = new StreamReader(fs, Encoding.UTF8)) json = r.ReadToEnd();
                }
            }
            return json != null;
        }

        /* ---------- recitations that do not ship with the app: fetched once from their source, then kept ---------- */
        public static string CachedAudio(string rel) {
            var inApp = Path.Combine(AppDir, "audio", rel.Replace('/', Path.DirectorySeparatorChar)); if (File.Exists(inApp)) return inApp;
            if (rel.Length < 4 || rel[1] != '/') return null;
            string f = rel.Substring(2);
            foreach (var ch in f) if (!char.IsDigit(ch) && ch != '_' && ch != '.' && !(ch >= 'a' && ch <= 'z')) return null;
            string[] from;
            switch (rel[0]) {
                case 'h': from = new[] { "https://everyayah.com/data/Husary_Muallim_128kbps/" + f }; break;
                case 'a': from = new[] { "https://everyayah.com/data/Alafasy_128kbps/" + f }; break;
                case 'w': from = new[] { "https://verses.quran.com/wbw/" + f, "https://audio.qurancdn.com/wbw/" + f }; break;
                default: return null;
            }
            var dst = Path.Combine(AudioDir, rel.Replace('/', '_'));
            if (File.Exists(dst) && new FileInfo(dst).Length > 0) return dst;
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
            foreach (var u in from) {
                var tmp = dst + "." + Thread.CurrentThread.ManagedThreadId + ".part";
                try {
                    using (var w = new WebClient()) { w.Headers[HttpRequestHeader.UserAgent] = "Miftah"; w.DownloadFile(u, tmp); }
                    if (new FileInfo(tmp).Length == 0) { File.Delete(tmp); continue; }
                    if (File.Exists(dst)) File.Delete(tmp); else File.Move(tmp, dst);
                    return dst;
                } catch { try { File.Delete(tmp); } catch { } }
            }
            return null;
        }
        public static string AudioStats() {
            long total = 0; int count = 0;
            foreach (var f in Directory.GetFiles(AudioDir)) { total += new FileInfo(f).Length; count++; }
            return "{\"bytes\":" + total + ",\"files\":" + count + "}";
        }

        public static string Mime(string file) {
            switch (Path.GetExtension(file).ToLowerInvariant()) {
                case ".html": case ".htm": return "text/html; charset=utf-8";
                case ".js": return "text/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".json": return "application/json";
                case ".svg": return "image/svg+xml";
                case ".png": return "image/png";
                case ".jpg": case ".jpeg": return "image/jpeg";
                case ".webp": return "image/webp";
                case ".gif": return "image/gif";
                case ".woff2": return "font/woff2";
                case ".mp3": return "audio/mpeg";
                case ".ogg": case ".opus": return "audio/ogg";
                case ".m4a": case ".aac": return "audio/mp4";
                case ".wav": return "audio/wav";
                case ".webm": return "video/webm";
                case ".mp4": case ".m4v": return "video/mp4";
                case ".mov": return "video/quicktime";
                case ".pdf": return "application/pdf";
                case ".txt": return "text/plain; charset=utf-8";
            }
            return "application/octet-stream";
        }
    }
}
