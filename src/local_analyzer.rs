use std::fs;

use crate::core::NODE_TYPES_LENGTH;

#[napi(object)]
#[derive(Clone)]
pub struct LocalAnalyzerMeta {
  pub path: String,
  pub size: u32,
}

#[napi(object)]
pub struct LocalAnalyzerStatistics {
  pub total_size: i64,
  pub distribution: Vec<i64>,
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

  #[napi]
  pub fn statistics(&self) -> LocalAnalyzerStatistics {
    let mut total_size = 0;

    let size = NODE_TYPES_LENGTH as usize;
    let mut distribution: Vec<i64> = Vec::with_capacity(size);
    for _ in 0..size {
      distribution.push(0);
    }

    for node in self.snapshot.nodes.iter() {
      total_size += node.self_size;

      distribution[node.node_type_index] += node.self_size as i64;
    }

    LocalAnalyzerStatistics {
      total_size: total_size as i64,
      distribution,
    }
  }
}
