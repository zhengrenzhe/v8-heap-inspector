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
  pub children: Vec<NodeFullInfoReturnValue>,
  pub children_idx: Vec<i64>,
  pub self_loop: bool,
  pub from_edges: Option<Vec<LiteFromEdgeInfoReturnValue>>,
}

impl NodeFullInfoReturnValue {
  pub fn new(
    n: &SnapshotNode,
    s: &SnapshotDeserialized,
    from_edges: Option<Vec<&SnapshotEdge>>,
    from_node: Option<&SnapshotNode>,
    with_descendants: bool,
  ) -> NodeFullInfoReturnValue {
    // node self info
    let info = NodeAbstractInfoReturnValue::new(n, s);

    // is self loop
    let self_loop = from_node.is_some_and(|from_node| from_node.node_idx == n.node_idx);

    // has children
    let has_children = if self_loop {
      false
    } else {
      !n.to_edge_index.is_empty()
    };

    // child nodes
    let mut children: Vec<NodeFullInfoReturnValue> = vec![];
    let mut children_idx: Vec<i64> = vec![];

    for (child, child_edges) in n.get_adjacent_nodes(s, AdjacentType::To, |_, _| true, |_, _| true)
    {
      children_idx.push(child.node_idx as i64);
      if with_descendants {
        children.push(NodeFullInfoReturnValue::new(
          child,
          s,
          Some(child_edges),
          Some(n),
          false,
        ))
      }
    }

    // from edges
    let from_edges: Option<Vec<LiteFromEdgeInfoReturnValue>> = match from_edges {
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
    };

    return NodeFullInfoReturnValue {
      info,
      has_children,
      self_loop,
      children,
      children_idx,
      from_edges,
    };
  }
}

/// get node references
/// * `s` SnapshotDeserialized
/// * `node_idx` node index
/// * `from_node_idx` from node index
pub fn get_node_references(
  s: &SnapshotDeserialized,
  node_idx: i64,
  from_node_idx: Option<i64>,
) -> NodeFullInfoReturnValue {
  let node = match s.nodes.get(node_idx as usize) {
    Some(node) => node,
    None => panic!("not found node by idx: {}", node_idx),
  };

  let from_node = match from_node_idx {
    Some(from_node_idx) => match s.nodes.get(from_node_idx as usize) {
      Some(from_node) => Some(from_node),
      None => panic!("not found node by idx: {}", from_node_idx),
    },
    None => None,
  };

  let from_edges = match from_node {
    Some(from_node) => Some(
      node
        .get_adjacent_edges(s, AdjacentType::From, |e, _| {
          e.from_node_index == from_node.node_idx as u64
        })
        .iter()
        .map(|s| *s)
        .collect::<Vec<&SnapshotEdge>>(),
    ),
    None => None,
  };

  return NodeFullInfoReturnValue::new(node, s, from_edges, from_node, true);
}
