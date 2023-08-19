mod common;
mod edge;
mod node;
mod utils;

pub use common::*;
pub use edge::*;
pub use node::*;
pub use utils::*;

use petgraph::{Directed, Graph};

pub struct SnapshotDeserialized {
  pub nodes: Vec<SnapshotNode>,
  pub edges: Vec<SnapshotEdge>,
  pub strings: Vec<String>,
  pub graph: Graph<usize, usize, Directed>,
}
