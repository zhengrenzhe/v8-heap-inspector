use crate::core::{SnapshotDeserialized, SnapshotNode};

#[derive(Debug)]
#[napi(object)]
pub struct NodeAbstractInfoReturnValue {
  pub node_idx: i64,
  pub node_type: String,
  pub name: String,
  pub id: i64,
  pub self_size: i64,
}

impl NodeAbstractInfoReturnValue {
  pub fn new(node: &SnapshotNode, s: &SnapshotDeserialized) -> NodeAbstractInfoReturnValue {
    NodeAbstractInfoReturnValue {
      node_idx: node.node_idx as i64,
      node_type: node.get_node_type().to_string(),
      name: node.get_name(s),
      id: node.id as i64,
      self_size: node.self_size as i64,
    }
  }
}

/// 根据构造器名称获取节点摘要信息
/// * `s` 反序列化后的堆内存快照
/// * `constructor_name` 构造器名称
pub fn get_nodes_abstract_info_by_constructor_name(
  s: &SnapshotDeserialized,
  constructor_name: &str,
) -> Vec<NodeAbstractInfoReturnValue> {
  let mut nodes: Vec<NodeAbstractInfoReturnValue> = Vec::new();

  for node in s.nodes.iter() {
    let cls = &node.get_node_cls_name(s);
    if cls == constructor_name {
      nodes.push(NodeAbstractInfoReturnValue::new(node, s));
    }
  }

  nodes
}
