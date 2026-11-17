// Miftah-Setup.exe: installs Miftah the way Windows programs are installed. One window, three moments
// (what will happen, the copy, done), in the app's own colours, following the computer's light or dark setting
// and its language (English or Arabic). No administrator: it installs for this Windows user, in their own Programs folder.
//   Miftah-Setup.exe            the window
//   Miftah-Setup.exe --silent   installs with the usual choices and no window (for scripts and testing)
using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

namespace Miftah {
    static class SetupProgram {
        [DllImport("shcore.dll")] static extern int SetProcessDpiAwareness(int v);
        public static string Version {
            get { var v = Assembly.GetExecutingAssembly().GetName().Version; return v.Major + "." + v.Minor + (v.Build > 0 ? "." + v.Build : ""); }
        }
        public static Stream Payload() { return Assembly.GetExecutingAssembly().GetManifestResourceStream("Miftah.exe"); }

        [STAThread]
        static int Main(string[] args) {
            try { SetProcessDpiAwareness(2); } catch { }
            Application.EnableVisualStyles(); Application.SetCompatibleTextRenderingDefault(false);
            bool one; var m = new Mutex(true, "Local\\Miftah.Setup", out one);
            if (!one) return 0;
            if (Array.IndexOf(args, "--silent") >= 0) {
                try {
                    Installer.CloseRunning(8000);
                    using (var s = Payload()) Installer.Install(null, s, Array.IndexOf(args, "--no-desktop") < 0, Version, null);
                    return 0;
                } catch (Exception e) { Console.Error.WriteLine(e.Message); return 1; }
            }
            Application.Run(new SetupForm());
            GC.KeepAlive(m);
            return 0;
        }
    }

    class SetupForm : Form {
        [DllImport("dwmapi.dll")] static extern int DwmSetWindowAttribute(IntPtr h, int a, ref int v, int s);
        /* MIFTAH_SETUP_LANG and MIFTAH_SETUP_THEME choose a look for screenshots; otherwise the computer decides */
        readonly bool ar = (Environment.GetEnvironmentVariable("MIFTAH_SETUP_LANG") ?? CultureInfo.CurrentUICulture.TwoLetterISOLanguageName) == "ar";
        readonly bool dark;
        public readonly Color bg, card, ink, mute, gold, onGold, line;
        public readonly float k;
        public Font fTitle, fBody, fBodyB, fSmall, fSmallB, fTiny, fBtn, fHero, fHeroAr;
        Image icon;
        string stage = "start"; double prog; string error;
        readonly string have = Installer.Installed() ? Installer.InstalledVersion() : null;
        Toggle desk, boot, openNow;
        Btn go, cancel;

        string T(string en, string a) { return ar ? a : en; }

