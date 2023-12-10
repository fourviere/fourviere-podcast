use std::{
    fs::{copy, create_dir, metadata},
    io::Cursor,
};

use anyhow::Result;
use tar::Archive;
use tempfile::tempdir;

const LINUX_64_ARCHIVE: &'static str =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
const LINUX_64_MD5: &'static str =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz.md5";

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
    match std::env::var("TARGET").as_ref() {
        Ok(var) => match var.as_str() {
            "x86_64-unknown-linux-gnu" => download_linux(),
            _ => panic!(),
        },
        Err(_) => panic!("Failing acquiring target information"),
    }
}

fn check_binaries() -> bool {
    let _ = create_dir(BINARIES_PATH);
    let target_triple = std::env::var("TARGET").unwrap_or_default();
    if metadata(BINARIES_PATH.to_owned() + "/ffmpeg-" + &target_triple).is_ok()
        && metadata(BINARIES_PATH.to_owned() + "/ffprobe-" + &target_triple).is_ok()
    {
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
