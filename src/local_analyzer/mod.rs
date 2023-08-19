use std::fs;

use crate::core_analyzer::{
  get_all_constructors, get_node_references, get_nodes_abstract_info_by_constructor_name,
  GetAllConstructorsReturnValue, NodeAbstractInfoReturnValue, NodeFullInfoReturnValue,
};

#[napi(object)]
#[derive(Clone)]
pub struct LocalAnalyzerMeta {
  pub path: String,
  pub size: i64,
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
          size: slice.len() as i64,
        },
      };
    }

    panic!("Failed to read snapshot file {}", path);
  }

  #[napi]
  pub fn get_meta(&self) -> LocalAnalyzerMeta {
    self.meta.clone()
  }

  #[napi]
  pub fn get_all_constructors(&self) -> GetAllConstructorsReturnValue {
    get_all_constructors(&self.snapshot)
  }

  #[napi]
  pub fn get_nodes_abstract_info_by_constructor_name(
    &self,
    constructor_name: String,
  ) -> Vec<NodeAbstractInfoReturnValue> {
    get_nodes_abstract_info_by_constructor_name(&self.snapshot, &constructor_name)
  }

  #[napi]
  pub fn get_node_references(
    &self,
    node_idx: i64,
    from_node_idx: Option<i64>,
  ) -> Vec<NodeFullInfoReturnValue> {
    get_node_references(&self.snapshot, node_idx, from_node_idx)
  }
}
