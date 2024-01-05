use std::{
    fs::{self, copy, create_dir, metadata},
    io::Cursor,
};

use anyhow::Result;
use sevenz_rust::decompress;
use sha2::{Digest, Sha256};
use tar::Archive;
use tempfile::tempdir;

// LINUX SECTION
const X86_64_UNKNOWN_LINUX_GNU_ARCHIVE: &str =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
const X86_64_UNKNOWN_LINUX_GNU_MD5: &str =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz.md5";
const X86_64_UNKNOWN_LINUX_GNU_VERSION: &str = "https://johnvansickle.com/ffmpeg";

// WINDOWS SECTION
const X86_64_PC_WINDOWS_MSVC_ARCHIVE: &str =
    "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z";
const X86_64_PC_WINDOWS_MSVC_SHA256: &str =
    "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z.sha256";
const X86_64_PC_WINDOWS_MSVC_VERSION: &str = "https://www.gyan.dev/ffmpeg/builds/release-version";

// APPLE SILICON SECTON
const AARCH64_APPLE_DARWIN_FFMPEG_ARCHIVE: &str = "https://www.osxexperts.net/ffmpeg61arm.zip";
const AARCH64_APPLE_DARWIN_FFMPEG_SHA256: &str =
    "9eaee17990375fa6eddb17fd37c1326502e946c4393a9012431f49281037899b";
const AARCH64_APPLE_DARWIN_FFPROBE_ARCHIVE: &str = "https://www.osxexperts.net/ffprobe61arm.zip";
const AARCH64_APPLE_DARWIN_FFPROBE_SHA256: &str =
    "76bf431a486c1866cd11d6cc6a229a10fefb34888ffcac4bb325af68fcc68489";

//APPLE INTEL SECTION
const X86_64_APPLE_DARWIN_FFMPEG_ARCHIVE: &str = "https://www.osxexperts.net/ffmpeg61intel.zip";
const X86_64_APPLE_DARWIN_FFMPEG_SHA256: &str =
    "b893e45db7253d587568909feaceab9d21c6b681e7de4500adce4409228bc78d";
const X86_64_APPLE_DARWIN_FFPROBE_ARCHIVE: &str = "https://www.osxexperts.net/ffprobe61intel.zip";
const X86_64_APPLE_DARWIN_FFPROBE_SHA256: &str =
    "975e84c3e163e6df76b3ae1d4ccf0b584ee022075bfc76d0dc31ed5f2b012731";

const BINARIES_PATH: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/binaries");

fn main() -> Result<()> {
    download_binaries()?;
    tauri_build::build();
    Ok(())
}

fn download_binaries() -> Result<()> {
    if check_binaries() {
        return Ok(());
    }

    match std::env::var("TARGET") {
        Ok(platform) => match platform.as_str() {
            "x86_64-unknown-linux-gnu" => download_x86_64_unknown_linux_gnu(),
            "x86_64-pc-windows-msvc" => download_x86_64_pc_windows_msvc(),
            "x86_64-apple-darwin" => download_x86_64_apple_darwin(),
            "aarch64-apple-darwin" => download_aarch64_apple_darwin(),
            _ => panic!("Platform {platform} not supported"),
        },
        Err(_) => panic!("Failing acquiring target information"),
    }
}

fn check_binaries() -> bool {
    let _ = create_dir(BINARIES_PATH);
    let target_triple = std::env::var("TARGET").unwrap_or_default();
    let mut ffmpeg = BINARIES_PATH.to_owned() + "/ffmpeg-" + &target_triple;
    let mut ffprobe = BINARIES_PATH.to_owned() + "/ffprobe-" + &target_triple;

    if target_triple.contains("windows") {
        ffmpeg += ".exe";
        ffprobe += ".exe";
    }

    if metadata(ffmpeg).is_ok() && metadata(ffprobe).is_ok() {
        return true;
    }

    false
}

fn download_x86_64_unknown_linux_gnu() -> Result<()> {
    let target_triple = std::env::var("TARGET")?;
    let mut decomp: Vec<u8> = Vec::new();

    let version = reqwest::blocking::get(X86_64_UNKNOWN_LINUX_GNU_VERSION)?
        .text()?
        .split_once("release:")
        .unwrap_or_default()
        .1
        .trim()
        .split_once('<')
        .unwrap_or_default()
        .0
        .to_owned();

    let md5 = reqwest::blocking::get(X86_64_UNKNOWN_LINUX_GNU_MD5)?
        .text()?
        .split_ascii_whitespace()
        .rev()
        .last()
        .unwrap_or_default()
        .to_owned();

    let raw_data = reqwest::blocking::get(X86_64_UNKNOWN_LINUX_GNU_ARCHIVE)?.bytes()?;

    let tmp_dir = tempdir()?;
    let tarball_path: std::path::PathBuf = tmp_dir
        .path()
        .join(format!("ffmpeg-{version}-amd64-static"));

    let digest = md5::compute(&raw_data);
    assert_eq!(format!("{:x}", digest), md5);

    lzma_rs::xz_decompress(&mut Cursor::new(raw_data), &mut decomp)?;
    Archive::new(Cursor::new(decomp)).unpack(&tmp_dir)?;

    copy(
        tarball_path.join("ffmpeg"),
        BINARIES_PATH.to_owned() + "/ffmpeg-" + &target_triple,
    )?;
    copy(
        tarball_path.join("ffprobe"),
        BINARIES_PATH.to_owned() + "/ffprobe-" + &target_triple,
    )?;
    Ok(())
}

