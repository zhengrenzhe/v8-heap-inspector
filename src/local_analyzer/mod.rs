use std::fs;

use crate::core::{SnapshotNode, NODE_TYPES_LENGTH};

#[napi(object)]
#[derive(Clone)]
pub struct LocalAnalyzerMeta {
  pub path: String,
  pub size: i64,
}

#[napi(object)]
pub struct LocalAnalyzerStatistics {
  pub total_size: i64,
  pub distribution: Vec<i64>,
}

#[napi(object)]
pub struct LocalAnalyzerNodeInfo {
  pub id: i64,
  pub self_size: i64,
  pub name: String,
  pub node_type: String,
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
  pub fn meta(&self) -> LocalAnalyzerMeta {
    self.meta.clone()
  }

  #[napi]
  pub fn statistics(&self) -> LocalAnalyzerStatistics {
    let mut total_size = 0;

    let size = NODE_TYPES_LENGTH as usize;
    let mut distribution: Vec<i64> = vec![0; size];

    for node in self.snapshot.nodes.iter() {
      total_size += node.self_size;
      distribution[node.node_type_index] += (node.self_size) as i64;
    }

    LocalAnalyzerStatistics {
      total_size: total_size as i64,
      distribution,
    }
  }

  #[napi]
  pub fn get_entries(&self) -> Vec<LocalAnalyzerNodeInfo> {
    let entries: Vec<LocalAnalyzerNodeInfo> = self
      .snapshot
      .nodes
      .iter()
      .filter(|node| node.from_edge_index.len() < 2)
      .filter_map(|node| self.get_node_by_idx(node.node_idx as usize))
      .collect();

    entries
  }

  pub fn get_node_by_idx(&self, idx: usize) -> Option<LocalAnalyzerNodeInfo> {
    if let Some(node) = self.snapshot.nodes.get(idx) {
      return Some(self.convert_node_info(node));
    }

    None
  }

  fn convert_node_info(&self, node: &SnapshotNode) -> LocalAnalyzerNodeInfo {
    LocalAnalyzerNodeInfo {
      id: node.id as i64,
      self_size: node.self_size as i64,
      name: node.name.clone(),
      node_type: node.get_node_type().to_string(),
    }
  }
}
