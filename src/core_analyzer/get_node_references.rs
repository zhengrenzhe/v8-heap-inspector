use crate::core::{SnapshotDeserialized, SnapshotEdge, SnapshotNode};

use super::NodeAbstractInfoReturnValue;

#[napi(object)]
pub struct EdgeInfoReturnValue {
  pub edge_type: String,
  pub to_node_id: i64,
  pub to_node_idx: i64,
  pub from_node_id: i64,
  pub from_node_idx: i64,
}

impl EdgeInfoReturnValue {
  pub fn new(n: &SnapshotEdge) -> EdgeInfoReturnValue {
    EdgeInfoReturnValue {
      edge_type: n.get_edge_type().to_string(),
      to_node_id: n.to_node_id as i64,
      to_node_idx: n.to_node_index as i64,
      from_node_id: n.from_node_id as i64,
      from_node_idx: n.from_node_index as i64,
    }
  }
}

#[napi(object)]
pub struct NodeFullInfoReturnValue {
  pub abstract_info: NodeAbstractInfoReturnValue,
  pub children: Vec<NodeFullInfoReturnValue>,
}

impl std::ops::Deref for NodeFullInfoReturnValue {
  type Target = NodeAbstractInfoReturnValue;

  fn deref(&self) -> &Self::Target {
    &self.abstract_info
  }
}

fn get_edges<'a>(idx: &'a Vec<u64>, s: &'a SnapshotDeserialized) -> Vec<&'a SnapshotEdge> {
  idx
    .iter()
    .map(|edge_idx| s.edges.get(*edge_idx as usize).unwrap())
    .collect()
}

fn find_reference_tree(
  node: &SnapshotNode,
  s: &SnapshotDeserialized,
  depth: i64,
  max_depth: i64,
) -> NodeFullInfoReturnValue {
  let to_edges = get_edges(&node.to_edge_index, s);

  let to_nodes = to_edges
    .iter()
    .map(|edge| s.nodes.get(edge.to_node_index as usize).unwrap())
    .collect::<Vec<&SnapshotNode>>();

  let mut children: Vec<NodeFullInfoReturnValue> = vec![];
  if depth < max_depth {
    children = to_nodes
      .iter()
      .map(|node| find_reference_tree(node, s, depth + 1, max_depth))
      .collect::<Vec<NodeFullInfoReturnValue>>();
  }

  let node_full_info = NodeFullInfoReturnValue {
    abstract_info: NodeAbstractInfoReturnValue::new(node),
    children,
  };

  node_full_info
}

pub fn get_node_references(
  s: &SnapshotDeserialized,
  node_idx: i64,
  max_depth: i64,
) -> Option<NodeFullInfoReturnValue> {
  let node = s.nodes.get(node_idx as usize);

  if node.is_none() {
    return None;
  }

  return Some(find_reference_tree(node.unwrap(), s, 0, max_depth));
}
