include!("../common/build_support.rs");
fn main() {
    miftah_build("Miftah Setup", "Installs Miftah, an Islamic homeschool for children aged 2 to 18");
    /* the program it installs: dist/Miftah.exe, built first by tools/build_windows.py */
    let p = std::env::var("MIFTAH_PAYLOAD").unwrap_or_else(|_| {
        std::path::PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap()).join("..").join("..").join("dist").join("Miftah.exe").to_string_lossy().into_owned()
    });
    println!("cargo:rustc-env=MIFTAH_PAYLOAD={}", p);
    println!("cargo:rerun-if-env-changed=MIFTAH_PAYLOAD");
    println!("cargo:rerun-if-changed={}", p);
    println!("cargo:rerun-if-changed=src/page.html");
}
