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

        public static void Open(string what) { try { Process.Start(new ProcessStartInfo(what) { UseShellExecute = true }); } catch { } }
        public static void Reveal(string file) { try { Process.Start("explorer.exe", "/select,\"" + file + "\""); } catch { } }
        public static string Documents() { var d = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Miftah"); Directory.CreateDirectory(d); return d; }
        public static string PrintFolder() { return Path.Combine(Documents(), "Printables"); }

        public static bool Installed() { return Installer.Installed(); }
        public static bool RunningInstalled() { return Installer.Same(Application.ExecutablePath, Installer.Exe); }

        /* from This computer: the same install as Miftah-Setup.exe, then this copy hands over to the installed one */
        public static bool Install() {
            try { Installer.Install(Application.ExecutablePath, null, true, Program.Version, null); return true; } catch { return false; }
        }
        public static bool StartsWithWindows() { return Installer.StartsWithWindows(); }
        public static void StartWithWindows(bool on) { Installer.StartWithWindows(on, File.Exists(Installer.Exe) ? Installer.Exe : Application.ExecutablePath); }
        /* from Settings > Apps: the program goes; the family's record stays */
        public static void Uninstall(bool quiet) {
            if (!quiet && MessageBox.Show("Remove Miftāḥ from this computer?\n\nYour family's record and recordings stay in\n" + Store.Root + "\nso nothing is lost if you install it again.", AppName, MessageBoxButtons.OKCancel, MessageBoxIcon.Question) != DialogResult.OK) return;
            Installer.CloseRunning(6000);
            if (!quiet) MessageBox.Show("Miftāḥ has been removed. Your family's record is still in " + Store.Root + ".", AppName);
            /* last, because the folder is emptied a moment after this program closes */
            Installer.Remove();
        }
    }
}
