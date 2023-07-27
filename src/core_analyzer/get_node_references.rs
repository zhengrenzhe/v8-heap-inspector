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
  pub from_edges: Vec<EdgeInfoReturnValue>,
  pub to_edges: Vec<EdgeInfoReturnValue>,
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

fn get_nodes<'a>(
  edges: &'a Vec<&SnapshotEdge>,
  s: &'a SnapshotDeserialized,
  get_from: bool,
) -> Vec<&'a SnapshotNode> {
  edges
    .iter()
    .map(|edge| {
      s.nodes
        .get({
          if get_from {
            edge.from_node_index as usize
          } else {
            edge.to_node_index as usize
          }
        })
        .unwrap()
    })
    .collect::<Vec<&SnapshotNode>>()
}

fn find_reference(
  node: &SnapshotNode,
  s: &SnapshotDeserialized,
  with_up: bool,
  with_down: bool,
  depth: u32,
) -> Vec<NodeFullInfoReturnValue> {
  if depth > 2 {
    return vec![];
  }

  let from_edges = get_edges(&node.from_edge_index, s);
  let to_edges = get_edges(&node.to_edge_index, s);

  let node_full_info = NodeFullInfoReturnValue {
    abstract_info: NodeAbstractInfoReturnValue::new(node),
    from_edges: from_edges
      .iter()
      .map(|e| EdgeInfoReturnValue::new(e))
      .collect(),
    to_edges: to_edges
      .iter()
      .map(|e| EdgeInfoReturnValue::new(e))
      .collect(),
  };

  let mut result = vec![node_full_info];

  if with_up {
    for from_node in get_nodes(&from_edges, s, true) {
      let mut r: Vec<NodeFullInfoReturnValue> =
        find_reference(from_node, s, true, false, depth + 1);
      result.append(&mut r);
    }
  }

  if with_down {
    for to_node in get_nodes(&to_edges, s, false) {
      let mut r = find_reference(to_node, s, false, true, depth + 1);
      result.append(&mut r);
    }
  }

  result
}

pub fn get_node_references(
  s: &SnapshotDeserialized,
  node_idx: i64,
) -> Vec<NodeFullInfoReturnValue> {
  let node = s.nodes.get(node_idx as usize);

  if node.is_none() {
    return vec![];
  }

  return find_reference(node.unwrap(), s, true, true, 0);
}
