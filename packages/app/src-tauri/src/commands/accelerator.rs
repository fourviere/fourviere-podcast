use serde::Serialize;

#[allow(dead_code)]
#[derive(Debug, Serialize)]
pub enum Accelerator {
    None,
    Cuda,
    Metal,
    Mkl,
}

#[tauri::command]
pub async fn get_accelerator() -> Accelerator {
    if cfg!(feature = "cuda") {
        return Accelerator::Cuda;
    }

    if cfg!(feature = "metal") {
        return Accelerator::Metal;
    }

    if cfg!(feature = "mkl") {
        return Accelerator::Mkl;
    }

    Accelerator::None
}