        public SetupForm() {
            try { using (var r = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize")) dark = r != null && Convert.ToInt32(r.GetValue("AppsUseLightTheme", 1)) == 0; } catch { }
            var th = Environment.GetEnvironmentVariable("MIFTAH_SETUP_THEME"); if (th == "dark" || th == "light") dark = th == "dark";
            /* the app's own palette (web/css/01-foundation.css) */
            bg = dark ? C(0x0b0d14) : C(0xfbf6ea); card = dark ? C(0x151925) : C(0xfffdf8);
            ink = dark ? C(0xf0e9dc) : C(0x282116); mute = dark ? C(0x9a937f) : C(0x7a6d55);
            gold = dark ? C(0xd9b26f) : C(0xa8782c); onGold = dark ? C(0x1a1206) : C(0xfffaf0);
            line = dark ? Color.FromArgb(40, 240, 228, 206) : Color.FromArgb(46, 70, 50, 20);

            using (var g = CreateGraphics()) k = g.DpiX / 96f;
            AutoScaleMode = AutoScaleMode.None;
            Text = T("Install Miftāḥ", "تثبيت مفتاح");
            FormBorderStyle = FormBorderStyle.FixedSingle; MaximizeBox = false; MinimizeBox = true;
            StartPosition = FormStartPosition.CenterScreen;
            ClientSize = new Size(S(800), S(480));
            BackColor = bg; DoubleBuffered = true;
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }
            try { icon = LoadIcon(); } catch { }

            var face = ar ? "Segoe UI" : (FontFamily.Families.Length > 0 && Array.Exists(FontFamily.Families, f => f.Name == "Segoe UI Variable Display") ? "Segoe UI Variable Display" : "Segoe UI");
            fTitle = new Font(face, 20f, FontStyle.Bold, GraphicsUnit.Point);
            fBody = new Font("Segoe UI", 10.5f, FontStyle.Regular, GraphicsUnit.Point);
            fBodyB = new Font("Segoe UI Semibold", 10.5f, FontStyle.Regular, GraphicsUnit.Point);
            fSmall = new Font("Segoe UI", 9f, FontStyle.Regular, GraphicsUnit.Point);
            fSmallB = new Font("Segoe UI Semibold", 9f, FontStyle.Regular, GraphicsUnit.Point);
            fTiny = new Font("Segoe UI", 8f, FontStyle.Bold, GraphicsUnit.Point);
            fHero = new Font(face, 22f, FontStyle.Bold, GraphicsUnit.Point);
            fHeroAr = new Font("Segoe UI", 16f, FontStyle.Regular, GraphicsUnit.Point);
            fBtn = new Font("Segoe UI", 10.5f, FontStyle.Bold, GraphicsUnit.Point);

            desk = new Toggle(this, T("A shortcut on the desktop", "اختصار على سطح المكتب"), true) { Sub = T("Miftāḥ is always in the Start menu", "مفتاح دائمًا في قائمة ابدأ"), Glyph = "desk" };
            boot = new Toggle(this, T("Open with Windows", "افتحه مع ويندوز"), Installer.StartsWithWindows()) { Sub = T("Quietly in the tray, for the phone and reminders", "بهدوء في شريط المهام، للهاتف والتذكير"), Glyph = "sun" };
            openNow = new Toggle(this, T("Open Miftāḥ now", "افتح مفتاح الآن"), true) { Visible = false, Glyph = "go", Sub = T("It opens where your family left off", "يفتح حيث توقفت عائلتك") };
            if (ar) desk.RightToLeft = boot.RightToLeft = openNow.RightToLeft = RightToLeft.Yes;
            go = new Btn(this, have == null ? T("Install", "ثبّت") : T("Update", "حدّث"), true);
            cancel = new Btn(this, T("Cancel", "إلغاء"), false);
            go.Click += delegate { if (stage == "start") Run(); else if (stage == "done") Finish(); else if (stage == "error") { stage = "start"; Lay(); } };
            cancel.Click += delegate { if (stage == "done") openNow.On = false; Close(); };
            Lay();
        }
        static Color C(int x) { return Color.FromArgb((x >> 16) & 255, (x >> 8) & 255, x & 255); }
        public int S(float v) { return (int)Math.Round(v * k); }
        Image LoadIcon() {
            try {
                using (var p = Assembly.GetExecutingAssembly().GetManifestResourceStream("icon.png")) if (p != null) return Image.FromStream(p);
            } catch { }
            return Icon.ExtractAssociatedIcon(Application.ExecutablePath).ToBitmap();
        }

        protected override void OnHandleCreated(EventArgs e) {
            base.OnHandleCreated(e);
            try {
                int d = dark ? 1 : 0; DwmSetWindowAttribute(Handle, 20, ref d, 4);
                int c = bg.R | (bg.G << 8) | (bg.B << 16); DwmSetWindowAttribute(Handle, 35, ref c, 4);
                int t = ink.R | (ink.G << 8) | (ink.B << 16); DwmSetWindowAttribute(Handle, 36, ref t, 4);
            } catch { }
        }

        /* ---------- layout: the sky on one side, the choices on the other; nothing touches an edge ---------- */
        const int HW = 300, M = 40;
        int X0 { get { return HW + M; } }
        void Lay() {
            int w = ClientSize.Width, cw = w - S(X0) - S(M);
            desk.Visible = boot.Visible = stage == "start";
            openNow.Visible = false;
            desk.Bounds = new Rectangle(S(X0), S(246), cw, S(56));
            boot.Bounds = new Rectangle(S(X0), S(310), cw, S(56));
            openNow.Bounds = new Rectangle(S(X0), S(310), cw, S(56));
            go.Visible = stage != "copy"; cancel.Visible = stage == "start" || stage == "error" || stage == "done";
            cancel.Text = stage == "done" ? T("Close", "إغلاق") : T("Cancel", "إلغاء");
            go.Text = stage == "done" ? T("Open Miftāḥ", "افتح مفتاح") : stage == "error" ? T("Try again", "أعد المحاولة") : have == null ? T("Install", "ثبّت") : have == SetupProgram.Version ? T("Reinstall", "أعد التثبيت") : T("Update", "حدّث");
            int bw = S(150), bh = S(44), y = ClientSize.Height - S(32) - bh;
            go.Bounds = new Rectangle(w - S(M) - bw, y, bw, bh);
            cancel.Bounds = new Rectangle(w - S(M) - bw - S(12) - S(112), y, S(112), bh);
            /* Arabic reads from the right: the same layout, mirrored by hand so the mark and the text are never mirrored */
            if (ar) foreach (Control c in new Control[] { desk, boot, openNow, go, cancel }) c.Left = w - c.Right;
            Invalidate();
        }
        Rectangle Mir(Rectangle r) { return ar ? new Rectangle(ClientSize.Width - r.Right, r.Y, r.Width, r.Height) : r; }

        /* the welcome screen's night: a deep sky, a few stars, a warm light behind the key */
        void Sky(Graphics g) {
            var hr = Mir(new Rectangle(0, 0, S(HW), ClientSize.Height));
            using (var b = new LinearGradientBrush(hr, C(0x0d1433), C(0x1d2752), 90f)) g.FillRectangle(b, hr);
            var rnd = new Random(7);
            for (int i = 0; i < 46; i++) {
                float sx = hr.X + (float)rnd.NextDouble() * hr.Width, sy = (float)rnd.NextDouble() * hr.Height * .78f, r = (float)(rnd.NextDouble() * 1.4 + .5) * k;
                using (var b = new SolidBrush(Color.FromArgb(60 + rnd.Next(150), 255, 244, 214))) g.FillEllipse(b, sx, sy, r, r);
            }
            int cx = hr.X + hr.Width / 2, cy = S(150);
            using (var gp = new GraphicsPath()) {
                gp.AddEllipse(cx - S(120), cy - S(120), S(240), S(240));
                using (var pb = new PathGradientBrush(gp) { CenterColor = Color.FromArgb(90, 241, 213, 158), SurroundColors = new[] { Color.FromArgb(0, 241, 213, 158) } }) g.FillPath(pb, gp);
            }
            if (icon != null) {
                var ir = new Rectangle(cx - S(48), cy - S(48), S(96), S(96));
                using (var sh = Round(new Rectangle(ir.X, ir.Y + S(8), ir.Width, ir.Height), S(24))) using (var b = new SolidBrush(Color.FromArgb(70, 0, 0, 0))) g.FillPath(b, sh);
                using (var clip = Round(ir, S(24))) { var st = g.Save(); g.SetClip(clip); g.DrawImage(icon, Rectangle.Inflate(ir, S(1), S(1))); g.Restore(st); }
            }
            var white = C(0xf6efe0);
            TextRenderer.DrawText(g, "Miftāḥ", fHero, new Rectangle(hr.X, cy + S(62), hr.Width, S(40)), white, TextFormatFlags.HorizontalCenter | TextFormatFlags.NoPrefix);
            TextRenderer.DrawText(g, "مِفْتَاح", fHeroAr, new Rectangle(hr.X, cy + S(100), hr.Width, S(34)), C(0xf1d59e), TextFormatFlags.HorizontalCenter | TextFormatFlags.NoPrefix);
            /* three plain facts, low in the sky */
            string[] facts = { T("Lessons for ages 2 to 18", "دروس من سنتين إلى ١٨"), T("Works without the internet", "يعمل بلا إنترنت"), T("No account, no adverts", "بلا حساب ولا إعلانات") };
            for (int i = 0; i < facts.Length; i++) {
                int fy = ClientSize.Height - S(118) + i * S(28);
                var dot = new Rectangle(ar ? hr.Right - S(34) - S(7) : hr.X + S(34), fy + S(7), S(7), S(7));
                using (var b = new SolidBrush(C(0xd9b26f))) g.FillEllipse(b, dot);
                var tr = ar ? new Rectangle(hr.X + S(20), fy, hr.Width - S(68), S(22)) : new Rectangle(hr.X + S(52), fy, hr.Width - S(68), S(22));
                TextRenderer.DrawText(g, facts[i], fSmall, tr, Color.FromArgb(220, 246, 239, 224), TextFormatFlags.NoPrefix | (ar ? TextFormatFlags.Right | TextFormatFlags.RightToLeft : 0));
            }
            var ver = T("Version ", "الإصدار ") + SetupProgram.Version;
            TextRenderer.DrawText(g, ver, fSmall, new Rectangle(hr.X, S(22), hr.Width, S(20)), Color.FromArgb(150, 246, 239, 224), TextFormatFlags.HorizontalCenter | TextFormatFlags.NoPrefix);
        }
        /* where we are: three small steps along the top */
        void Steps(Graphics g) {
            string[] names = { T("Choose", "اختر"), T("Install", "ثبّت"), T("Done", "تم") };
            int at = stage == "start" || stage == "error" ? 0 : stage == "copy" ? 1 : 3, x = S(X0), y = S(34);
            for (int i = 0; i < 3; i++) {
                var dot = Mir(new Rectangle(x, y, S(22), S(22)));
                bool done = i < at, now = i == at;
                using (var b = new SolidBrush(done || now ? gold : line)) g.FillEllipse(b, dot);
                TextRenderer.DrawText(g, done ? "✓" : (i + 1).ToString(), fTiny, dot, done || now ? onGold : mute, TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.NoPrefix);
                var lr = new Rectangle(x + S(28), y + S(1), S(70), S(20));
                Txt(g, names[i], now ? fSmallB : fSmall, now ? ink : mute, lr);
                x += S(28) + TextRenderer.MeasureText(names[i], now ? fSmallB : fSmall).Width + S(18);
                if (i < 2) { var ln = Mir(new Rectangle(x - S(12), y + S(10), S(16), S(2))); using (var b = new SolidBrush(line)) g.FillRectangle(b, ln); x += S(10); }
            }
        }

        protected override void OnPaint(PaintEventArgs e) {
            var g = e.Graphics; g.SmoothingMode = SmoothingMode.AntiAlias; g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            Sky(g); Steps(g);
            int w = ClientSize.Width, x = S(X0), cw = w - S(X0) - S(M);
            var head = stage == "done" ? T("Miftāḥ is installed", "تم تثبيت مفتاح") : stage == "copy" ? T("Installing Miftāḥ", "جارٍ تثبيت مفتاح") : stage == "error" ? T("It could not be installed", "تعذّر التثبيت") : have == null || have == SetupProgram.Version ? T("Install Miftāḥ", "ثبّت مفتاح") : T("Update Miftāḥ", "حدّث مفتاح");
            Txt(g, head, fTitle, ink, new Rectangle(x, S(78), cw, S(44)));
            var sub = stage == "copy" ? T("This takes a few seconds.", "يستغرق ثوانيَ قليلة.")
                : stage == "done" ? T("Find it in the Start menu" + (desk.On ? " and on the desktop." : "."), "تجده في قائمة ابدأ" + (desk.On ? " وعلى سطح المكتب." : "."))
                : have == SetupProgram.Version ? T("Version " + have + " is already here. Installing again repairs it.", "الإصدار " + have + " مثبّت. التثبيت مجددًا يصلحه.")
                : have != null ? T("From " + have + " to " + SetupProgram.Version + ". Your family's record stays as it is.", "من " + have + " إلى " + SetupProgram.Version + ". يبقى سجل عائلتك كما هو.")
                : T("An Islamic homeschool for the whole family, on this computer.", "مدرسة منزلية إسلامية للعائلة كلها، على هذا الحاسوب.");
            Txt(g, sub, fBody, mute, new Rectangle(x, S(122), cw, S(44)));

            if (stage == "start") {
                var box = new Rectangle(x, S(172), cw, S(62));
                using (var p = Round(Mir(box), S(14))) { using (var b = new SolidBrush(card)) g.FillPath(b, p); using (var pen = new Pen(line, 1)) g.DrawPath(pen, p); }
                Glyph(g, "folder", new Rectangle(box.X + S(16), box.Y + S(18), S(26), S(26)));
                Txt(g, T("Installs for you, no administrator needed", "لك وحدك، بلا صلاحيات مدير"), fSmall, mute, new Rectangle(box.X + S(54), box.Y + S(11), box.Width - S(70), S(18)));
                Txt(g, Environment.GetEnvironmentVariable("MIFTAH_SETUP_PATH") ?? Installer.Dir, fBody, ink, new Rectangle(box.X + S(54), box.Y + S(30), box.Width - S(70), S(22)), true);
            } else if (stage == "copy") {
                var bar = new Rectangle(x, S(206), cw, S(10));
                using (var p = Round(Mir(bar), S(5))) using (var b = new SolidBrush(line)) g.FillPath(b, p);
                var fill = new Rectangle(bar.X, bar.Y, Math.Max(S(10), (int)(bar.Width * prog)), bar.Height);
                using (var p = Round(Mir(fill), S(5))) using (var b = new LinearGradientBrush(Mir(fill), C(0xf6dda5), C(0xc79c52), ar ? 180f : 0f)) g.FillPath(b, p);
                Txt(g, prog < .9 ? T("Copying Miftāḥ into its folder", "نسخ مفتاح إلى مجلده") : T("Adding it to Start and Settings › Apps", "إضافته إلى قائمة ابدأ والإعدادات › التطبيقات"), fSmall, mute, new Rectangle(x, S(226), cw - S(60), S(20)));
                Txt(g, ((int)Math.Round(prog * 100)) + "%", fSmallB, ink, new Rectangle(x + cw - S(60), S(226), S(60), S(20)), false, true);
            } else if (stage == "done") {
                var ok = Mir(new Rectangle(x, S(184), S(44), S(44)));
                using (var b = new SolidBrush(gold)) g.FillEllipse(b, ok);
                using (var pen = new Pen(onGold, 3.2f * k) { StartCap = LineCap.Round, EndCap = LineCap.Round, LineJoin = LineJoin.Round })
                    g.DrawLines(pen, new[] { new PointF(ok.X + ok.Width * .28f, ok.Y + ok.Height * .52f), new PointF(ok.X + ok.Width * .44f, ok.Y + ok.Height * .67f), new PointF(ok.X + ok.Width * .73f, ok.Y + ok.Height * .36f) });
                Txt(g, T("The family's record lives in a folder of its own, so updating or removing Miftāḥ never touches it. Remove it from Settings › Apps like any program.", "يُحفظ سجل العائلة في مجلد خاص به، فلا يمسّه تحديث مفتاح أو حذفه. ويُزال من الإعدادات › التطبيقات كأي برنامج."), fSmall, mute, new Rectangle(x + S(60), S(182), cw - S(60), S(60)));
            } else {
                Txt(g, T("Nothing was changed. Close any open Miftāḥ and try again.", "لم يتغير شيء. أغلق مفتاح إن كان مفتوحًا وحاول مجددًا."), fBody, ink, new Rectangle(x, S(176), cw, S(24)));
                Txt(g, error ?? "", fSmall, mute, new Rectangle(x, S(206), cw, S(50)));
            }
        }
        /* two small line drawings in the app's style */
        public void Glyph(Graphics g, string kind, Rectangle r0) {
            var r = Mir(r0); float u = r.Width / 24f;
            using (var pen = new Pen(gold, 1.9f * k) { StartCap = LineCap.Round, EndCap = LineCap.Round, LineJoin = LineJoin.Round }) {
                Func<float, float, PointF> P = (a, b) => new PointF(r.X + a * u, r.Y + b * u);
                if (kind == "folder") { g.DrawLines(pen, new[] { P(3, 7.5f), P(3, 17), P(5, 19), P(19, 19), P(21, 17), P(21, 9.5f), P(19, 7.5f), P(11, 7.5f), P(9, 5.5f), P(5, 5.5f), P(3, 7.5f) }); }
                else if (kind == "desk") { g.DrawRectangle(pen, r.X + 2.8f * u, r.Y + 4 * u, 18.4f * u, 12 * u); g.DrawLine(pen, P(8.5f, 20), P(15.5f, 20)); g.DrawLine(pen, P(12, 16), P(12, 20)); }
                else if (kind == "sun") { g.DrawEllipse(pen, r.X + 8 * u, r.Y + 8 * u, 8 * u, 8 * u); for (int i = 0; i < 8; i++) { double a = i * Math.PI / 4; g.DrawLine(pen, P(12 + (float)Math.Cos(a) * 6.5f, 12 + (float)Math.Sin(a) * 6.5f), P(12 + (float)Math.Cos(a) * 9, 12 + (float)Math.Sin(a) * 9)); } }
                else if (kind == "go") { g.DrawLines(pen, new[] { P(5, 12), P(19, 12) }); g.DrawLines(pen, new[] { P(13, 6), P(19, 12), P(13, 18) }); }
            }
        }
        public void Relay() { if (stage == "done") Lay(); }
        void Txt(Graphics g, string s, Font f, Color c, Rectangle r, bool path = false, bool end = false) {
            var fl = TextFormatFlags.WordBreak | TextFormatFlags.NoPrefix | (path ? TextFormatFlags.PathEllipsis | TextFormatFlags.SingleLine : 0);
            if (ar ^ end) fl |= TextFormatFlags.Right;
            if (ar) fl |= TextFormatFlags.RightToLeft;
            if (ar) r = new Rectangle(ClientSize.Width - r.Right, r.Y, r.Width, r.Height);
            TextRenderer.DrawText(g, s, f, r, c, fl);
        }
        public static GraphicsPath Round(Rectangle r, int rad) {
            var p = new GraphicsPath(); int d = Math.Min(rad * 2, Math.Min(r.Width, r.Height));
            if (d <= 1) { p.AddRectangle(r); return p; }
            p.AddArc(r.X, r.Y, d, d, 180, 90); p.AddArc(r.Right - d, r.Y, d, d, 270, 90);
            p.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90); p.AddArc(r.X, r.Bottom - d, d, d, 90, 90); p.CloseFigure(); return p;
        }

