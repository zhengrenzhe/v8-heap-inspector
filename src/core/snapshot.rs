use super::{
  EDGE_TYPES, NODE_TYPES, NODE_TYPE_CODE, NODE_TYPE_HIDDEN, NODE_TYPE_NATIVE, NODE_TYPE_OBJECT,
};
use petgraph::graph::NodeIndex;
use petgraph::{Directed, Graph};

pub struct SnapshotNode {
  /// node index in the snapshot.nodes fields
  pub node_idx: u64,
  /// node type index
  pub node_type_index: usize,
  /// node name field
  pub name: String,
  /// unique node id in v8 snapshot
  pub id: u64,
  /// node self size
  pub self_size: u64,
  /// node edge count
  pub edge_count: u64,
  pub trace_node_id: u64,
  pub detachedness: u64,
  /// from edge index list
  pub from_edge_index: Vec<u64>,
  /// to edge index list
  pub to_edge_index: Vec<u64>,
  /// graph node index
  pub graph_node: NodeIndex,
}

impl SnapshotNode {
  pub fn get_node_type(&self) -> &str {
    NODE_TYPES[self.node_type_index]
  }

  pub fn get_node_cls_name(&self) -> String {
    let node_type = self.get_node_type();

    if node_type == NODE_TYPE_HIDDEN {
      return "(system)".to_string();
    }

    if node_type == NODE_TYPE_NATIVE || node_type == NODE_TYPE_OBJECT {
      return self.name.to_string();
    }

    if node_type == NODE_TYPE_CODE {
      return "(compiled code)".to_string();
    }

    vec!["(", node_type, ")"].join("")
  }
}

pub struct SnapshotEdge {
  /// edge index in the snapshot.edges fields
  pub edge_index: u64,
  /// edge type index
  pub edge_type_index: usize,
  /// edge name or index raw value
  pub name_or_index_raw: u64,
  /// to node index in the snapshot.nodes fields
  pub to_node_index: u64,
  /// to node id
  pub to_node_id: u64,
  /// from node index in the snapshot.nodes fields
  pub from_node_index: u64,
  /// from node id
  pub from_node_id: u64,
}

impl SnapshotEdge {
  pub fn get_edge_type(&self) -> &'static str {
    EDGE_TYPES[self.edge_type_index]
  }
}

pub struct SnapshotDeserialized {
  pub nodes: Vec<SnapshotNode>,
  pub edges: Vec<SnapshotEdge>,
  pub graph: Graph<usize, usize, Directed>,
}
