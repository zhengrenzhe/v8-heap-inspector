use crate::core::EDGE_TYPES;

use super::{filter_map, AdjacentType, SnapshotDeserialized, SnapshotNode};

pub type SnapshotEdgeIdx = u64;

#[derive(Debug)]
pub struct SnapshotEdge {
  /// edge index in the snapshot.edges fields
  pub edge_index: SnapshotEdgeIdx,
  /// edge type index
  pub edge_type_index: usize,
  /// edge name or index raw value
  pub name_or_index_raw: u64,
  /// to node index in the snapshot.nodes fields
  pub to_node_index: u64,
  /// to node id
  pub to_node_id: u64,
  /// from node index in the snapshot.nodes fields
  pub from_node_index: u64,
  /// from node id
  pub from_node_id: u64,
}

impl SnapshotEdge {
  /// get edge type
  pub fn get_edge_type(&self) -> &'static str {
    EDGE_TYPES[self.edge_type_index]
  }

  /// get edge name
  /// * `s` SnapshotDeserialized
  pub fn get_edge_name<'a>(&self, s: &'a SnapshotDeserialized) -> String {
    s.strings[self.name_or_index_raw as usize].clone()
  }

  /// get adjacent nodes
  /// * `s` SnapshotDeserialized
  /// * `adjacent_type` AdjacentType
  /// * `filter_node` filter node function
  pub fn get_adjacent_nodes<'a>(
    &self,
    s: &'a SnapshotDeserialized,
    adjacent_type: AdjacentType,
    filter_node: impl Fn(&'a SnapshotNode, &AdjacentType) -> bool,
  ) -> Vec<&'a SnapshotNode> {
    let mapper_filter = |node_idx| {
      let node = s.nodes.get(node_idx as usize).unwrap();
      match filter_node(node, &adjacent_type) {
        true => Some(node),
        false => None,
      }
    };

    match adjacent_type {
      AdjacentType::From => filter_map(vec![self.from_node_index], mapper_filter),
      AdjacentType::To => filter_map(vec![self.to_node_index], mapper_filter),
    }
  }
}
