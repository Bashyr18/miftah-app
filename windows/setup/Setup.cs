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
        readonly Color bg, card, ink, mute, gold, onGold, line;
        readonly float k;
        Font fTitle, fBody, fSmall, fBtn;
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
            ClientSize = new Size(S(620), S(430));
            BackColor = bg; DoubleBuffered = true;
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }
            try { icon = LoadIcon(); } catch { }

            var face = ar ? "Segoe UI" : (FontFamily.Families.Length > 0 && Array.Exists(FontFamily.Families, f => f.Name == "Segoe UI Variable Display") ? "Segoe UI Variable Display" : "Segoe UI");
            fTitle = new Font(face, 21f, FontStyle.Bold, GraphicsUnit.Point);
            fBody = new Font("Segoe UI", 10.5f, FontStyle.Regular, GraphicsUnit.Point);
            fSmall = new Font("Segoe UI", 9f, FontStyle.Regular, GraphicsUnit.Point);
            fBtn = new Font("Segoe UI", 10.5f, FontStyle.Bold, GraphicsUnit.Point);

            desk = new Toggle(this, T("A shortcut on the desktop", "اختصار على سطح المكتب"), true);
            boot = new Toggle(this, T("Open with Windows, quietly in the tray", "افتحه مع ويندوز، بهدوء في شريط المهام"), Installer.StartsWithWindows());
            openNow = new Toggle(this, T("Open Miftāḥ now", "افتح مفتاح الآن"), true) { Visible = false };
            if (ar) desk.RightToLeft = boot.RightToLeft = openNow.RightToLeft = RightToLeft.Yes;
            go = new Btn(this, have == null ? T("Install", "ثبّت") : T("Update", "حدّث"), true);
            cancel = new Btn(this, T("Cancel", "إلغاء"), false);
            go.Click += delegate { if (stage == "start") Run(); else if (stage == "done") Finish(); else if (stage == "error") { stage = "start"; Lay(); } };
            cancel.Click += delegate { Close(); };
            Lay();
        }
        static Color C(int x) { return Color.FromArgb((x >> 16) & 255, (x >> 8) & 255, x & 255); }
        int S(float v) { return (int)Math.Round(v * k); }
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

        /* ---------- layout: one column, generous margins, nothing touching an edge ---------- */
        const int M = 40;
        void Lay() {
            int w = ClientSize.Width;
            desk.Visible = boot.Visible = stage == "start";
            openNow.Visible = stage == "done";
            desk.Bounds = new Rectangle(S(M), S(262), w - S(2 * M), S(30));
            boot.Bounds = new Rectangle(S(M), S(296), w - S(2 * M), S(30));
            openNow.Bounds = new Rectangle(S(M), S(296), w - S(2 * M), S(30));
            go.Visible = stage != "copy"; cancel.Visible = stage == "start" || stage == "error";
            go.Text = stage == "done" ? T("Finish", "إنهاء") : stage == "error" ? T("Try again", "أعد المحاولة") : have == null ? T("Install", "ثبّت") : have == SetupProgram.Version ? T("Reinstall", "أعد التثبيت") : T("Update", "حدّث");
            int bw = S(132), bh = S(42), y = ClientSize.Height - S(M) - bh + S(8);
            go.Bounds = new Rectangle(w - S(M) - bw, y, bw, bh);
            cancel.Bounds = new Rectangle(w - S(M) - bw - S(12) - S(108), y, S(108), bh);
            /* Arabic reads from the right: the same layout, mirrored by hand so the mark and the text are never mirrored */
            if (ar) foreach (Control c in new Control[] { desk, boot, openNow, go, cancel }) c.Left = w - c.Right;
            Invalidate();
        }

        protected override void OnPaint(PaintEventArgs e) {
            var g = e.Graphics; g.SmoothingMode = SmoothingMode.AntiAlias; g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            int w = ClientSize.Width, x = S(M);
            /* the mark and the name */
            if (icon != null) {
                var ir = new Rectangle(ar ? w - x - S(64) : x, S(36), S(64), S(64));
                using (var clip = Round(ir, S(14))) { var st = g.Save(); g.SetClip(clip); g.DrawImage(icon, Rectangle.Inflate(ir, S(1), S(1))); g.Restore(st); }
            }
            var head = stage == "done" ? T("Miftāḥ is installed", "تم تثبيت مفتاح") : stage == "copy" ? T("Installing…", "جارٍ التثبيت…") : stage == "error" ? T("It could not be installed", "تعذّر التثبيت") : have == null || have == SetupProgram.Version ? T("Install Miftāḥ", "ثبّت مفتاح") : T("Update Miftāḥ", "حدّث مفتاح");
            Txt(g, head, fTitle, ink, new Rectangle(x + S(84), S(36), w - x - S(84) - S(M), S(40)));
            var sub = have == SetupProgram.Version && stage != "done" ? T("Version " + have + " is already here. Installing again repairs it.", "الإصدار " + have + " مثبّت. التثبيت مجددًا يصلحه.")
                : have == null || stage == "done" ? T("Version ", "الإصدار ") + SetupProgram.Version + T(" · An Islamic homeschool for ages 2 to 18", " · مدرسة منزلية إسلامية من سنتين إلى ١٨")
                : T("From version " + have + " to " + SetupProgram.Version + ". Your family's record stays as it is.", "من الإصدار " + have + " إلى " + SetupProgram.Version + ". يبقى سجل عائلتك كما هو.");
            Txt(g, sub, fBody, mute, new Rectangle(x + S(84), S(78), w - x - S(84) - S(M), S(26)));

            var box = new Rectangle(x, S(128), w - 2 * x, S(112));
            using (var p = Round(box, S(14))) { using (var b = new SolidBrush(card)) g.FillPath(b, p); using (var pen = new Pen(line, 1)) g.DrawPath(pen, p); }
            var inner = Rectangle.Inflate(box, -S(20), -S(16));
            if (stage == "start") {
                Txt(g, T("Where it goes", "أين يُثبَّت"), fSmall, mute, new Rectangle(inner.X, inner.Y, inner.Width, S(20)));
                Txt(g, Environment.GetEnvironmentVariable("MIFTAH_SETUP_PATH") ?? Installer.Dir, fBody, ink, new Rectangle(inner.X, inner.Y + S(20), inner.Width, S(24)), true);
                Txt(g, T("For you on this computer, no administrator needed. In the Start menu, and removed from Settings › Apps like any program.", "لك على هذا الحاسوب، بلا صلاحيات مدير. في قائمة ابدأ، ويُزال من الإعدادات › التطبيقات كأي برنامج."), fSmall, mute, new Rectangle(inner.X, inner.Y + S(48), inner.Width, S(36)));
            } else if (stage == "copy") {
                Txt(g, T("Copying Miftāḥ into its folder", "نسخ مفتاح إلى مجلده"), fBody, ink, new Rectangle(inner.X, inner.Y + S(4), inner.Width, S(24)));
                var bar = new Rectangle(inner.X, inner.Y + S(44), inner.Width, S(8));
                using (var p = Round(bar, S(4))) using (var b = new SolidBrush(line)) g.FillPath(b, p);
                var fill = new Rectangle(ar ? bar.Right - (int)(bar.Width * prog) : bar.X, bar.Y, Math.Max(S(8), (int)(bar.Width * prog)), bar.Height);
                using (var p = Round(fill, S(4))) using (var b = new SolidBrush(gold)) g.FillPath(b, p);
                Txt(g, ((int)Math.Round(prog * 100)) + "%", fSmall, mute, new Rectangle(inner.X, inner.Y + S(58), inner.Width, S(20)));
            } else if (stage == "done") {
                Txt(g, T("Find it in the Start menu" + (desk.On ? " and on the desktop." : "."), "تجده في قائمة ابدأ" + (desk.On ? " وعلى سطح المكتب." : ".")), fBody, ink, new Rectangle(inner.X, inner.Y, inner.Width, S(24)));
                Txt(g, T("The family's record is kept in a folder of its own, so updating or removing Miftāḥ never touches it. Remove it from Settings › Apps like any program.", "يُحفظ سجل العائلة في مجلد خاص به، فلا يمسّه تحديث مفتاح أو حذفه. ويُزال من الإعدادات › التطبيقات كأي برنامج."), fSmall, mute, new Rectangle(inner.X, inner.Y + S(30), inner.Width, S(50)));
            } else {
                Txt(g, T("Nothing was changed. Close any open Miftāḥ and try again.", "لم يتغير شيء. أغلق مفتاح إن كان مفتوحًا وحاول مجددًا."), fBody, ink, new Rectangle(inner.X, inner.Y, inner.Width, S(24)));
                Txt(g, error ?? "", fSmall, mute, new Rectangle(inner.X, inner.Y + S(30), inner.Width, S(50)));
            }
        }
        void Txt(Graphics g, string s, Font f, Color c, Rectangle r, bool path = false) {
            var fl = TextFormatFlags.WordBreak | TextFormatFlags.NoPrefix | (path ? TextFormatFlags.PathEllipsis | TextFormatFlags.SingleLine : 0);
            if (ar) fl |= TextFormatFlags.Right | TextFormatFlags.RightToLeft;
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
            readonly SetupForm f; public bool On;
            public Toggle(SetupForm f, string text, bool on) { this.f = f; Text = text; On = on; SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.OptimizedDoubleBuffer | ControlStyles.UserPaint | ControlStyles.SupportsTransparentBackColor | ControlStyles.Selectable, true); BackColor = Color.Transparent; Cursor = Cursors.Hand; TabStop = true; f.Controls.Add(this); AccessibleRole = AccessibleRole.CheckButton; AccessibleName = text; }
            protected override void OnClick(EventArgs e) { On = !On; Invalidate(); f.Invalidate(); base.OnClick(e); }
            protected override void OnKeyDown(KeyEventArgs e) { if (e.KeyCode == Keys.Space) OnClick(e); base.OnKeyDown(e); }
            protected override void OnGotFocus(EventArgs e) { Invalidate(); base.OnGotFocus(e); }
            protected override void OnLostFocus(EventArgs e) { Invalidate(); base.OnLostFocus(e); }
            protected override void OnPaint(PaintEventArgs e) {
                var g = e.Graphics; g.SmoothingMode = SmoothingMode.AntiAlias;
                int h = f.S(20), w = f.S(36), y = (Height - h) / 2, x = RightToLeft == RightToLeft.Yes ? Width - w : 0;
                var r = new Rectangle(x, y, w, h);
                using (var p = Round(r, h / 2)) {
                    using (var b = new SolidBrush(On ? f.gold : f.line)) g.FillPath(b, p);
                    if (Focused) using (var pen = new Pen(f.gold, 2)) { var fr = Rectangle.Inflate(r, f.S(3), f.S(3)); using (var fp = Round(fr, fr.Height / 2)) g.DrawPath(pen, fp); }
                }
                int d = h - f.S(6); bool right = On ^ (RightToLeft == RightToLeft.Yes);
                using (var b = new SolidBrush(On ? f.onGold : f.mute)) g.FillEllipse(b, right ? r.Right - d - f.S(3) : r.X + f.S(3), y + f.S(3), d, d);
                var tr = RightToLeft == RightToLeft.Yes ? new Rectangle(0, 0, Width - w - f.S(12), Height) : new Rectangle(w + f.S(12), 0, Width - w - f.S(12), Height);
                TextRenderer.DrawText(g, Text, f.fBody, tr, f.ink, TextFormatFlags.VerticalCenter | TextFormatFlags.NoPrefix | (RightToLeft == RightToLeft.Yes ? TextFormatFlags.Right | TextFormatFlags.RightToLeft : 0));
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
