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
    pub fn copy_binary_to_deps(file_name: &str) -> std::io::Result<u64> {
        let prj_dir = env!("CARGO_MANIFEST_DIR");
        let source = format!("{prj_dir}\\target\\debug\\{file_name}.exe");
        let dest = format!("{prj_dir}\\target\\debug\\deps\\{file_name}.exe");
        std::fs::copy(source, dest)
    }

    #[cfg(not(windows))]
    pub fn copy_binary_to_deps(file_name: &str) -> std::io::Result<u64> {
        let prj_dir = env!("CARGO_MANIFEST_DIR");
        let source = format!("{prj_dir}/target/debug/{file_name}");
        let dest = format!("{prj_dir}/target/debug/deps/{file_name}");
        std::fs::copy(&source, &dest)
    }
}
