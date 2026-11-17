// The bridge the page talks to. The first half mirrors the Android app's bridge method for method
// (tools/bridge-check.js keeps the two in step); the second half is what only a computer can do.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;

namespace Miftah {
    [ComVisible(true)]
    [ClassInterface(ClassInterfaceType.AutoDual)]
    public class Bridge {
        readonly MainForm f;
        internal Bridge(MainForm form) { f = form; }
        static string Q(object o) { return Store.Json.Serialize(o); }

        /* ---------- the same as the phone ---------- */
        public void ready(double ms) { }
        public void saveState(string json) { Store.SaveState(json); }
        public string loadState() { return Store.LoadState(); }
        public string version() { return Program.Version; }

        /* ---------- updates: only when a grown-up asks (web/js/core/update.js) ----------
           A check reads version.json from the latest release. Installing downloads the new Miftah.exe beside the family's data,
           checks its SHA-256 against version.json, then a small script waits for this window to close, copies it over this
           program file and opens it again. The record is untouched: it lives in its own folder. */
        const string UpdFrom = "https://github.com/Bashyr18/miftah-app/releases/";
        static int BuildCode() { return System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.Revision; }
        public bool updateCheck() {
            System.Threading.ThreadPool.QueueUserWorkItem(delegate {
                string res = null;
                try {
                    System.Net.ServicePointManager.SecurityProtocol = (System.Net.SecurityProtocolType)3072;
                    string body;
                    using (var w = new System.Net.WebClient()) { w.Headers[System.Net.HttpRequestHeader.UserAgent] = "Miftah"; w.Encoding = Encoding.UTF8; body = w.DownloadString(UpdFrom + "latest/download/version.json"); }
                    if (body != null && body.Length < 65536 && body.TrimStart().StartsWith("{"))
                        res = "{\"latest\":" + body + ",\"current\":{\"name\":" + Q(Program.Version) + ",\"code\":" + BuildCode() + "}}";
                } catch { }
                f.Post("window.Upd&&Upd.onCheck(" + (res == null ? "null" : Q(res)) + ")");
            });
            return true;
        }
        public bool updateInstall(string url, string sha) {
            if (url == null || sha == null || !url.StartsWith(UpdFrom) || sha.Length != 64) return false;
            sha = sha.ToLowerInvariant();
            var dir = Path.Combine(Store.Root, "update"); Directory.CreateDirectory(dir);
            var file = Path.Combine(dir, "Miftah.exe"); var part = file + ".part";
            System.Threading.ThreadPool.QueueUserWorkItem(delegate {
                try {
                    if (!(File.Exists(file) && Sha256(file) == sha)) {
                        if (File.Exists(file)) File.Delete(file);
                        System.Net.ServicePointManager.SecurityProtocol = (System.Net.SecurityProtocolType)3072;
                        var done = new System.Threading.ManualResetEvent(false); Exception err = null; int last = -1;
                        using (var w = new System.Net.WebClient()) {
                            w.Headers[System.Net.HttpRequestHeader.UserAgent] = "Miftah";
                            /* progress arrives on many threads at once: pass on only a rise, at most every 150 ms, or the window drowns in messages */
                            var gate = new object(); var lastT = DateTime.MinValue;
                            w.DownloadProgressChanged += (s, e) => {
                                lock (gate) { if (e.ProgressPercentage <= last || (e.ProgressPercentage < 100 && (DateTime.UtcNow - lastT).TotalMilliseconds < 150)) return; last = e.ProgressPercentage; lastT = DateTime.UtcNow; }
                                f.Post("window.Upd&&Upd.onProgress(" + (e.ProgressPercentage / 100.0).ToString(System.Globalization.CultureInfo.InvariantCulture) + ")");
                            };
                            w.DownloadFileCompleted += (s, e) => { err = e.Error ?? (e.Cancelled ? new Exception("cancelled") : null); done.Set(); };
                            w.DownloadFileAsync(new Uri(url), part);
                            done.WaitOne();
                        }
                        if (err != null) throw err;
                        if (Sha256(part) != sha) { File.Delete(part); f.Post("window.Upd&&Upd.onDone('checksum')"); return; }
                        File.Move(part, file);
                    }
                    f.Post("window.Upd&&Upd.onDone('ok')");
                    f.BeginInvoke(new Action(() => Swap(file)));
                } catch { try { File.Delete(part); } catch { } f.Post("window.Upd&&Upd.onDone('failed')"); }
            });
            return true;
        }
        static string Sha256(string path) {
            using (var s = File.OpenRead(path)) using (var h = System.Security.Cryptography.SHA256.Create()) return BitConverter.ToString(h.ComputeHash(s)).Replace("-", "").ToLowerInvariant();
        }
        void Swap(string file) {
            var target = Application.ExecutablePath; var pid = Process.GetCurrentProcess().Id;
            var cmd = Path.Combine(Path.GetDirectoryName(file), "swap.cmd");
            /* wait for this Miftah to close, put the new one in its place, open it, and tidy up; ping is the pause (timeout needs a console) */
            File.WriteAllText(cmd, "@echo off\r\n:w\r\ntasklist /FI \"PID eq " + pid + "\" | find \"" + pid + "\" >nul && (ping -n 2 127.0.0.1 >nul & goto w)\r\n" +
                "copy /y \"" + file + "\" \"" + target + "\" >nul\r\nstart \"\" \"" + target + "\"\r\ndel \"" + file + "\"\r\ndel \"%~f0\"\r\n", Encoding.ASCII);
            Process.Start(new ProcessStartInfo("cmd.exe", "/c \"" + cmd + "\"") { CreateNoWindow = true, UseShellExecute = false, WindowStyle = ProcessWindowStyle.Hidden });
            f.Quit();
        }
        public void haptic(string k) { }
        public string lastTheme() { return Store.Get("theme", "") as string ?? ""; }
        public void rememberTheme(string t) { if (t == "light" || t == "dark") { Store.Set("theme", t); f.TitleBar(t, false); } }
        public void setSystemBars(bool light) { }
        public void speak(string text, string lang, double rate) { }
        public void speakStop() { }
        public bool micAllowed() { return true; }
        public void openAppSettings() { Shell.Open("ms-settings:privacy-microphone"); }
        /* recording happens in the page (the browser's recorder); the finished clip is handed here */
        public bool recStart(string key) { return true; }
        public void recStop() { }
        public bool voiceSave(string key, string b64) {
            var k = Store.Safe(key); if (k == null || b64 == null) return false;
            try { File.WriteAllBytes(Path.Combine(Store.VoiceDir, k + ".m4a"), Convert.FromBase64String(b64)); return true; } catch { return false; }
        }
        public string voiceList() {
            var o = new List<string>();
            foreach (var n in Store.Names(Store.VoiceDir)) if (n.EndsWith(".m4a")) o.Add(n.Substring(0, n.Length - 4));
            return Q(o);
        }
        public void audioKeep(string json) {
            List<string> l; try { l = Store.Json.Deserialize<List<string>>(json); } catch { return; }
            Task.Run(() => {
                int total = l.Count, done = 0, bad = 0;
                Parallel.ForEach(l, new ParallelOptions { MaxDegreeOfParallelism = 4 }, rel => {
                    if (Store.CachedAudio(rel) == null) System.Threading.Interlocked.Increment(ref bad);
                    int d = System.Threading.Interlocked.Increment(ref done);
                    if (d == total || d % 20 == 0) f.Post("window.__native.onAudioKeep&&__native.onAudioKeep(" + d + "," + total + "," + bad + ")");
                });
            });
        }
        public string audioStats() { return Store.AudioStats(); }
        public void audioClear() { foreach (var x in Directory.GetFiles(Store.AudioDir)) try { File.Delete(x); } catch { } }
        public void sync(string json) {
            try { f.Config = Store.Json.Deserialize<Dictionary<string, object>>(json); Store.Set("config", f.Config); } catch { }
        }
        public bool requestNotifications() { return true; }
        public bool pinWidget() { return false; }

