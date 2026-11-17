// Installing Miftah like any other Windows program, shared by Miftah-Setup.exe and by Miftah.exe itself:
// a folder of its own (%LOCALAPPDATA%\Programs\Miftah, no administrator needed), a Start menu entry, a desktop shortcut if wanted,
// and an entry in Settings > Apps that removes it again. The family's record lives apart, in %LOCALAPPDATA%\Miftah, and is never touched.
using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading;
using Microsoft.Win32;

namespace Miftah {
    static class Installer {
        public const string AppName = "Miftāḥ";
        public const string About = "Islamic homeschool for the whole family";
        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";
        /* MIFTAH_INSTALL_TEST=<folder> puts the program and shortcuts in that folder and uses a Settings line of its own,
           so the installer can be tested without touching the computer's real Miftah */
        static readonly string Test = Environment.GetEnvironmentVariable("MIFTAH_INSTALL_TEST");
        static string UninstKey { get { return @"Software\Microsoft\Windows\CurrentVersion\Uninstall\Miftah" + (Test != null ? "Test" : ""); } }
        static string RunName { get { return Test != null ? "MiftahTest" : "Miftah"; } }
        static string Base(Environment.SpecialFolder f, string test) { return Test != null ? Path.Combine(Test, test) : Environment.GetFolderPath(f); }

