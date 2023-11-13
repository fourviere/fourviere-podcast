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
