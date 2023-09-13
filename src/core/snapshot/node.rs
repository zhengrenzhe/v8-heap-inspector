use std::collections::{HashMap, HashSet};

use petgraph::graph::NodeIndex;

use crate::core::{
  NODE_TYPES, NODE_TYPE_CODE, NODE_TYPE_HIDDEN, NODE_TYPE_NATIVE, NODE_TYPE_OBJECT,
};

use super::{filter_map, AdjacentType, SnapshotDeserialized, SnapshotEdge, SnapshotEdgeIdx};

/// 节点索引类型
pub type SnapshotNodeIdx = u64;

/// 节点
#[derive(Debug)]
pub struct SnapshotNode {
  /// 节点在快照 nodes 字段中的索引
  pub node_idx: SnapshotNodeIdx,
  /// 节点类型索引
  pub node_type_index: usize,
  /// 节点名称索引
  pub name_index: usize,
  /// 节点在 v8 堆内存快照中的唯一 ID
  pub id: u64,
  /// 节点自身尺寸
  pub self_size: u64,
  /// 节点边的数量
  pub edge_count: u64,
  /// trace_node_id
  pub trace_node_id: u64,
  /// detachedness
  pub detachedness: u64,
  /// 来源边索引
  pub from_edge_index: Vec<u64>,
  /// 目标边索引
  pub to_edge_index: Vec<u64>,
  /// 节点在图中对应的节点
  pub graph_node: NodeIndex,
}

impl SnapshotNode {
  /// 获取节点类型
  pub fn get_node_type(&self) -> &str {
    NODE_TYPES[self.node_type_index]
  }

  /// 获取节点类名
  /// * `s` 反序列化后的堆内存快照
  pub fn get_node_cls_name(&self, s: &SnapshotDeserialized) -> String {
    // 拿到节点类型
    let node_type = self.get_node_type();

    // hidden 类型统一给 (system)，此逻辑同 chrome devtools
    if node_type == NODE_TYPE_HIDDEN {
      return "(system)".to_string();
    }

    // native 或 object 类型用节点名
    if node_type == NODE_TYPE_NATIVE || node_type == NODE_TYPE_OBJECT {
      return self.get_name(s).to_string();
    }

    // code 类型统一给 (compiled code)，此逻辑同 chrome devtools
    if node_type == NODE_TYPE_CODE {
      return "(compiled code)".to_string();
    }

    // 其余默认使用节点类型，此逻辑同 chrome devtools
    vec!["(", node_type, ")"].join("")
  }

  /// 获取节点名
  /// * `s` 反序列化后的堆内存快照
  pub fn get_name(&self, s: &SnapshotDeserialized) -> String {
    s.strings[self.name_index].clone()
  }

  /// 获取节点连接的边
  /// * `s` 反序列化后的堆内存快照
  /// * `adjacent_type` 连接方向
  /// * `filter` 过滤函数
  pub fn get_adjacent_edges<'a>(
    &self,
    s: &'a SnapshotDeserialized,
    adjacent_type: AdjacentType,
    filter: impl Fn(&'a SnapshotEdge, &AdjacentType) -> bool,
  ) -> Vec<&'a SnapshotEdge> {
    let mapper_filter = |edge_idx| {
      let edge = s.edges.get(edge_idx as usize).unwrap();
      match filter(edge, &adjacent_type) {
        true => Some(edge),
        false => None,
      }
    };

    match adjacent_type {
      AdjacentType::From => filter_map(self.from_edge_index.to_owned(), mapper_filter),
      AdjacentType::To => filter_map(self.to_edge_index.to_owned(), mapper_filter),
    }
  }

  /// 获取节点连接的节点
  /// * `s` 反序列化后的堆内存快照
  /// * `adjacent_type` 连接方向
  /// * `filter_edge` 边过滤函数
  /// * `filter_node` 节点过滤函数
  pub fn get_adjacent_nodes<'a>(
    &self,
    s: &'a SnapshotDeserialized,
    adjacent_type: AdjacentType,
    filter_edge: impl Fn(&'a SnapshotEdge, &AdjacentType) -> bool,
    filter_node: impl Fn(&'a SnapshotNode, &AdjacentType) -> bool,
  ) -> Vec<(&'a SnapshotNode, Vec<&'a SnapshotEdge>)> {
    let adjacent_edges = self
      .get_adjacent_edges(s, adjacent_type, filter_edge)
      .into_iter();

    let mut node_map: HashMap<SnapshotNodeIdx, HashSet<SnapshotEdgeIdx>> = HashMap::new();

    for edge in adjacent_edges {
      for ref_node in edge.get_adjacent_nodes(s, adjacent_type, &filter_node) {
        if !node_map.contains_key(&ref_node.node_idx) {
          node_map.insert(ref_node.node_idx, HashSet::from([edge.edge_index]));
        } else {
          node_map
            .get_mut(&ref_node.node_idx)
            .unwrap()
            .insert(edge.edge_index);
        }
      }
    }

    node_map
      .iter()
      .map(|(node_idx, edge_idxs)| {
        (
          s.nodes.get(*node_idx as usize).unwrap(),
          edge_idxs
            .iter()
            .map(|edge_idx| s.edges.get(*edge_idx as usize).unwrap())
            .collect::<Vec<&SnapshotEdge>>(),
        )
      })
      .collect()
  }
}