fn download_x86_64_pc_windows_msvc() -> Result<()> {
    let target_triple = std::env::var("TARGET")?;

    let version = reqwest::blocking::get(X86_64_PC_WINDOWS_MSVC_VERSION)?.text()?;
    let sha256 = reqwest::blocking::get(X86_64_PC_WINDOWS_MSVC_SHA256)?.text()?;
    let raw_data = reqwest::blocking::get(X86_64_PC_WINDOWS_MSVC_ARCHIVE)?.bytes()?;

    let tmp_dir = tempdir()?;
    let windows_binaries_path: std::path::PathBuf = tmp_dir
        .path()
        .join(format!("ffmpeg-{version}-essentials_build/bin"));

    let mut hasher = Sha256::new();
    hasher.update(&raw_data);
    assert_eq!(format!("{:x}", hasher.finalize()), sha256);

    decompress(&mut Cursor::new(raw_data), &tmp_dir)?;

    copy(
        windows_binaries_path.join("ffmpeg.exe"),
        BINARIES_PATH.to_owned() + "/ffmpeg-" + &target_triple + ".exe",
    )?;
    copy(
        windows_binaries_path.join("ffprobe.exe"),
        BINARIES_PATH.to_owned() + "/ffprobe-" + &target_triple + ".exe",
    )?;
    Ok(())
}

fn download_x86_64_apple_darwin() -> Result<()> {
    let target_triple = std::env::var("TARGET")?;

    let tmp_dir = tempdir()?;

    let raw_data_ffmpeg = reqwest::blocking::get(X86_64_APPLE_DARWIN_FFMPEG_ARCHIVE)?.bytes()?;
    zip_extract::extract(Cursor::new(raw_data_ffmpeg), tmp_dir.path(), false)?;
    let mut hasher = Sha256::new();
    hasher.update(fs::read(tmp_dir.path().join("ffmpeg"))?);
    assert_eq!(
        format!("{:x}", hasher.finalize()),
        X86_64_APPLE_DARWIN_FFMPEG_SHA256
    );

    let raw_data_ffprobe = reqwest::blocking::get(X86_64_APPLE_DARWIN_FFPROBE_ARCHIVE)?.bytes()?;
    zip_extract::extract(Cursor::new(raw_data_ffprobe), tmp_dir.path(), false)?;
    let mut hasher = Sha256::new();
    hasher.update(fs::read(tmp_dir.path().join("ffprobe"))?);
    assert_eq!(
        format!("{:x}", hasher.finalize()),
        X86_64_APPLE_DARWIN_FFPROBE_SHA256
    );

    copy(
        tmp_dir.path().join("ffmpeg"),
        BINARIES_PATH.to_owned() + "/ffmpeg-" + &target_triple,
    )?;
    copy(
        tmp_dir.path().join("ffprobe"),
        BINARIES_PATH.to_owned() + "/ffprobe-" + &target_triple,
    )?;

    Ok(())
}

fn download_aarch64_apple_darwin() -> Result<()> {
    let target_triple = std::env::var("TARGET")?;

    let tmp_dir = tempdir()?;

    let raw_data_ffmpeg = reqwest::blocking::get(AARCH64_APPLE_DARWIN_FFMPEG_ARCHIVE)?.bytes()?;
    zip_extract::extract(Cursor::new(raw_data_ffmpeg), tmp_dir.path(), false)?;
    let mut hasher = Sha256::new();
    hasher.update(fs::read(tmp_dir.path().join("ffmpeg"))?);
    assert_eq!(
        format!("{:x}", hasher.finalize()),
        AARCH64_APPLE_DARWIN_FFMPEG_SHA256
    );

    let raw_data_ffprobe = reqwest::blocking::get(AARCH64_APPLE_DARWIN_FFPROBE_ARCHIVE)?.bytes()?;
    zip_extract::extract(Cursor::new(raw_data_ffprobe), tmp_dir.path(), false)?;
    let mut hasher = Sha256::new();
    hasher.update(fs::read(tmp_dir.path().join("ffprobe"))?);
    assert_eq!(
        format!("{:x}", hasher.finalize()),
        AARCH64_APPLE_DARWIN_FFPROBE_SHA256
    );

    copy(
        tmp_dir.path().join("ffmpeg"),
        BINARIES_PATH.to_owned() + "/ffmpeg-" + &target_triple,
    )?;
    copy(
        tmp_dir.path().join("ffprobe"),
        BINARIES_PATH.to_owned() + "/ffprobe-" + &target_triple,
    )?;

    Ok(())
}
