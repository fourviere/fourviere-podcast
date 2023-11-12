pub mod fs;
pub mod ftp;
pub mod network;
pub mod s3;

#[macro_export]
macro_rules! test_file {
    ($file_name:expr) => {
        concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../core/tests/fixtures/",
            $file_name
        )
    };
}
