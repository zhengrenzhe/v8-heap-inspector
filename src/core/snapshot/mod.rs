mod common;
mod edge;
mod node;
mod utils;

pub use common::*;
pub use edge::*;
pub use node::*;
pub use utils::*;

use petgraph::{Directed, Graph};

/// 反序列化后的堆内存快照
pub struct SnapshotDeserialized {
  /// 节点
  pub nodes: Vec<SnapshotNode>,
  /// 边
  pub edges: Vec<SnapshotEdge>,
  /// 字符串
  pub strings: Vec<String>,
  /// 图
  pub graph: Graph<usize, usize, Directed>,
}
