use std::collections::{HashMap, HashSet};

use super::{
  EDGE_TYPES, NODE_TYPES, NODE_TYPE_CODE, NODE_TYPE_HIDDEN, NODE_TYPE_NATIVE, NODE_TYPE_OBJECT,
};
use petgraph::graph::NodeIndex;
use petgraph::{Directed, Graph};

#[derive(Clone, Copy)]
pub enum AdjacentType {
  From,
  To,
}

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
  pub fn get_node_type(&self) -> &str {
    NODE_TYPES[self.node_type_index]
  }

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

  pub fn get_name(&self, s: &SnapshotDeserialized) -> String {
    s.strings[self.name_index].clone()
  }

  pub fn get_to_edges<'a>(&self, s: &'a SnapshotDeserialized) -> Vec<&'a SnapshotEdge> {
    let mut edges: Vec<&'a SnapshotEdge> = vec![];

    for to_edge_idx in &self.to_edge_index {
      match s.edges.get(*to_edge_idx as usize) {
        Some(edge) => edges.push(edge),
        None => {}
      }
    }

    edges
  }

  /// get adjacent edges
  /// * `s` SnapshotDeserialized
  /// * `adjacent_type` what adjacent type of edges to get. from, to or all
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
      AdjacentType::From => {
        convert_items_with_adjacent(self.from_edge_index.to_owned(), mapper_filter)
      }
      AdjacentType::To => convert_items_with_adjacent(self.to_edge_index.to_owned(), mapper_filter),
    }
  }

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

  pub fn get_to_nodes<'a>(&self, s: &'a SnapshotDeserialized) -> Vec<&'a SnapshotNode> {
    let to_edges = self.get_to_edges(s);

    to_edges
      .into_iter()
      .filter_map(|edge| s.nodes.get(edge.to_node_index as usize))
      .collect::<Vec<&SnapshotNode>>()
  }
}

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
  pub fn get_edge_type(&self) -> &'static str {
    EDGE_TYPES[self.edge_type_index]
  }

  pub fn get_edge_name<'a>(&self, s: &'a SnapshotDeserialized) -> String {
    s.strings[self.name_or_index_raw as usize].clone()
  }

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
      AdjacentType::From => convert_items_with_adjacent(vec![self.from_node_index], mapper_filter),
      AdjacentType::To => convert_items_with_adjacent(vec![self.to_node_index], mapper_filter),
    }
  }
}

pub struct SnapshotDeserialized {
  pub nodes: Vec<SnapshotNode>,
  pub edges: Vec<SnapshotEdge>,
  pub strings: Vec<String>,
  pub graph: Graph<usize, usize, Directed>,
}

fn convert_items_with_adjacent<'a, T, S>(
  items: Vec<T>,
  mapper_filter: impl Fn(T) -> Option<&'a S>,
) -> Vec<&'a S> {
  items.into_iter().filter_map(mapper_filter).collect()
}
