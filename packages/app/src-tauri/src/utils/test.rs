#[cfg(test)]
pub mod test_utility {
    #[macro_export]
    macro_rules! test_file {
        ($file_name:expr) => {
            concat!(env!("CARGO_MANIFEST_DIR"), "/../../../assets/", $file_name)
        };
    }

    #[cfg(windows)]
    #[macro_export]
    macro_rules! test_binary_source {
        ($file_name:expr) => {
            concat!(
                env!("CARGO_MANIFEST_DIR"),
                "\\target\\debug\\",
                $file_name,
                ".exe"
            )
        };
    }

    #[cfg(windows)]
    pub fn copy_binary_to_deps(file_name: &str) -> (std::io::Result<u64>, std::io::Result<u64>) {
        let prj_dir = env!("CARGO_MANIFEST_DIR");

        let debug_copy = std::fs::copy(
            format!("{prj_dir}\\target\\debug\\{file_name}.exe"),
            format!("{prj_dir}\\target\\debug\\deps\\{file_name}.exe"),
        );

        let release_copy = std::fs::copy(
            format!("{prj_dir}\\target\\release\\{file_name}.exe"),
            format!("{prj_dir}\\target\\release\\deps\\{file_name}.exe"),
        );

        (debug_copy, release_copy)
    }

    #[cfg(not(windows))]
    pub fn copy_binary_to_deps(file_name: &str) -> (std::io::Result<u64>, std::io::Result<u64>) {
        let prj_dir = env!("CARGO_MANIFEST_DIR");

        let debug_copy = std::fs::copy(
            format!("{prj_dir}/target/debug/{file_name}"),
            format!("{prj_dir}/target/debug/deps/{file_name}"),
        );

        let release_copy = std::fs::copy(
            format!("{prj_dir}/target/release/{file_name}"),
            format!("{prj_dir}/target/release/deps/{file_name}"),
        );

        (debug_copy, release_copy)
    }
}