        /* ---------- the work ---------- */
        void Run() {
            stage = "copy"; prog = 0; Lay();
            bool wantDesk = desk.On, wantBoot = boot.On;
            var t = new Thread(() => {
                try {
                    Installer.CloseRunning(8000);
                    using (var s = SetupProgram.Payload()) Installer.Install(null, s, wantDesk, SetupProgram.Version, p => BeginInvoke(new Action(() => { prog = p; Invalidate(); })));
                    if (!wantDesk) try { File.Delete(Installer.DesktopLink); } catch { }
                    Installer.StartWithWindows(wantBoot, Installer.Exe);
                    BeginInvoke(new Action(() => { stage = "done"; Lay(); }));
                } catch (Exception x) { BeginInvoke(new Action(() => { stage = "error"; error = x.Message; Lay(); })); }
            }) { IsBackground = true };
            t.Start();
        }
        void Finish() {
            if (openNow.On) try { Process.Start(new ProcessStartInfo(Installer.Exe) { UseShellExecute = false, WorkingDirectory = Installer.Dir }); } catch { }
            Close();
        }
        protected override void OnFormClosing(FormClosingEventArgs e) { if (stage == "copy") e.Cancel = true; base.OnFormClosing(e); }

        /* ---------- two small controls drawn to match ---------- */
        public class Toggle : Control {
            readonly SetupForm f; public bool On; public string Sub = "", Glyph = "";
            public Toggle(SetupForm f, string text, bool on) { this.f = f; Text = text; On = on; SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.OptimizedDoubleBuffer | ControlStyles.UserPaint | ControlStyles.SupportsTransparentBackColor | ControlStyles.Selectable, true); BackColor = Color.Transparent; Cursor = Cursors.Hand; TabStop = true; f.Controls.Add(this); AccessibleRole = AccessibleRole.CheckButton; AccessibleName = text; }
            protected override void OnClick(EventArgs e) { On = !On; Invalidate(); f.Invalidate(); f.Relay(); base.OnClick(e); }
            protected override void OnKeyDown(KeyEventArgs e) { if (e.KeyCode == Keys.Space) OnClick(e); base.OnKeyDown(e); }
            protected override void OnGotFocus(EventArgs e) { Invalidate(); base.OnGotFocus(e); }
            protected override void OnLostFocus(EventArgs e) { Invalidate(); base.OnLostFocus(e); }
            protected override void OnMouseEnter(EventArgs e) { hover = true; Invalidate(); base.OnMouseEnter(e); }
            protected override void OnMouseLeave(EventArgs e) { hover = false; Invalidate(); base.OnMouseLeave(e); }
            bool hover;
            /* a row: a small drawing, the choice and a line under it, and the switch at the far end */
            protected override void OnPaint(PaintEventArgs e) {
                var g = e.Graphics; g.SmoothingMode = SmoothingMode.AntiAlias;
                bool rtl = RightToLeft == RightToLeft.Yes;
                var card = new Rectangle(0, 0, Width - 1, Height - 1);
                using (var p = Round(card, f.S(14))) {
                    using (var b = new SolidBrush(hover ? ControlPaint.Light(f.card, .02f) : f.card)) g.FillPath(b, p);
                    using (var pen = new Pen(Focused ? f.gold : f.line, Focused ? 1.6f : 1f)) g.DrawPath(pen, p);
                }
                int h = f.S(22), w = f.S(40), y = (Height - h) / 2, x = rtl ? f.S(16) : Width - w - f.S(16);
                var r = new Rectangle(x, y, w, h);
                using (var p = Round(r, h / 2)) using (var b = new SolidBrush(On ? f.gold : f.line)) g.FillPath(b, p);
                int d = h - f.S(6); bool right = On ^ rtl;
                using (var b = new SolidBrush(On ? f.onGold : f.mute)) g.FillEllipse(b, right ? r.Right - d - f.S(3) : r.X + f.S(3), y + f.S(3), d, d);
                int gx = rtl ? Width - f.S(16) - f.S(24) : f.S(16);
                if (Glyph != "") { var st = g.Save(); g.TranslateTransform(0, 0); DrawGlyph(g, new Rectangle(gx, (Height - f.S(24)) / 2, f.S(24), f.S(24))); g.Restore(st); }
                int tx = rtl ? w + f.S(28) : f.S(54), tw = Width - f.S(54) - w - f.S(28);
                var flags = TextFormatFlags.NoPrefix | TextFormatFlags.EndEllipsis | (rtl ? TextFormatFlags.Right | TextFormatFlags.RightToLeft : 0);
                TextRenderer.DrawText(g, Text, f.fBodyB, new Rectangle(tx, f.S(Sub == "" ? 17 : 9), tw, f.S(22)), f.ink, flags);
                if (Sub != "") TextRenderer.DrawText(g, Sub, f.fSmall, new Rectangle(tx, f.S(30), tw, f.S(20)), f.mute, flags);
            }
            void DrawGlyph(Graphics g, Rectangle r) {
                float u = r.Width / 24f;
                using (var pen = new Pen(f.gold, 1.9f * f.k) { StartCap = LineCap.Round, EndCap = LineCap.Round, LineJoin = LineJoin.Round }) {
                    Func<float, float, PointF> P = (a, b) => new PointF(r.X + a * u, r.Y + b * u);
                    if (Glyph == "desk") { g.DrawRectangle(pen, r.X + 2.8f * u, r.Y + 4 * u, 18.4f * u, 12 * u); g.DrawLine(pen, P(8.5f, 20), P(15.5f, 20)); g.DrawLine(pen, P(12, 16), P(12, 20)); }
                    else if (Glyph == "sun") { g.DrawEllipse(pen, r.X + 8 * u, r.Y + 8 * u, 8 * u, 8 * u); for (int i = 0; i < 8; i++) { double a = i * Math.PI / 4; g.DrawLine(pen, P(12 + (float)Math.Cos(a) * 6.5f, 12 + (float)Math.Sin(a) * 6.5f), P(12 + (float)Math.Cos(a) * 9, 12 + (float)Math.Sin(a) * 9)); } }
                    else if (Glyph == "go") { g.DrawLine(pen, P(5, 12), P(19, 12)); g.DrawLines(pen, new[] { P(13, 6), P(19, 12), P(13, 18) }); }
                }
            }
        }
        public class Btn : Control {
            readonly SetupForm f; readonly bool pri; bool hover;
            public Btn(SetupForm f, string text, bool pri) { this.f = f; this.pri = pri; Text = text; SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.OptimizedDoubleBuffer | ControlStyles.UserPaint | ControlStyles.SupportsTransparentBackColor | ControlStyles.Selectable, true); BackColor = Color.Transparent; Cursor = Cursors.Hand; TabStop = true; f.Controls.Add(this); AccessibleRole = AccessibleRole.PushButton; }
            protected override void OnTextChanged(EventArgs e) { AccessibleName = Text; Invalidate(); base.OnTextChanged(e); }
            protected override void OnMouseEnter(EventArgs e) { hover = true; Invalidate(); base.OnMouseEnter(e); }
            protected override void OnMouseLeave(EventArgs e) { hover = false; Invalidate(); base.OnMouseLeave(e); }
            protected override void OnKeyDown(KeyEventArgs e) { if (e.KeyCode == Keys.Space || e.KeyCode == Keys.Enter) OnClick(e); base.OnKeyDown(e); }
            protected override void OnGotFocus(EventArgs e) { Invalidate(); base.OnGotFocus(e); }
            protected override void OnLostFocus(EventArgs e) { Invalidate(); base.OnLostFocus(e); }
            protected override void OnPaint(PaintEventArgs e) {
                var g = e.Graphics; g.SmoothingMode = SmoothingMode.AntiAlias;
                var r = new Rectangle(f.S(2), f.S(2), Width - f.S(4) - 1, Height - f.S(4) - 1);
                using (var p = Round(r, r.Height / 2)) {
                    var fill = pri ? (hover ? ControlPaint.Light(f.gold, 0.15f) : f.gold) : (hover ? f.line : Color.Transparent);
                    using (var b = new SolidBrush(fill)) g.FillPath(b, p);
                    if (!pri) using (var pen = new Pen(f.line, 1)) g.DrawPath(pen, p);
                    if (Focused) using (var pen = new Pen(pri ? f.ink : f.gold, 1.6f)) g.DrawPath(pen, p);
                }
                TextRenderer.DrawText(g, Text, f.fBtn, r, pri ? f.onGold : f.ink, TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.NoPrefix);
            }
        }
    }
}
