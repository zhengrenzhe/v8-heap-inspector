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
  start_idx: i64,
  path_idx: Vec<i64>,
) -> Option<NodeFullInfoReturnValue> {
  let node = s.nodes.get(start_idx as usize);

  if node.is_none() {
    return None;
  }

  let mut node = node.unwrap();
  let mut path_idx = path_idx;

  loop {
    println!("path_idx {:?}", path_idx);

    if path_idx.is_empty() {
      return Some(NodeFullInfoReturnValue::new(node, s, true));
    }

    let next_index = path_idx.remove(0) as u64;
    let to_edges = node.get_to_edges(s);

    match to_edges.iter().find(|&x| x.to_node_index == next_index) {
      Some(to_edge) => match s.nodes.get(to_edge.to_node_index as usize) {
        Some(next_node) => {
          node = next_node;
        }
        None => {
          return None;
        }
      },
      None => {
        panic!("not found next_index {next_index} in node: {:?}", node)
      }
    }
  }
}
