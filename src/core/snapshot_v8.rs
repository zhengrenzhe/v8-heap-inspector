use serde::Deserialize;

#[derive(Deserialize)]
pub struct SnapshotSummaryRaw {
  pub edge_count: u64,
  pub node_count: u64,
}

#[derive(Deserialize)]
pub struct SnapshotFileRaw {
  pub snapshot: SnapshotSummaryRaw,
  pub nodes: Vec<u64>,
  pub edges: Vec<u64>,
  pub strings: Vec<String>,
}
