use serde::Serialize;

#[allow(dead_code)]
#[derive(Serialize)]
pub enum Accelerator {
    None,
    Cuda,
    Metal,
    Mkl,
}

#[tauri::command]
pub async fn get_accelerator() -> Accelerator {
    #[cfg(feature = "cuda")]
    return Accelerator::Cuda;

    #[cfg(feature = "metal")]
    return Accelerator::Metal;

    #[cfg(feature = "mkl")]
    return Accelerator::Mkl;

    Accelerator::None
}
