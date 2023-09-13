use serde::Deserialize;

// 原始堆内存快照 snapshot schema
#[derive(Deserialize)]
pub struct SnapshotSummaryRaw {
  pub edge_count: u64,
  pub node_count: u64,
}

// 原始堆内存快照文件 schema
#[derive(Deserialize)]
pub struct SnapshotFileRaw {
  pub snapshot: SnapshotSummaryRaw,
  pub nodes: Vec<u64>,
  pub edges: Vec<u64>,
  pub strings: Vec<String>,
}
