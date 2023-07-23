use crate::core::{SnapshotDeserialized, SnapshotNode};

#[napi(object)]
pub struct NodeAbstractInfoReturnValue {
  pub node_idx: i64,
  pub node_type_index: i64,
  pub name: String,
  pub id: i64,
  pub self_size: i64,
  pub edge_count: i64,
}

pub fn wrap_node_abstract_info(node: &SnapshotNode) -> NodeAbstractInfoReturnValue {
  NodeAbstractInfoReturnValue {
    node_idx: node.node_idx as i64,
    node_type_index: node.node_type_index as i64,
    name: node.name.clone(),
    id: node.id as i64,
    self_size: node.self_size as i64,
    edge_count: node.edge_count as i64,
  }
}

pub fn get_nodes_abstract_info_by_constructor_name(
  s: &SnapshotDeserialized,
  constructor_name: &str,
) -> Vec<NodeAbstractInfoReturnValue> {
  let mut nodes: Vec<NodeAbstractInfoReturnValue> = Vec::new();

  for node in s.nodes.iter() {
    let cls = &node.get_node_cls_name();
    if cls == constructor_name {
      nodes.push(wrap_node_abstract_info(node));
    }
  }

  nodes
}
