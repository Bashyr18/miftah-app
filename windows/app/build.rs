include!("../common/build_support.rs");
fn main() {
    miftah_build("Miftah", "Miftah, an Islamic homeschool for children aged 2 to 18");
    /* the lessons, zipped by tools/build_windows.py */
    let zip = std::env::var("MIFTAH_APP_ZIP").unwrap_or_else(|_| {
        let d = std::path::PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap()).join("..").join("..").join("build").join("windows").join("app.zip");
        d.to_string_lossy().into_owned()
    });
    println!("cargo:rustc-env=MIFTAH_APP_ZIP={}", zip);
    println!("cargo:rerun-if-env-changed=MIFTAH_APP_ZIP");
    println!("cargo:rerun-if-changed={}", zip);
    println!("cargo:rerun-if-changed=../shim.js");
}
