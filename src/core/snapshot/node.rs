use std::collections::{HashMap, HashSet};

use petgraph::graph::NodeIndex;

use crate::core::{
  NODE_TYPES, NODE_TYPE_CODE, NODE_TYPE_HIDDEN, NODE_TYPE_NATIVE, NODE_TYPE_OBJECT,
};

use super::{filter_map, AdjacentType, SnapshotDeserialized, SnapshotEdge, SnapshotEdgeIdx};

pub type SnapshotNodeIdx = u64;

#[derive(Debug)]
pub struct SnapshotNode {
  /// node index in the snapshot.nodes fields
  pub node_idx: SnapshotNodeIdx,
  /// node type index
  pub node_type_index: usize,
  /// node index field
  pub name_index: usize,
  /// unique node id in v8 snapshot
  pub id: u64,
  /// node self size
  pub self_size: u64,
  /// node edge count
  pub edge_count: u64,
  pub trace_node_id: u64,
  pub detachedness: u64,
  /// from edge index list
  pub from_edge_index: Vec<u64>,
  /// to edge index list
  pub to_edge_index: Vec<u64>,
  /// graph node index
  pub graph_node: NodeIndex,
}

impl SnapshotNode {
  /// get node type
  pub fn get_node_type(&self) -> &str {
    NODE_TYPES[self.node_type_index]
  }

  /// get node class name
  /// * `s` SnapshotDeserialized
  pub fn get_node_cls_name(&self, s: &SnapshotDeserialized) -> String {
    let node_type = self.get_node_type();

    if node_type == NODE_TYPE_HIDDEN {
      return "(system)".to_string();
    }

    if node_type == NODE_TYPE_NATIVE || node_type == NODE_TYPE_OBJECT {
      return self.get_name(s).to_string();
    }

    if node_type == NODE_TYPE_CODE {
      return "(compiled code)".to_string();
    }

    vec!["(", node_type, ")"].join("")
  }

  /// get node name
  /// * `s` SnapshotDeserialized
  pub fn get_name(&self, s: &SnapshotDeserialized) -> String {
    s.strings[self.name_index].clone()
  }

  /// get adjacent edges
  /// * `s` SnapshotDeserialized
  /// * `adjacent_type` what adjacent type of edges to get. from or to
  /// * `filter` filter result
  pub fn get_adjacent_edges<'a>(
    &self,
    s: &'a SnapshotDeserialized,
    adjacent_type: AdjacentType,
    filter: impl Fn(&'a SnapshotEdge, &AdjacentType) -> bool,
  ) -> Vec<&'a SnapshotEdge> {
    let mapper_filter = |edge_idx| {
      let edge = s.edges.get(edge_idx as usize).unwrap();
      match filter(edge, &adjacent_type) {
        true => Some(edge),
        false => None,
      }
    };

    match adjacent_type {
      AdjacentType::From => filter_map(self.from_edge_index.to_owned(), mapper_filter),
      AdjacentType::To => filter_map(self.to_edge_index.to_owned(), mapper_filter),
    }
  }

  /// get adjacent nodes
  /// * `s` SnapshotDeserialized
  /// * `adjacent_type` what adjacent type of edges to get. from or to
  /// * `filter_edge` filter edge result
  /// * `filter_node` filter node result
  pub fn get_adjacent_nodes<'a>(
    &self,
    s: &'a SnapshotDeserialized,
    adjacent_type: AdjacentType,
    filter_edge: impl Fn(&'a SnapshotEdge, &AdjacentType) -> bool,
    filter_node: impl Fn(&'a SnapshotNode, &AdjacentType) -> bool,
  ) -> Vec<(&'a SnapshotNode, Vec<&'a SnapshotEdge>)> {
    let adjacent_edges = self
      .get_adjacent_edges(s, adjacent_type, filter_edge)
      .into_iter();

    let mut node_map: HashMap<SnapshotNodeIdx, HashSet<SnapshotEdgeIdx>> = HashMap::new();

    for edge in adjacent_edges {
      for ref_node in edge.get_adjacent_nodes(s, adjacent_type, &filter_node) {
        if !node_map.contains_key(&ref_node.node_idx) {
          node_map.insert(ref_node.node_idx, HashSet::from([edge.edge_index]));
        } else {
          node_map
            .get_mut(&ref_node.node_idx)
            .unwrap()
            .insert(edge.edge_index);
        }
      }
    }

    node_map
      .iter()
      .map(|(node_idx, edge_idxs)| {
        (
          s.nodes.get(*node_idx as usize).unwrap(),
          edge_idxs
            .iter()
            .map(|edge_idx| s.edges.get(*edge_idx as usize).unwrap())
            .collect::<Vec<&SnapshotEdge>>(),
        )
      })
      .collect()
  }
}
