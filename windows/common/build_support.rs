// Shared by app/build.rs and setup/build.rs (included with include!): the version from version.txt, and the Windows
// resources every program carries (its icon, its version line in Properties, and a manifest for sharp text on every screen).
#[allow(dead_code)]
fn miftah_build(title: &str, description: &str) {
    use std::path::PathBuf;
    let here = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let root = here.join("..").join("..");
    let vt = std::fs::read_to_string(root.join("version.txt")).unwrap_or_default();
    let get = |k: &str| vt.lines().find_map(|l| l.trim().strip_prefix(&format!("{}=", k)).map(|v| v.trim().to_string()));
    let name = get("name").unwrap_or_else(|| "1.0".into());
    let code = get("code").unwrap_or_else(|| "1".into());
    let mut parts: Vec<String> = name.split('.').map(String::from).collect();
    while parts.len() < 3 { parts.push("0".into()); }
    let quad = format!("{},{},{},{}", parts[0], parts[1], parts[2], code);
    let dotted = format!("{}.{}.{}.{}", parts[0], parts[1], parts[2], code);
    println!("cargo:rustc-env=MIFTAH_VERSION={}", name);
    println!("cargo:rustc-env=MIFTAH_CODE={}", code);
    println!("cargo:rerun-if-changed={}", root.join("version.txt").display());
    println!("cargo:rerun-if-env-changed=MIFTAH_ICON");

    let out = PathBuf::from(std::env::var("OUT_DIR").unwrap());
    let ico = std::env::var("MIFTAH_ICON").map(PathBuf::from).unwrap_or_else(|_| root.join("build").join("windows").join("miftah.ico"));
    let manifest = out.join("app.manifest");
    std::fs::write(&manifest, r#"<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <assemblyIdentity version="1.0.0.0" name="Miftah" type="win32"/>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3"><security><requestedPrivileges><requestedExecutionLevel level="asInvoker" uiAccess="false"/></requestedPrivileges></security></trustInfo>
  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1"><application><supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}"/></application></compatibility>
  <application xmlns="urn:schemas-microsoft-com:asm.v3"><windowsSettings>
    <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/pm</dpiAware>
    <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2</dpiAwareness>
    <activeCodePage xmlns="http://schemas.microsoft.com/SMI/2019/WindowsSettings">UTF-8</activeCodePage>
  </windowsSettings></application>
  <dependency><dependentAssembly><assemblyIdentity type="win32" name="Microsoft.Windows.Common-Controls" version="6.0.0.0" processorArchitecture="*" publicKeyToken="6595b64144ccf1df" language="*"/></dependentAssembly></dependency>
</assembly>
"#).unwrap();
    let esc = |p: &PathBuf| p.to_string_lossy().replace('\\', "\\\\");
    let rc = out.join("app.rc");
    std::fs::write(&rc, format!(r#"#pragma code_page(65001)
1 ICON "{ico}"
1 24 "{man}"
1 VERSIONINFO
FILEVERSION {quad}
PRODUCTVERSION {quad}
FILEOS 0x40004
FILETYPE 0x1
BEGIN
  BLOCK "StringFileInfo"
  BEGIN
    BLOCK "040904b0"
    BEGIN
      VALUE "CompanyName", "Miftah, open source"
      VALUE "FileDescription", "{description}"
      VALUE "FileVersion", "{dotted}"
      VALUE "InternalName", "{title}"
      VALUE "LegalCopyright", "MIT licence"
      VALUE "ProductName", "Miftah"
      VALUE "ProductVersion", "{name}"
    END
  END
  BLOCK "VarFileInfo"
  BEGIN
    VALUE "Translation", 0x409, 1200
  END
END
"#, ico = esc(&ico), man = esc(&manifest))).unwrap();
    embed_resource::compile(&rc, embed_resource::NONE).manifest_required().unwrap();
}
