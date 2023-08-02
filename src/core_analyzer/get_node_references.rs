use crate::core::{SnapshotDeserialized, SnapshotNode};

use super::NodeAbstractInfoReturnValue;

#[derive(Debug)]
#[napi(object)]
pub struct NodeFullInfoReturnValue {
  pub info: NodeAbstractInfoReturnValue,
  pub children: Vec<NodeFullInfoReturnValue>,
}

impl NodeFullInfoReturnValue {
  pub fn new(
    n: &SnapshotNode,
    s: &SnapshotDeserialized,
    with_children: bool,
  ) -> NodeFullInfoReturnValue {
    let mut children: Vec<NodeFullInfoReturnValue> = vec![];

    if with_children {
      for to_edge in n.get_to_edges(s) {
        match s.nodes.get(to_edge.to_node_index as usize) {
          Some(child) => {
            children.push(NodeFullInfoReturnValue::new(child, s, false));
          }
          None => {}
        }
      }
    }

    return NodeFullInfoReturnValue {
      info: NodeAbstractInfoReturnValue::new(n),
      children,
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
      return NodeFullInfoReturnValue::new(node, s, true);
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
