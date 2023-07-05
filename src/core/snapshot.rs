pub struct SnapshotNode {
  pub node_idx: u64,
  pub node_type_index: usize,
  pub name: String,
  pub id: u64,
  pub self_size: u64,
  pub edge_count: u64,
  pub trace_node_id: u64,
  pub detachedness: u64,
  pub from_edge_index: Vec<u64>,
  pub to_edge_index: Vec<u64>,
}

pub struct SnapshotEdge {
  pub edge_index: u64,
  pub edge_type_index: usize,
  pub name_or_index_raw: u64,
  pub to_node_index: u64,
  pub to_node_id: u64,
  pub from_node_index: u64,
  pub from_node_id: u64,
  pub source: u64,
  pub target: u64,
}

pub struct SnapshotDeserialized {
  pub nodes: Vec<SnapshotNode>,
  pub edges: Vec<SnapshotEdge>,
}
