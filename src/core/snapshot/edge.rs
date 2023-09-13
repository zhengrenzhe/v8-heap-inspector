use crate::core::{EDGE_TYPES, EDGE_TYPE_ELEMENT, EDGE_TYPE_HIDDEN};

use super::{filter_map, AdjacentType, SnapshotDeserialized, SnapshotNode};

/// 边索引类型
pub type SnapshotEdgeIdx = u64;

/// 边
#[derive(Debug)]
pub struct SnapshotEdge {
  /// 边在快照 edges 字段中的索引
  pub edge_index: SnapshotEdgeIdx,
  /// 边类型索引
  pub edge_type_index: usize,
  /// 边的名称或索引原始值
  pub name_or_index_raw: u64,
  /// 边的目标节点索引
  pub to_node_index: u64,
  /// 边的目标节点 ID
  pub to_node_id: u64,
  /// 边的来源节点索引
  pub from_node_index: u64,
  /// 边的来源节点 ID
  pub from_node_id: u64,
}

impl SnapshotEdge {
  /// 获取边的类型字符串
  pub fn get_edge_type(&self) -> &'static str {
    EDGE_TYPES[self.edge_type_index]
  }

  /// 获取边的名称
  /// * `s` 反序列化后的堆内存快照
  pub fn get_edge_name<'a>(&self, s: &'a SnapshotDeserialized) -> String {
    // 拿到边的类型
    let edge_type = self.get_edge_type();

    // 如果是 hidden 或 element 类型，name_or_index_raw 存储了边的名称
    if edge_type == EDGE_TYPE_HIDDEN || edge_type == EDGE_TYPE_ELEMENT {
      return self.name_or_index_raw.to_string();
    }

    // 否则 name_or_index_raw 就是索引，从 strings 中取
    s.strings[self.name_or_index_raw as usize].clone()
  }

  /// 获取边连接的节点
  /// * `s` 反序列化后的堆内存快照
  /// * `adjacent_type` 连接方向
  /// * `filter_node` 过滤函数
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
      AdjacentType::From => filter_map(vec![self.from_node_index], mapper_filter),
      AdjacentType::To => filter_map(vec![self.to_node_index], mapper_filter),
    }
  }
}