        public static string Dir { get { return Path.Combine(Base(Environment.SpecialFolder.LocalApplicationData, "LocalAppData"), "Programs", "Miftah"); } }
        public static string Exe { get { return Path.Combine(Dir, "Miftah.exe"); } }
        public static string DataDir { get { var o = Environment.GetEnvironmentVariable("MIFTAH_DATA"); if (!string.IsNullOrEmpty(o)) return o; return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Miftah"); } }
        public static string StartLink { get { return Path.Combine(Base(Environment.SpecialFolder.Programs, "Start"), AppName + ".lnk"); } }
        public static string DesktopLink { get { return Path.Combine(Base(Environment.SpecialFolder.DesktopDirectory, "Desktop"), AppName + ".lnk"); } }

        public static bool Installed() { return File.Exists(Exe) && File.Exists(StartLink); }
        public static string InstalledVersion() {
            try { using (var k = Registry.CurrentUser.OpenSubKey(UninstKey)) return k == null ? null : k.GetValue("DisplayVersion") as string; } catch { return null; }
        }
        public static bool Same(string a, string b) {
            try { return string.Equals(Path.GetFullPath(a), Path.GetFullPath(b), StringComparison.OrdinalIgnoreCase); } catch { return false; }
        }

        /* copies the program into its folder (unless it is already running from there), then the shortcuts and the Settings entry */
        public static void Install(string fromExe, Stream fromStream, bool desktop, string version, Action<double> progress) {
            Directory.CreateDirectory(Dir);
            if (fromStream != null) Copy(fromStream, Exe, progress);
            else if (!Same(fromExe, Exe)) using (var s = File.OpenRead(fromExe)) Copy(s, Exe, progress);
            if (progress != null) progress(0.9);
            Shortcut(StartLink, Exe, "", About);
            if (desktop) Shortcut(DesktopLink, Exe, "", About);
            Register(version);
            /* starting with Windows follows the program to its new home */
            if (StartsWithWindows()) StartWithWindows(true, Exe);
            if (progress != null) progress(1);
        }
        static void Copy(Stream from, string to, Action<double> progress) {
            var part = to + ".new";
            using (var o = File.Create(part)) {
                var buf = new byte[1 << 20]; long total = 0, len = 0; try { len = from.Length; } catch { }
                int n; while ((n = from.Read(buf, 0, buf.Length)) > 0) { o.Write(buf, 0, n); total += n; if (progress != null && len > 0) progress(0.9 * total / len); }
            }
            /* the old file may still be closing: a few tries */
            for (int i = 0; ; i++) {
                try { if (File.Exists(to)) File.Delete(to); File.Move(part, to); return; }
                catch { if (i >= 20) { try { File.Delete(part); } catch { } throw; } Thread.Sleep(250); }
            }
        }
        /* the entry in Settings > Apps; written again by each new version so the number shown stays true */
        public static void Register(string version) {
            using (var k = Registry.CurrentUser.CreateSubKey(UninstKey)) {
                k.SetValue("DisplayName", AppName);
                k.SetValue("DisplayVersion", version ?? "");
                k.SetValue("Publisher", "Miftāḥ, open source");
                k.SetValue("Comments", About);
                k.SetValue("URLInfoAbout", "https://github.com/Bashyr18/miftah-app");
                k.SetValue("DisplayIcon", Exe + ",0");
                k.SetValue("InstallLocation", Dir);
                k.SetValue("InstallDate", DateTime.Now.ToString("yyyyMMdd"));
                k.SetValue("UninstallString", "\"" + Exe + "\" --uninstall");
                k.SetValue("QuietUninstallString", "\"" + Exe + "\" --uninstall --quiet");
                k.SetValue("NoModify", 1, RegistryValueKind.DWord); k.SetValue("NoRepair", 1, RegistryValueKind.DWord);
                try { k.SetValue("EstimatedSize", (int)(new FileInfo(Exe).Length / 1024), RegistryValueKind.DWord); } catch { }
            }
        }

        public static bool StartsWithWindows() { try { using (var k = Registry.CurrentUser.OpenSubKey(RunKey)) return k != null && k.GetValue(RunName) != null; } catch { return false; } }
        public static void StartWithWindows(bool on, string exe) {
            using (var k = Registry.CurrentUser.CreateSubKey(RunKey)) {
                if (on) k.SetValue(RunName, "\"" + exe + "\" --tray");
                else if (k.GetValue(RunName) != null) k.DeleteValue(RunName);
            }
        }

        /* the program, the shortcuts and the Settings entry go; the family's record stays */
        public static void Remove() {
            try { File.Delete(StartLink); } catch { }
            try { File.Delete(DesktopLink); } catch { }
            try { StartWithWindows(false, null); } catch { }
            try { Registry.CurrentUser.DeleteSubKeyTree(UninstKey, false); } catch { }
            try { foreach (var d in Directory.GetDirectories(DataDir, "app-*")) Directory.Delete(d, true); } catch { }
            /* a running program cannot delete its own folder: a small script waits until this process has gone, then removes the
               whole folder, trying again for a while if anything still holds a file (ping is the pause; timeout needs a console) */
            try {
                var pid = Process.GetCurrentProcess().Id;
                var cmd = Path.Combine(Path.GetTempPath(), "miftah-remove-" + pid + ".cmd");
                var sb = new StringBuilder("@echo off\r\n:w\r\ntasklist /FI \"PID eq " + pid + "\" | find \"" + pid + "\" >nul && (ping -n 2 127.0.0.1 >nul & goto w)\r\n");
                for (int i = 0; i < 15; i++) sb.Append("if exist \"" + Dir + "\" (rmdir /s /q \"" + Dir + "\" & ping -n 2 127.0.0.1 >nul)\r\n");
                sb.Append("del \"%~f0\"\r\n");
                File.WriteAllText(cmd, sb.ToString(), Encoding.Default);
                Process.Start(new ProcessStartInfo("cmd.exe", "/c \"" + cmd + "\"") { CreateNoWindow = true, UseShellExecute = false, WindowStyle = ProcessWindowStyle.Hidden, WorkingDirectory = Path.GetTempPath() });
            } catch { }
        }

        /* the installed Miftah, if it is open, is asked to close (it saves as it goes), and only stopped if it does not.
           A copy running from somewhere else (Downloads, say) is left alone: its file is not the one being replaced. */
        public static bool CloseRunning(int waitMs) {
            var me = Process.GetCurrentProcess().Id;
            Func<Process[]> others = () => Array.FindAll(Process.GetProcessesByName("Miftah"), p => {
                if (p.Id == me) return false;
                try { return Same(p.MainModule.FileName, Exe); } catch { return false; }
            });
            if (others().Length == 0) return true;
            try {
                using (var p = new System.IO.Pipes.NamedPipeClientStream(".", "Miftah.Desktop.v2", System.IO.Pipes.PipeDirection.Out)) {
                    p.Connect(1500); var b = Encoding.UTF8.GetBytes("--quit"); p.Write(b, 0, b.Length);
                }
            } catch { }
            var until = DateTime.UtcNow.AddMilliseconds(waitMs);
            while (DateTime.UtcNow < until) { if (others().Length == 0) return true; Thread.Sleep(200); }
            foreach (var p in others()) try { p.Kill(); p.WaitForExit(3000); } catch { }
            return others().Length == 0;
        }

        /* ---------- shortcuts, through the Unicode shell interface (WScript.Shell cannot save a name with ā or ḥ) ---------- */
        [ComImport, Guid("00021401-0000-0000-C000-000000000046")] class ShellLink { }
        [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("000214F9-0000-0000-C000-000000000046")]
        interface IShellLinkW {
            void GetPath([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder f, int cch, IntPtr fd, int flags);
            void GetIDList(out IntPtr ppidl);
            void SetIDList(IntPtr pidl);
            void GetDescription([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder s, int cch);
            void SetDescription([MarshalAs(UnmanagedType.LPWStr)] string s);
            void GetWorkingDirectory([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder s, int cch);
            void SetWorkingDirectory([MarshalAs(UnmanagedType.LPWStr)] string s);
            void GetArguments([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder s, int cch);
            void SetArguments([MarshalAs(UnmanagedType.LPWStr)] string s);
            void GetHotkey(out short k);
            void SetHotkey(short k);
            void GetShowCmd(out int c);
            void SetShowCmd(int c);
            void GetIconLocation([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder s, int cch, out int i);
            void SetIconLocation([MarshalAs(UnmanagedType.LPWStr)] string s, int i);
            void SetRelativePath([MarshalAs(UnmanagedType.LPWStr)] string s, int r);
            void Resolve(IntPtr hwnd, int flags);
            void SetPath([MarshalAs(UnmanagedType.LPWStr)] string s);
        }
        public static void Shortcut(string lnk, string target, string args, string about) {
            var l = (IShellLinkW)new ShellLink();
            try {
                l.SetPath(target); l.SetArguments(args ?? ""); l.SetDescription(about ?? "");
                l.SetWorkingDirectory(Path.GetDirectoryName(target)); l.SetIconLocation(target, 0);
                Directory.CreateDirectory(Path.GetDirectoryName(lnk));
                ((IPersistFile)l).Save(lnk, true);
            } finally { Marshal.FinalReleaseComObject(l); }
        }
    }
}
