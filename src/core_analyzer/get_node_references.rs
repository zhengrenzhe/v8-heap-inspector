use crate::core::{AdjacentType, SnapshotDeserialized, SnapshotEdge, SnapshotNode};

use super::NodeAbstractInfoReturnValue;

#[napi(object)]

pub struct LiteFromEdgeInfoReturnValue {
  pub edge_type: String,
  pub edge_name: String,
}

#[napi(object)]
pub struct NodeFullInfoReturnValue {
  pub info: NodeAbstractInfoReturnValue,
  pub has_children: bool,
  pub child_nodes_idx: Vec<i64>,
  pub from_edges: Option<Vec<LiteFromEdgeInfoReturnValue>>,
}

impl NodeFullInfoReturnValue {
  pub fn new(
    n: &SnapshotNode,
    s: &SnapshotDeserialized,
    from_edges: Option<Vec<&SnapshotEdge>>,
  ) -> NodeFullInfoReturnValue {
    let mut child_nodes_idx: Vec<i64> = vec![];

    for to_node in n.get_to_nodes(s) {
      child_nodes_idx.push(to_node.node_idx as i64);
    }

    return NodeFullInfoReturnValue {
      info: NodeAbstractInfoReturnValue::new(n, s),
      has_children: !n.to_edge_index.is_empty(),
      child_nodes_idx,
      from_edges: match from_edges {
        Some(from_edges) => Some(
          from_edges
            .iter()
            .map(|edge| LiteFromEdgeInfoReturnValue {
              edge_type: edge.get_edge_type().to_string(),
              edge_name: edge.get_edge_name(s),
            })
            .collect(),
        ),
        None => None,
      },
    };
  }
}

pub fn get_node_references(
  s: &SnapshotDeserialized,
  node_idx: i64,
  from_node_idx: Option<i64>,
) -> Vec<NodeFullInfoReturnValue> {
  let node = match s.nodes.get(node_idx as usize) {
    Some(node) => node,
    None => panic!("not found node by idx: {}", node_idx),
  };

  let from_edges = match from_node_idx {
    Some(from_node_idx) => Some(
      node
        .get_adjacent_edges(s, AdjacentType::From, |e, _| {
          e.from_node_index == from_node_idx as u64
        })
        .iter()
        .map(|s| *s)
        .collect::<Vec<&SnapshotEdge>>(),
    ),
    None => None,
  };

  let mut result = vec![NodeFullInfoReturnValue::new(node, s, from_edges)];

  for (to_node, to_node_from_edges) in
    node.get_adjacent_nodes(s, AdjacentType::To, |_, _| true, |_, _| true)
  {
    result.push(NodeFullInfoReturnValue::new(
      to_node,
      s,
      Some(to_node_from_edges),
    ));
  }

  return result;
}
