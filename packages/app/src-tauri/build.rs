use std::{
    fs::{copy, create_dir, metadata},
    io::Cursor,
};

use anyhow::Result;
use sevenz_rust::decompress;
use sha2::{Digest, Sha256};
use tar::Archive;
use tempfile::tempdir;

const LINUX_64_ARCHIVE: &'static str =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
const LINUX_64_MD5: &'static str =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz.md5";

const WINDOWS_64_ARCHIVE: &'static str =
    "https://github.com/GyanD/codexffmpeg/releases/download/6.1/ffmpeg-6.1-essentials_build.7z";
const WINDOWS_64_SHA256: &'static str =
    "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z.sha256";

const BINARIES_PATH: &'static str = concat!(env!("CARGO_MANIFEST_DIR"), "/binaries");

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
            "x86_64-unknown-linux-gnu" => download_linux(),
            "x86_64-pc-windows-msvc" => download_windows(),
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
        ffmpeg = ffmpeg + ".exe";
        ffprobe = ffprobe + ".exe";
    }

    if metadata(ffmpeg).is_ok() && metadata(ffprobe).is_ok() {
        return true;
    }

    false
}

fn download_linux() -> Result<()> {
    let target_triple = std::env::var("TARGET")?;

    let tmp_dir = tempdir()?;
    let tarball_path: std::path::PathBuf = tmp_dir.path().join("ffmpeg-6.1-amd64-static");

    let mut decomp: Vec<u8> = Vec::new();
    let md5 = reqwest::blocking::get(LINUX_64_MD5)?
        .text()?
        .split_ascii_whitespace()
        .rev()
        .last()
        .unwrap_or_default()
        .to_owned();
    let raw_data = reqwest::blocking::get(LINUX_64_ARCHIVE)?.bytes()?;

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

fn download_windows() -> Result<()> {
    let target_triple = std::env::var("TARGET")?;

    let tmp_dir = tempdir()?;
    let windows_binaries_path: std::path::PathBuf =
        tmp_dir.path().join("ffmpeg-6.1-essentials_build/bin");

    let sha256 = reqwest::blocking::get(WINDOWS_64_SHA256)?.text()?;
    let raw_data = reqwest::blocking::get(WINDOWS_64_ARCHIVE)?.bytes()?;

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