        public void exportFile(string name, string text) {
            f.BeginInvoke(new Action(() => {
                var html = (name ?? "").EndsWith(".html");
                using (var d = new SaveFileDialog { FileName = name ?? "Miftah.json", Filter = html ? "Web page|*.html" : "Miftāḥ record|*.json", InitialDirectory = Shell.Documents() }) {
                    var ok = false;
                    if (d.ShowDialog(f) == DialogResult.OK) try { File.WriteAllText(d.FileName, text, new UTF8Encoding(false)); ok = true; } catch { }
                    f.Post("__native.onExported&&__native.onExported(" + (ok ? "true" : "false") + ")");
                }
            }));
        }
        /* "send to my other device": on a computer that means a file saved where the family can find it */
        public void shareFamily(string json) { exportFamily("Miftah-family-" + DateTime.Now.ToString("yyyy-MM-dd") + ".zip", json); }
        public void exportFamily(string name, string json) {
            f.BeginInvoke(new Action(() => {
                using (var d = new SaveFileDialog { FileName = name ?? "Miftah-family.zip", Filter = "Miftāḥ family file|*.zip", InitialDirectory = Shell.Documents() }) {
                    if (d.ShowDialog(f) != DialogResult.OK) { f.Post("__native.onExported&&__native.onExported(false)"); return; }
                    var path = d.FileName;
                    Task.Run(() => {
                        var ok = false;
                        try { using (var o = File.Create(path)) Store.PackFamily(o, json); ok = true; } catch { }
                        f.Post("__native.onExported&&__native.onExported(" + (ok ? "true" : "false") + ")");
                        if (ok) Shell.Reveal(path);
                    });
                }
            }));
        }
        public void shareImage(string b64, string caption, string name) {
            var n = Store.Safe(name) ?? "Miftah-card.png";
            f.BeginInvoke(new Action(() => {
                using (var d = new SaveFileDialog { FileName = n, Filter = "Picture|*.png", InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyPictures) }) {
                    if (d.ShowDialog(f) != DialogResult.OK) return;
                    try { File.WriteAllBytes(d.FileName, Convert.FromBase64String(b64)); } catch { f.Toast("Not saved", "لم يُحفظ"); return; }
                    if (!string.IsNullOrEmpty(caption)) try { Clipboard.SetText(caption); } catch { }
                    f.Toast("Saved. The caption is copied, ready to paste into your group.", "حُفظت، ونُسخ التعليق لتلصقه في المجموعة.");
                    Shell.Reveal(d.FileName);
                }
            }));
        }
        public void shareChallenge(string json, string caption) {
            f.BeginInvoke(new Action(() => {
                using (var d = new SaveFileDialog { FileName = "Miftah-challenge.zip", Filter = "Miftāḥ challenge|*.zip", InitialDirectory = Shell.Documents() }) {
                    if (d.ShowDialog(f) != DialogResult.OK) return;
                    try {
                        using (var o = File.Create(d.FileName)) using (var z = new System.IO.Compression.ZipArchive(o, System.IO.Compression.ZipArchiveMode.Create)) {
                            var e = z.CreateEntry("challenge.json"); using (var w = e.Open()) { var b = Encoding.UTF8.GetBytes(json); w.Write(b, 0, b.Length); }
                        }
                    } catch { f.Toast("Not saved", "لم يُحفظ"); return; }
                    if (!string.IsNullOrEmpty(caption)) try { Clipboard.SetText(caption); } catch { }
                    Shell.Reveal(d.FileName);
                }
            }));
        }
        /* the page has already laid the sheet out; Windows' own print window takes it from here (it can also save a PDF) */
        public bool printPage(string name) { return true; }
        public bool mediaPickType(string mime) { Pick(mime); return true; }
        public bool mediaPick() { Pick(null); return true; }
        void Pick(string mime) {
            f.BeginInvoke(new Action(() => {
                string filter = "Photos, videos, sounds and simulations|*.mp4;*.webm;*.mov;*.m4v;*.mp3;*.m4a;*.ogg;*.wav;*.png;*.jpg;*.jpeg;*.webp;*.gif;*.html;*.htm";
                if (mime != null && mime.StartsWith("image")) filter = "Pictures|*.png;*.jpg;*.jpeg;*.webp;*.gif";
                else if (mime != null && mime.StartsWith("video")) filter = "Videos|*.mp4;*.webm;*.mov;*.m4v";
                else if (mime != null && mime.StartsWith("audio")) filter = "Sounds|*.mp3;*.m4a;*.ogg;*.wav";
                else if (mime != null && mime.Contains("html")) filter = "Simulations|*.html;*.htm";
                using (var d = new OpenFileDialog { Filter = filter, InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) }) {
                    if (d.ShowDialog(f) != DialogResult.OK) return;
                    var path = d.FileName; var kind = Store.KindOf(path); var name = Path.GetFileName(path);
                    if (kind == null) { f.Toast("That kind of file cannot be used", "لا يمكن استعمال هذا النوع من الملفات"); return; }
                    Task.Run(() => {
                        string r = null; try { r = Store.ImportMedia(path); } catch { }
                        if (r == null) f.Toast("That file could not be copied", "تعذر نسخ الملف");
                        else f.Post("__native.onMediaPicked(" + Q(r) + "," + Q(kind) + "," + Q(name) + ")");
                    });
                }
            }));
        }
        public void mediaDelete(string name) { var n = Store.Safe(name); if (n != null) try { File.Delete(Path.Combine(Store.MediaDir, n)); } catch { } }
        public void importFile() {
            f.BeginInvoke(new Action(() => {
                using (var d = new OpenFileDialog { Filter = "Miftāḥ files|*.zip;*.json;*.miftah|All files|*.*", InitialDirectory = Shell.Documents() }) {
                    if (d.ShowDialog(f) != DialogResult.OK) return;
                    var path = d.FileName;
                    Task.Run(() => {
                        string json; bool files; var ok = false;
                        try { ok = Store.ReadImport(path, out json, out files); } catch { json = null; files = false; }
                        if (!ok) { f.Toast("Could not read that file", "تعذرت قراءة الملف"); return; }
                        f.Post("__native.onImport(" + Q(json) + "," + (files ? "true" : "false") + ",false)");
                    });
                }
            }));
        }
        public void openUrl(string url) { f.BeginInvoke(new Action(() => { Uri u; if (Uri.TryCreate(url ?? "", UriKind.Absolute, out u) && (u.Scheme == "https" || u.Scheme == "http" || u.Scheme == "mailto")) Shell.Open(u.AbsoluteUri); })); }

        /* ---------- only on a computer ---------- */
        public string deskInfo() {
            var o = new Dictionary<string, object> {
                { "version", Program.Version }, { "machine", f.Link.Name }, { "data", Store.Root },
                { "installed", Shell.Installed() }, { "portable", !Shell.RunningInstalled() },
                { "tray", Store.Flag("tray") }, { "startup", Shell.StartsWithWindows() },
                { "link", f.Link.Running }, { "addresses", Link.Addresses() }, { "phones", Phones() },
                { "zoom", f.Web.ZoomFactor }, { "full", f.IsFull }, { "focus", f.FocusLock },
                { "backups", Store.Backups() }, { "audio", Store.AudioStats() },
                { "printables", Shell.PrintFolder() }
            };
            return Q(o);
        }
        List<Dictionary<string, object>> Phones() {
            var o = new List<Dictionary<string, object>>();
            foreach (var p in f.Link.Phones()) o.Add(new Dictionary<string, object> { { "id", p["id"] }, { "name", p["name"] }, { "since", p.ContainsKey("since") ? p["since"] : null }, { "last", p.ContainsKey("last") ? p["last"] : null } });
            return o;
        }
        public void deskSet(string key, bool on) {
            f.BeginInvoke(new Action(() => {
                switch (key) {
                    case "tray": Store.Set("tray", on); f.Tray.Visible = on; break;
                    case "startup": Shell.StartWithWindows(on); break;
                    case "link":
                        Store.Set("link", on);
                        if (on) { if (!f.Link.Start()) { Store.Set("link", false); f.Toast("Another program is using Miftāḥ's port. Restart the computer and try again.", "برنامج آخر يستعمل منفذ مفتاح. أعد تشغيل الحاسوب وحاول مجددًا."); } }
                        else f.Link.Stop();
                        break;
                    case "full": f.FullScreen(on); break;
                    case "focus": f.Focus(on); break;
                }
                f.Post("window.Desk&&Desk.refresh()");
            }));
        }
        public void deskZoom(double z) { f.BeginInvoke(new Action(() => { f.Web.ZoomFactor = Math.Max(0.5, Math.Min(2.5, z)); })); }
        public string pairCode() { if (!f.Link.Running) return ""; return f.Link.NewCode(); }
        public void pairEnd() { f.Link.EndCode(); }
        public void forgetPhone(string id) { f.Link.Forget(id); }
        public void rename(string name) { var n = (name ?? "").Trim(); if (n.Length > 40) n = n.Substring(0, 40); Store.Set("pcName", n); }
        public void titleBar(string theme, bool sky) { f.BeginInvoke(new Action(() => f.TitleBar(theme, sky))); }
        public void openFolder(string which) {
            var p = which == "printables" ? Shell.PrintFolder() : which == "backups" ? Store.BackupDir : which == "media" ? Store.MediaDir : Store.Root;
            Directory.CreateDirectory(p); Shell.Open(p);
        }
        public string backup(string name) { return Store.ReadBackup(name); }
        public void install() {
            f.BeginInvoke(new Action(() => {
                var ok = Shell.Install();
                f.Post("window.Desk&&Desk.onInstalled(" + (ok ? "true" : "false") + ")");
                /* the installed copy takes over: it waits for this one to close, then opens on the same page */
                if (ok && !Shell.RunningInstalled()) {
                    try { Process.Start(new ProcessStartInfo(Installer.Exe, "--handover --route=desk/pc") { UseShellExecute = false, WorkingDirectory = Installer.Dir }); } catch { return; }
                    var t = new System.Windows.Forms.Timer { Interval = 1400 }; t.Tick += delegate { t.Stop(); f.Quitting = true; f.Close(); }; t.Start();
                }
            }));
        }
        public void quit() { f.BeginInvoke(new Action(() => f.Quit())); }
        public void unlocked() { f.BeginInvoke(new Action(() => { f.Focus(false); f.Post("window.Desk&&Desk.refresh()"); })); }
        /* the sheet on the page goes straight to a PDF in Documents\Miftah\Printables */
        public void savePdf(string name) {
            f.BeginInvoke(new Action(async () => {
                var dir = Shell.PrintFolder(); Directory.CreateDirectory(dir);
                var clean = new StringBuilder(); foreach (var ch in (name ?? "Miftah")) clean.Append(Array.IndexOf(Path.GetInvalidFileNameChars(), ch) >= 0 ? '-' : ch);
                var path = Path.Combine(dir, clean.ToString().Trim() + ".pdf");
                for (int i = 2; File.Exists(path); i++) path = Path.Combine(dir, clean.ToString().Trim() + " (" + i + ").pdf");
                var ok = false;
                try {
                    var s = f.Web.CoreWebView2.Environment.CreatePrintSettings();
                    s.PageWidth = 8.27; s.PageHeight = 11.69; s.MarginTop = s.MarginBottom = s.MarginLeft = s.MarginRight = 0;
                    s.ShouldPrintBackgrounds = true; s.ShouldPrintHeaderAndFooter = false; s.ScaleFactor = 1;
                    ok = await f.Web.CoreWebView2.PrintToPdfAsync(path, s);
                } catch { }
                f.Post("window.__native.onResume&&__native.onResume()");
                f.Post("window.Desk&&Desk.onPdf(" + (ok ? Q(path) : "null") + ")");
            }));
        }
        public void reveal(string path) { if (path != null && File.Exists(path) && path.StartsWith(Shell.PrintFolder(), StringComparison.OrdinalIgnoreCase)) Shell.Reveal(path); }
        public void openPdf(string path) { if (path != null && File.Exists(path) && path.StartsWith(Shell.PrintFolder(), StringComparison.OrdinalIgnoreCase)) Shell.Open(path); }
    }
}
