// Miftah for Windows: the same lessons and the same family record as the phone, in a window made for a big screen,
// a keyboard and a printer. One file to run, no installer needed, no account, and nothing leaves the house
// unless the family pairs a phone on their own Wi-Fi.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.IO.Pipes;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace Miftah {
    static class Program {
        public const string Host = "miftah.example", Origin = "https://miftah.example";
        public const string PipeName = "Miftah.Desktop.v2";
        public static string Version = "2.0";
        static Mutex single;

        [STAThread]
        static int Main(string[] args) {
            AppDomain.CurrentDomain.AssemblyResolve += Resolve;
            Application.EnableVisualStyles(); Application.SetCompatibleTextRenderingDefault(false);
            try { Native.SetProcessDpiAwareness(2); } catch { }
            Store.Init();
            var v = Assembly.GetExecutingAssembly().GetName().Version; Version = v.Major + "." + v.Minor + (v.Build > 0 ? "." + v.Build : "");
            if (Array.IndexOf(args, "--uninstall") >= 0) { Shell.Uninstall(); return 0; }
            bool first; single = new Mutex(true, "Local\\Miftah.Desktop.v2", out first);
            if (!first) { Hand(args); return 0; }
            try { Unpack(); }
            catch (Exception e) { MessageBox.Show("Miftāḥ could not start.\n\n" + e.Message, "Miftāḥ", MessageBoxButtons.OK, MessageBoxIcon.Error); return 1; }
            return Run(args);
        }
        [MethodImpl(MethodImplOptions.NoInlining)]
        static int Run(string[] args) {
            string have = null;
            try { have = CoreWebView2Environment.GetAvailableBrowserVersionString(); } catch { }
            if (string.IsNullOrEmpty(have)) {
                if (MessageBox.Show("Miftāḥ needs Microsoft Edge WebView2, a free part of Windows that is missing on this computer.\n\nOpen Microsoft's page to install it?", "Miftāḥ", MessageBoxButtons.YesNo, MessageBoxIcon.Information) == DialogResult.Yes)
                    Shell.Open("https://developer.microsoft.com/microsoft-edge/webview2/#download");
                return 1;
            }
            var f = new MainForm(args);
            Application.Run(f);
            GC.KeepAlive(single);
            return 0;
        }

        /* a second launch (a shortcut, a dropped file, the tray) hands its request to the window already open */
        static void Hand(string[] args) {
            try {
                using (var p = new NamedPipeClientStream(".", PipeName, PipeDirection.Out)) {
                    p.Connect(2500);
                    var b = Encoding.UTF8.GetBytes(string.Join("\n", args.Length == 0 ? new[] { "--show" } : args));
                    p.Write(b, 0, b.Length);
                }
            } catch { }
        }

        /* the WebView2 libraries travel inside this .exe */
        static readonly Dictionary<string, Assembly> loaded = new Dictionary<string, Assembly>();
        static Assembly Resolve(object s, ResolveEventArgs e) {
            var n = new AssemblyName(e.Name).Name;
            lock (loaded) {
                Assembly a; if (loaded.TryGetValue(n, out a)) return a;
                using (var r = Assembly.GetExecutingAssembly().GetManifestResourceStream(n + ".dll")) {
                    if (r == null) return null;
                    var b = new byte[r.Length]; r.Read(b, 0, b.Length);
                    a = Assembly.Load(b); loaded[n] = a; return a;
                }
            }
        }
        /* the lessons and the native loader are unpacked once per version, beside the family's data */
        static void Unpack() {
            var asm = Assembly.GetExecutingAssembly();
            using (var s = asm.GetManifestResourceStream("app.zip")) {
                string tag = "app-" + Version + "-" + s.Length;
                Store.AppDir = Path.Combine(Store.Root, tag);
                if (!File.Exists(Path.Combine(Store.AppDir, ".done"))) {
                    if (Directory.Exists(Store.AppDir)) Directory.Delete(Store.AppDir, true);
                    using (var z = new ZipArchive(s, ZipArchiveMode.Read)) z.ExtractToDirectory(Store.AppDir);
                    File.WriteAllText(Path.Combine(Store.AppDir, ".done"), "ok");
                    foreach (var d in Directory.GetDirectories(Store.Root, "app-*")) if (!d.Equals(Store.AppDir, StringComparison.OrdinalIgnoreCase)) try { Directory.Delete(d, true); } catch { }
                }
            }
            var bin = Path.Combine(Store.Root, "bin"); Directory.CreateDirectory(bin);
            var loader = Path.Combine(bin, "WebView2Loader.dll");
            using (var s = asm.GetManifestResourceStream("WebView2Loader.dll")) {
                if (!File.Exists(loader) || new FileInfo(loader).Length != s.Length) {
                    try { using (var o = File.Create(loader)) s.CopyTo(o); } catch { /* in use by another copy: the same version is already there */ }
                }
            }
            SetLoader(bin);
        }
        [MethodImpl(MethodImplOptions.NoInlining)]
        static void SetLoader(string bin) { CoreWebView2Environment.SetLoaderDllFolderPath(bin); }
    }

    class MainForm : Form {
        public WebView2 Web;
        public Link Link = new Link();
        public NotifyIcon Tray;
        public bool Quitting, FocusLock, Ready;
        readonly string[] startArgs;
        Bridge bridge;
        string pendingRoute;
        readonly List<string> pendingFiles = new List<string>();
        FormWindowState beforeFull = FormWindowState.Normal; Rectangle beforeFullBounds; bool full;
        System.Windows.Forms.Timer clock;
        string lastRemind;

        public MainForm(string[] args) {
            startArgs = args;
            Text = "Miftāḥ";
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }
            AutoScaleMode = AutoScaleMode.Dpi;
            MinimumSize = new Size(400, 560);
            var dark = Store.Get("theme", "dark") as string == "dark";
            BackColor = dark ? Color.FromArgb(7, 8, 13) : Color.FromArgb(246, 239, 224);
            RestoreBounds0();
            Web = new WebView2 { Dock = DockStyle.Fill, DefaultBackgroundColor = BackColor };
            Controls.Add(Web);
            bridge = new Bridge(this);
            ParseArgs(args);
            if (Array.IndexOf(args, "--tray") >= 0) { WindowState = FormWindowState.Minimized; ShowInTaskbar = false; }
            Listen();
            SetupTray();
            clock = new System.Windows.Forms.Timer { Interval = 20000 }; clock.Tick += delegate { Remind(); }; clock.Start();
            if (Store.Flag("link")) Link.Start();
            Link.Merge = MergeFromPhone;
            Link.Event = json => Post("window.Desk&&Desk.onLink(" + json + ")");
        }

        protected override void OnHandleCreated(EventArgs e) {
            base.OnHandleCreated(e);
            TitleBar(Store.Get("theme", "dark") as string, false);
        }
        protected override async void OnShown(EventArgs e) {
            base.OnShown(e);
            if (Array.IndexOf(startArgs, "--tray") >= 0) Hide();
            try { await Init(); }
            catch (Exception x) { MessageBox.Show(this, "Miftāḥ could not open its window.\n\n" + x.Message, "Miftāḥ", MessageBoxButtons.OK, MessageBoxIcon.Error); Quitting = true; Close(); }
        }

        async Task Init() {
            var opts = new CoreWebView2EnvironmentOptions();
            var args = "--autoplay-policy=no-user-gesture-required --disable-features=msSmartScreenProtection,ElasticOverscroll";
            var dbg = Environment.GetEnvironmentVariable("MIFTAH_DEBUG_PORT");
            if (!string.IsNullOrEmpty(dbg)) args += " --remote-debugging-port=" + dbg;
            opts.AdditionalBrowserArguments = args;
            var env = await CoreWebView2Environment.CreateAsync(null, Path.Combine(Store.Root, "webview"), opts);
            await Web.EnsureCoreWebView2Async(env);
            var cw = Web.CoreWebView2;
            var st = cw.Settings;
            st.AreDevToolsEnabled = !string.IsNullOrEmpty(dbg);
            st.AreDefaultContextMenusEnabled = false;
            st.IsStatusBarEnabled = false;
            st.AreBrowserAcceleratorKeysEnabled = false;
            st.IsGeneralAutofillEnabled = false;
            st.IsPasswordAutosaveEnabled = false;
            st.IsSwipeNavigationEnabled = false;
            st.IsZoomControlEnabled = true;
            st.AreHostObjectsAllowed = true;
            st.IsWebMessageEnabled = true;
            try { st.IsPinchZoomEnabled = true; } catch { }
            object z = Store.Get("zoom", null); if (z != null) try { Web.ZoomFactor = Convert.ToDouble(z); } catch { }
            Web.ZoomFactorChanged += delegate { Store.Set("zoom", Web.ZoomFactor); };

            cw.AddHostObjectToScript("miftah", bridge);
            await cw.AddScriptToExecuteOnDocumentCreatedAsync(Shim());
            cw.AddWebResourceRequestedFilter(Program.Origin + "/*", CoreWebView2WebResourceContext.All);
            cw.WebResourceRequested += Serve;
            cw.NavigationStarting += (s, e) => {
                var u = e.Uri ?? "";
                if (u.StartsWith(Program.Origin + "/")) return;
                e.Cancel = true; Outside(u);
            };
            cw.FrameNavigationStarting += (s, e) => {
                Uri u; if (!Uri.TryCreate(e.Uri ?? "", UriKind.Absolute, out u)) { e.Cancel = true; return; }
                if (u.Host == Program.Host || VideoHost(u.Host) || SimHost(u.Host) || u.Scheme == "about" || u.Scheme == "blob" || u.Scheme == "data") return;
                e.Cancel = true;
            };
            cw.NewWindowRequested += (s, e) => { e.Handled = true; Outside(e.Uri); };
            cw.PermissionRequested += (s, e) => {
                var mine = (e.Uri ?? "").StartsWith(Program.Origin);
                e.State = mine && (e.PermissionKind == CoreWebView2PermissionKind.Microphone || e.PermissionKind == CoreWebView2PermissionKind.Autoplay || e.PermissionKind == CoreWebView2PermissionKind.ClipboardRead)
                    ? CoreWebView2PermissionState.Allow : CoreWebView2PermissionState.Deny;
            };
            cw.DownloadStarting += (s, e) => { e.Cancel = true; };
            cw.DocumentTitleChanged += (s, e) => { var t = cw.DocumentTitle; Text = string.IsNullOrEmpty(t) || t.StartsWith("http") ? "Miftāḥ" : t; };
            cw.ContainsFullScreenElementChanged += (s, e) => FullScreen(cw.ContainsFullScreenElement);
            cw.ProcessFailed += (s, e) => { if (e.ProcessFailedKind == CoreWebView2ProcessFailedKind.RenderProcessExited || e.ProcessFailedKind == CoreWebView2ProcessFailedKind.RenderProcessUnresponsive) try { cw.Reload(); } catch { } };
            cw.WebMessageReceived += Message;
            cw.NavigationCompleted += (s, e) => {
                Ready = true;
                foreach (var f in pendingFiles) OpenFile(f);
                pendingFiles.Clear();
                if (pendingRoute != null) { Route(pendingRoute); pendingRoute = null; }
            };
            cw.Navigate(Program.Origin + "/index.html");
        }

        /* ---------- what the page asks for ---------- */
        static bool VideoHost(string h) {
            if (h == null) return false;
            return h == "www.youtube-nocookie.com" || h == "youtube-nocookie.com" || h.EndsWith(".youtube.com") || h.EndsWith(".ytimg.com") || h.EndsWith(".googlevideo.com") || h.EndsWith(".ggpht.com") || h == "www.gstatic.com" || h == "jnn-pa.googleapis.com";
        }
        static bool SimHost(string h) { return h == "cdn.tailwindcss.com" || h == "cdnjs.cloudflare.com" || h == "cdn.jsdelivr.net" || h == "unpkg.com" || h == "fonts.googleapis.com" || h == "fonts.gstatic.com"; }
        void Outside(string u) {
            Uri x; if (!Uri.TryCreate(u ?? "", UriKind.Absolute, out x)) return;
            if (x.Scheme != "https" && x.Scheme != "http" && x.Scheme != "mailto") return;
            if (VideoHost(x.Host) || x.Host == "youtube.com") return;   /* no way out of a video to the site */
            Shell.Open(x.AbsoluteUri);
        }

        void Serve(object sender, CoreWebView2WebResourceRequestedEventArgs e) {
            var cw = Web.CoreWebView2;
            Uri u; if (!Uri.TryCreate(e.Request.Uri, UriKind.Absolute, out u) || u.Host != Program.Host) return;
            var path = Uri.UnescapeDataString(u.AbsolutePath);
            if (path == "/" || path == "") path = "/index.html";
            string range = null; try { if (e.Request.Headers.Contains("Range")) range = e.Request.Headers.GetHeader("Range"); } catch { }
            if (path.StartsWith("/audio/") && path.EndsWith(".mp3")) {
                /* fetched from its source the first time: off the window's thread */
                var def = e.GetDeferral(); var rel = path.Substring(7);
                Task.Run(() => Store.CachedAudio(rel)).ContinueWith(t => {
                    BeginInvoke(new Action(() => { try { e.Response = Respond(cw, t.Result, range); } catch { } def.Complete(); }));
                });
                return;
            }
            string file = null;
            if (path.StartsWith("/media/")) { var n = Store.Safe(path.Substring(7)); if (n != null) file = Path.Combine(Store.MediaDir, n); }
            else if (path.StartsWith("/voice/")) { var n = Store.Safe(path.Substring(7)); if (n != null) file = Path.Combine(Store.VoiceDir, n); }
            else { var rel = path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar); if (!rel.Contains("..")) file = Path.Combine(Store.AppDir, rel); }
            e.Response = Respond(cw, file, range);
        }
        static CoreWebView2WebResourceResponse Respond(CoreWebView2 cw, string file, string range) {
            if (file == null || !File.Exists(file)) return cw.Environment.CreateWebResourceResponse(null, 404, "Not Found", "Content-Type: text/plain");
            var mime = Store.Mime(file);
            long len = new FileInfo(file).Length;
            var name = Path.GetFileName(file).ToLowerInvariant();
            string cache = name.EndsWith(".html") || name.EndsWith(".js") || name.EndsWith(".css") || name.EndsWith(".json") ? "no-cache" : "max-age=31536000";
            var head = "Content-Type: " + mime + "\r\nCache-Control: " + cache + "\r\nX-Content-Type-Options: nosniff\r\nAccept-Ranges: bytes";
            Stream s = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete, 65536, FileOptions.SequentialScan);
            if (range != null && range.StartsWith("bytes=") && len > 0) {
                var p = range.Substring(6).Split(',')[0].Split('-'); long a = 0, b = len - 1, x;
                if (p[0].Length > 0 && long.TryParse(p[0], out x)) a = x;
                else if (p.Length > 1 && long.TryParse(p[1], out x)) a = Math.Max(0, len - x);
                if (p.Length > 1 && p[0].Length > 0 && long.TryParse(p[1], out x)) b = Math.Min(x, len - 1);
                if (a >= len) { s.Dispose(); return cw.Environment.CreateWebResourceResponse(null, 416, "Range Not Satisfiable", "Content-Range: bytes */" + len); }
                s.Seek(a, SeekOrigin.Begin);
                return cw.Environment.CreateWebResourceResponse(new Slice(s, b - a + 1), 206, "Partial Content", head + "\r\nContent-Length: " + (b - a + 1) + "\r\nContent-Range: bytes " + a + "-" + b + "/" + len);
            }
            return cw.Environment.CreateWebResourceResponse(s, 200, "OK", head + "\r\nContent-Length: " + len);
        }

        /* files dropped on the window arrive with their real place on disk */
        void Message(object sender, CoreWebView2WebMessageReceivedEventArgs e) {
            string kind = null; try { kind = e.TryGetWebMessageAsString(); } catch { }
            if (kind != "drop") return;
            var paths = new List<string>();
            try { foreach (var o in e.AdditionalObjects) { var f = o as CoreWebView2File; if (f != null) paths.Add(f.Path); } } catch { }
            foreach (var p in paths) OpenFile(p);
        }
        public void OpenFile(string path) {
            if (!Ready) { pendingFiles.Add(path); return; }
            if (!File.Exists(path)) return;
            var ext = Path.GetExtension(path).ToLowerInvariant();
            if (ext == ".zip" || ext == ".json" || ext == ".miftah") {
                Task.Run(() => { string json; bool files; var ok = false; try { ok = Store.ReadImport(path, out json, out files); } catch { json = null; files = false; }
                    BeginInvoke(new Action(() => {
                        if (!ok) { Toast("That file could not be read", "تعذرت قراءة الملف"); return; }
                        Post("__native.onImport(" + Store.Json.Serialize(json) + "," + (files ? "true" : "false") + ",true)");
                    }));
                });
                return;
            }
            var kind = Store.KindOf(path);
            if (kind == null) { Toast("Miftāḥ cannot use that kind of file", "لا يستعمل مفتاح هذا النوع من الملفات"); return; }
            var name = Path.GetFileName(path);
            Task.Run(() => { string r = null; try { r = Store.ImportMedia(path); } catch { }
                BeginInvoke(new Action(() => {
                    if (r == null) { Toast("That file could not be copied", "تعذر نسخ الملف"); return; }
                    Post("window.Desk&&Desk.onDropMedia(" + Store.Json.Serialize(r) + "," + Store.Json.Serialize(kind) + "," + Store.Json.Serialize(name) + ")");
                }));
            });
        }
        public void Toast(string en, string ar) { Post("A.toast(A.L([" + Store.Json.Serialize(en) + "," + Store.Json.Serialize(ar) + "]))"); }
        public void Post(string js) {
            if (InvokeRequired) { BeginInvoke(new Action(() => Post(js))); return; }
            try { if (Web != null && Web.CoreWebView2 != null) Web.CoreWebView2.ExecuteScriptAsync(js); } catch { }
        }
        public void Route(string r) {
            if (!Ready) { pendingRoute = r; return; }
            Post("__native.onRoute(" + Store.Json.Serialize(r.StartsWith("#") ? r : "#/" + r) + ")");
        }

        /* the phone sends its record; the page joins it with this one, exactly as it joins a family file */
        string MergeFromPhone(string json, string phone) {
            string res = null; var done = new ManualResetEvent(false);
            BeginInvoke(new Action(async () => {
                try {
                    var r = await Web.CoreWebView2.ExecuteScriptAsync("window.Desk?Desk.lanMerge(" + Store.Json.Serialize(json) + "," + Store.Json.Serialize(phone ?? "") + "):null");
                    res = Store.Json.Deserialize<string>(r);
                } catch { }
                done.Set();
            }));
            done.WaitOne(90000);
            return res;
        }

        /* ---------- arguments: from the command line, a shortcut, or a second launch ---------- */
        void ParseArgs(string[] args) {
            foreach (var a in args) {
                if (a.StartsWith("--route=")) Route(a.Substring(8));
                else if (!a.StartsWith("--") && File.Exists(a)) OpenFile(a);
            }
        }
        void Listen() {
            var t = new Thread(() => {
                while (!Quitting) {
                    try {
                        using (var p = new NamedPipeServerStream(Program.PipeName, PipeDirection.In, 1, PipeTransmissionMode.Byte, PipeOptions.None)) {
                            p.WaitForConnection();
                            var ms = new MemoryStream(); p.CopyTo(ms);
                            var args = Encoding.UTF8.GetString(ms.ToArray()).Split('\n');
                            BeginInvoke(new Action(() => { Bring(); ParseArgs(args); }));
                        }
                    } catch { Thread.Sleep(200); }
                }
            }) { IsBackground = true, Name = "single-instance" };
            t.Start();
        }
        public void Bring() {
            if (!Visible) Show();
            ShowInTaskbar = true;
            if (WindowState == FormWindowState.Minimized) WindowState = Store.Flag("max") ? FormWindowState.Maximized : FormWindowState.Normal;
            Activate(); BringToFront();
            Native.SetForegroundWindow(Handle);
        }

        /* ---------- the window ---------- */
        void RestoreBounds0() {
            StartPosition = FormStartPosition.Manual;
            var wa = Screen.PrimaryScreen.WorkingArea;
            int w = Math.Min(1360, wa.Width - 80), h = Math.Min(880, wa.Height - 60);
            var r = new Rectangle(wa.Left + (wa.Width - w) / 2, wa.Top + (wa.Height - h) / 2, w, h);
            var saved = Store.Get("bounds", null) as System.Collections.ArrayList;
            if (saved != null && saved.Count == 4) {
                var s = new Rectangle(Convert.ToInt32(saved[0]), Convert.ToInt32(saved[1]), Convert.ToInt32(saved[2]), Convert.ToInt32(saved[3]));
                foreach (var sc in Screen.AllScreens) if (sc.WorkingArea.IntersectsWith(s) && s.Width >= 400 && s.Height >= 400) { r = s; break; }
            }
            Bounds = r;
            if (Store.Flag("max")) WindowState = FormWindowState.Maximized;
        }
        void KeepBounds() {
            if (full) return;
            Store.Set("max", WindowState == FormWindowState.Maximized);
            var b = WindowState == FormWindowState.Normal ? Bounds : RestoreBounds;
            Store.Set("bounds", new System.Collections.ArrayList { b.X, b.Y, b.Width, b.Height });
        }
        protected override void OnResizeEnd(EventArgs e) { base.OnResizeEnd(e); KeepBounds(); }
        protected override void OnFormClosing(FormClosingEventArgs e) {
            if (!Quitting && FocusLock && e.CloseReason == CloseReason.UserClosing) { e.Cancel = true; Post("window.Desk&&Desk.askUnlock()"); return; }
            if (!Quitting && e.CloseReason == CloseReason.UserClosing && Store.Flag("tray")) {
                e.Cancel = true; KeepBounds(); Hide();
                if (!Store.Flag("trayTold")) { Store.Set("trayTold", true); Tray.ShowBalloonTip(4000, "Miftāḥ is still here", "It waits in the tray so your phone can sync. Right-click the key to quit.", ToolTipIcon.None); }
                return;
            }
            KeepBounds();
            Link.Stop();
            if (Tray != null) { Tray.Visible = false; Tray.Dispose(); }
            base.OnFormClosing(e);
        }
        protected override void OnActivated(EventArgs e) { base.OnActivated(e); Post("window.__native&&__native.onResume&&__native.onResume()"); }

        public void TitleBar(string theme, bool sky) {
            if (!IsHandleCreated) return;
            var dark = theme == "dark" || sky;
            var bg = sky ? (theme == "dark" ? Color.FromArgb(7, 8, 13) : Color.FromArgb(22, 54, 104)) : dark ? Color.FromArgb(7, 8, 13) : Color.FromArgb(246, 239, 224);
            var fg = dark ? Color.FromArgb(240, 233, 220) : Color.FromArgb(40, 33, 22);
            Native.Caption(Handle, dark, bg, fg);
            if (Web != null) Web.DefaultBackgroundColor = theme == "dark" ? Color.FromArgb(7, 8, 13) : Color.FromArgb(246, 239, 224);
        }
        public void FullScreen(bool on) {
            if (on == full) return;
            full = on;
            if (on) {
                beforeFull = WindowState; beforeFullBounds = WindowState == FormWindowState.Normal ? Bounds : RestoreBounds;
                FormBorderStyle = FormBorderStyle.None; WindowState = FormWindowState.Normal; Bounds = Screen.FromControl(this).Bounds;
            } else {
                FormBorderStyle = FormBorderStyle.Sizable; Bounds = beforeFullBounds; WindowState = beforeFull;
                TitleBar(Store.Get("theme", "dark") as string, false);
            }
            Post("window.Desk&&Desk.onFull(" + (on ? "true" : "false") + ")");
        }
        public bool IsFull { get { return full; } }
        /* a child's session: the whole screen, and only a grown-up can leave it */
        public void Focus(bool on) {
            FocusLock = on; FullScreen(on); TopMost = on;
        }

        /* ---------- the tray: home base for the phone, and the daily reminder ---------- */
        void SetupTray() {
            Tray = new NotifyIcon { Icon = Icon, Text = "Miftāḥ", Visible = Store.Flag("tray") };
            var m = new ContextMenuStrip();
            m.Items.Add("Open Miftāḥ", null, delegate { Bring(); });
            m.Items.Add("Parent area", null, delegate { Bring(); Route("parent"); });
            m.Items.Add("Phone and computer", null, delegate { Bring(); Route("desk/link"); });
            m.Items.Add(new ToolStripSeparator());
            m.Items.Add("Quit Miftāḥ", null, delegate { Quit(); });
            Tray.ContextMenuStrip = m;
            Tray.DoubleClick += delegate { Bring(); };
            Tray.BalloonTipClicked += delegate { Bring(); Route("home"); };
        }
        public void Quit() {
            if (FocusLock) { Bring(); Post("window.Desk&&Desk.askUnlock()"); return; }
            Quitting = true; Close();
        }
        public Dictionary<string, object> Config;
        void Remind() {
            if (Config == null) return;
            object r; if (!Config.TryGetValue("remind", out r)) return;
            var rm = r as Dictionary<string, object>; if (rm == null) return;
            object on; if (!rm.TryGetValue("on", out on) || !(on is bool) || !(bool)on) return;
            int h = rm.ContainsKey("h") ? Convert.ToInt32(rm["h"]) : 9, mi = rm.ContainsKey("m") ? Convert.ToInt32(rm["m"]) : 0;
            var now = DateTime.Now; var today = now.ToString("yyyy-MM-dd");
            if (lastRemind == today || now.Hour != h || now.Minute < mi || now.Minute > mi + 5) return;
            lastRemind = today;
            if (Visible && ContainsFocus) return;   /* already here */
            var ar = (Config.ContainsKey("lang") ? Config["lang"] as string : "") == "ar";
            var next = Config.ContainsKey("next") ? Config["next"] as string : "";
            bool was = Tray.Visible; Tray.Visible = true;
            Tray.ShowBalloonTip(8000, ar ? "باب اليوم ينتظر" : "Today’s door is waiting", string.IsNullOrEmpty(next) ? (ar ? "افتح مفتاح" : "Open Miftāḥ") : next, ToolTipIcon.None);
            if (!was) { var t = new System.Windows.Forms.Timer { Interval = 12000 }; t.Tick += delegate { t.Stop(); t.Dispose(); Tray.Visible = Store.Flag("tray"); }; t.Start(); }
        }

        /* the page's adapter: the same bridge the phone has, plus what only a computer can do */
        static string Shim() {
            using (var s = Assembly.GetExecutingAssembly().GetManifestResourceStream("shim.js"))
            using (var r = new StreamReader(s, Encoding.UTF8)) return r.ReadToEnd();
        }
    }

    /* part of a file, for a video that is being sought through */
    class Slice : Stream {
        readonly Stream s; long left;
        public Slice(Stream inner, long length) { s = inner; left = length; }
        public override int Read(byte[] buffer, int offset, int count) { if (left <= 0) return 0; int n = s.Read(buffer, offset, (int)Math.Min(count, left)); left -= n; return n; }
        public override bool CanRead { get { return true; } }
        public override bool CanSeek { get { return false; } }
        public override bool CanWrite { get { return false; } }
        public override long Length { get { throw new NotSupportedException(); } }
        public override long Position { get { throw new NotSupportedException(); } set { throw new NotSupportedException(); } }
        public override void Flush() { }
        public override long Seek(long o, SeekOrigin r) { throw new NotSupportedException(); }
        public override void SetLength(long v) { throw new NotSupportedException(); }
        public override void Write(byte[] b, int o, int c) { throw new NotSupportedException(); }
        protected override void Dispose(bool d) { if (d) s.Dispose(); base.Dispose(d); }
    }
}
