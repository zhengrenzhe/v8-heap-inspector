use crate::core::{SnapshotDeserialized, SnapshotEdge, SnapshotNode};

use super::NodeAbstractInfoReturnValue;

#[napi(object)]
pub struct NodeFullInfoReturnValue {
  pub info: NodeAbstractInfoReturnValue,
  pub has_children: bool,
  pub children: Vec<NodeFullInfoReturnValue>,
  pub from_edge_type: String,
  pub from_edge_name: String,
}

impl NodeFullInfoReturnValue {
  pub fn new(
    n: &SnapshotNode,
    s: &SnapshotDeserialized,
    with_children: bool,
    from_edge: Option<&SnapshotEdge>,
  ) -> NodeFullInfoReturnValue {
    let mut children: Vec<NodeFullInfoReturnValue> = vec![];

    if with_children {
      for to_edge in n.get_to_edges(s) {
        match s.nodes.get(to_edge.to_node_index as usize) {
          Some(child) => {
            children.push(NodeFullInfoReturnValue::new(child, s, false, Some(to_edge)));
          }
          None => {}
        }
      }
    }

    return NodeFullInfoReturnValue {
      info: NodeAbstractInfoReturnValue::new(n, s),
      has_children: n.to_edge_index.is_empty(),
      children,
      from_edge_type: match from_edge {
        Some(edge) => edge.get_edge_type().to_string(),
        None => "".to_string(),
      },
      from_edge_name: match from_edge {
        Some(edge) => edge.get_edge_name(s),
        None => "".to_string(),
      },
    };
  }
}

pub fn get_node_references(
  s: &SnapshotDeserialized,
  path_idx: Vec<i64>,
) -> NodeFullInfoReturnValue {
  if path_idx.is_empty() {
    panic!("path_idx is empty")
  }

  let mut path_idx = path_idx;
  let mut node = match s.nodes.get(path_idx.remove(0) as usize) {
    Some(node) => node,
    None => panic!("not found node when start"),
  };

  loop {
    if path_idx.is_empty() {
      return NodeFullInfoReturnValue::new(node, s, true, None);
    }

    let next_index = path_idx.remove(0) as u64;
    let to_edges = node.get_to_edges(s);

    match to_edges.iter().find(|&x| x.to_node_index == next_index) {
      Some(to_edge) => match s.nodes.get(to_edge.to_node_index as usize) {
        Some(next_node) => {
          node = next_node;
        }
        None => {
          panic!(
            "not found to_node_index {} in edge: {:?}",
            to_edge.to_node_index, to_edge
          );
        }
      },
      None => {
        panic!("not found next_index {next_index} in node: {:?}", node)
      }
    }
  }
}
