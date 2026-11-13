// Windows itself: the title bar's colours, shortcuts in Start and on the desktop, starting with Windows,
// an entry in Settings > Apps so the family can remove Miftah like any other program.
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Win32;

namespace Miftah {
    static class Native {
        [DllImport("shcore.dll")] public static extern int SetProcessDpiAwareness(int value);
        [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
        [DllImport("dwmapi.dll")] static extern int DwmSetWindowAttribute(IntPtr h, int attr, ref int value, int size);
        static int Ref(Color c) { return c.R | (c.G << 8) | (c.B << 16); }
        /* the title bar takes the page's own colours, so the window reads as one surface */
        public static void Caption(IntPtr h, bool dark, Color bg, Color fg) {
            try {
                int d = dark ? 1 : 0; DwmSetWindowAttribute(h, 20, ref d, 4);
                int b = Ref(bg); DwmSetWindowAttribute(h, 35, ref b, 4);
                int t = Ref(fg); DwmSetWindowAttribute(h, 36, ref t, 4);
                int border = Ref(bg); DwmSetWindowAttribute(h, 34, ref border, 4);
                int round = 2; DwmSetWindowAttribute(h, 33, ref round, 4);
            } catch { }
        }
    }

    static class Shell {
        const string AppName = "Miftāḥ";
        const string Uninst = @"Software\Microsoft\Windows\CurrentVersion\Uninstall\Miftah";
        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";

        public static void Open(string what) { try { Process.Start(new ProcessStartInfo(what) { UseShellExecute = true }); } catch { } }
        public static void Reveal(string file) { try { Process.Start("explorer.exe", "/select,\"" + file + "\""); } catch { } }
        public static string Documents() { var d = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Miftah"); Directory.CreateDirectory(d); return d; }
        public static string PrintFolder() { return Path.Combine(Documents(), "Printables"); }

        static string InstallDir { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "Miftah"); } }
        static string InstalledExe { get { return Path.Combine(InstallDir, "Miftah.exe"); } }
        static string StartLink { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), AppName + ".lnk"); } }
        static string DesktopLink { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), AppName + ".lnk"); } }

        public static bool Installed() { return File.Exists(InstalledExe) && File.Exists(StartLink); }
        public static bool RunningInstalled() { return string.Equals(Path.GetFullPath(Application.ExecutablePath), Path.GetFullPath(InstalledExe), StringComparison.OrdinalIgnoreCase); }

        /* no administrator, no installer: a copy in the user's own Programs folder, two shortcuts and an entry in Settings > Apps */
        public static bool Install() {
            try {
                Directory.CreateDirectory(InstallDir);
                if (!RunningInstalled()) File.Copy(Application.ExecutablePath, InstalledExe, true);
                Link(StartLink, InstalledExe, "", "Islamic homeschool for the whole family");
                Link(DesktopLink, InstalledExe, "", "Islamic homeschool for the whole family");
                using (var k = Registry.CurrentUser.CreateSubKey(Uninst)) {
                    k.SetValue("DisplayName", AppName);
                    k.SetValue("DisplayVersion", Program.Version);
                    k.SetValue("Publisher", "Miftāḥ, open source");
                    k.SetValue("DisplayIcon", InstalledExe + ",0");
                    k.SetValue("InstallLocation", InstallDir);
                    k.SetValue("UninstallString", "\"" + InstalledExe + "\" --uninstall");
                    k.SetValue("NoModify", 1, RegistryValueKind.DWord); k.SetValue("NoRepair", 1, RegistryValueKind.DWord);
                    long size = new FileInfo(InstalledExe).Length / 1024; k.SetValue("EstimatedSize", (int)size, RegistryValueKind.DWord);
                }
                if (StartsWithWindows()) StartWithWindows(true);
                return true;
            } catch { return false; }
        }
        static void Link(string lnk, string target, string args, string about) {
            var t = Type.GetTypeFromProgID("WScript.Shell"); dynamic sh = Activator.CreateInstance(t);
            dynamic l = sh.CreateShortcut(lnk);
            l.TargetPath = target; l.Arguments = args; l.Description = about; l.WorkingDirectory = Path.GetDirectoryName(target); l.IconLocation = target + ",0";
            l.Save();
            Marshal.FinalReleaseComObject(l); Marshal.FinalReleaseComObject(sh);
        }
        public static bool StartsWithWindows() { using (var k = Registry.CurrentUser.OpenSubKey(RunKey)) return k != null && k.GetValue("Miftah") != null; }
        public static void StartWithWindows(bool on) {
            using (var k = Registry.CurrentUser.CreateSubKey(RunKey)) {
                if (on) k.SetValue("Miftah", "\"" + (File.Exists(InstalledExe) ? InstalledExe : Application.ExecutablePath) + "\" --tray");
                else if (k.GetValue("Miftah") != null) k.DeleteValue("Miftah");
            }
        }
        /* from Settings > Apps: the program goes; the family's record stays unless the parent says otherwise */
        public static void Uninstall() {
            if (MessageBox.Show("Remove Miftāḥ from this computer?\n\nYour family's record and recordings stay in\n" + Store.Root + "\nso nothing is lost if you install it again.", AppName, MessageBoxButtons.OKCancel, MessageBoxIcon.Question) != DialogResult.OK) return;
            try { File.Delete(StartLink); } catch { }
            try { File.Delete(DesktopLink); } catch { }
            try { StartWithWindows(false); } catch { }
            try { Registry.CurrentUser.DeleteSubKeyTree(Uninst, false); } catch { }
            try { foreach (var d in Directory.GetDirectories(Store.Root, "app-*")) Directory.Delete(d, true); } catch { }
            /* the program cannot delete itself while it runs: a moment later, quietly */
            try { Process.Start(new ProcessStartInfo("cmd.exe", "/c timeout /t 2 /nobreak >nul & rmdir /s /q \"" + InstallDir + "\"") { CreateNoWindow = true, UseShellExecute = false, WindowStyle = ProcessWindowStyle.Hidden }); } catch { }
            MessageBox.Show("Miftāḥ has been removed. Your family's record is still in " + Store.Root + ".", AppName);
        }
    }
}
