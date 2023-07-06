use std::fs;

mod core;

#[macro_use]
extern crate napi_derive;

#[napi(constructor)]
#[derive(Clone)]
pub struct LocalAnalyzerMeta {
  pub path: String,
  pub size: u32,
}

#[napi(js_name = "LocalAnalyzer")]
pub struct LocalAnalyzer {
  meta: LocalAnalyzerMeta,
  snapshot: crate::core::SnapshotDeserialized,
}

#[napi]
impl LocalAnalyzer {
  #[napi(constructor)]
  pub fn new(path: String) -> Self {
    if let Ok(slice) = fs::read(&path) {
      let snapshot = crate::core::deserialize(&slice);

      return LocalAnalyzer {
        snapshot,
        meta: LocalAnalyzerMeta {
          path,
          size: slice.len() as u32,
        },
      };
    }

    panic!("Failed to read snapshot file {}", path);
  }

  #[napi]
  pub fn meta(&self) -> LocalAnalyzerMeta {
    self.meta.clone()
  }
}
