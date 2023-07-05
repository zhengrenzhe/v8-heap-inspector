mod core;

#[macro_use]
extern crate napi_derive;

#[napi(js_name = "LocalAnalyzer")]
pub struct LocalAnalyzer {
  pub path: String,
  snapshot: crate::core::SnapshotDeserialized,
}

#[napi]
impl LocalAnalyzer {
  #[napi(constructor)]
  pub fn new(path: String) -> Self {
    let snapshot = crate::core::deserialize_from(path.clone());
    LocalAnalyzer { path, snapshot }
  }

  #[napi]
  pub fn log(&self) {
    println!("path {}", self.path);
    println!("nodes {}", self.snapshot.nodes.len());
  }
}
