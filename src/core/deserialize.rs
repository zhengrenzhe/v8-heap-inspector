use super::{
  SnapshotDeserialized, SnapshotEdge, SnapshotFileRaw, SnapshotNode, EDGE_FIELDS, NODE_FIELDS,
};

pub fn deserialize(slice: &Vec<u8>) -> SnapshotDeserialized {
  let raw: SnapshotFileRaw = serde_json::from_slice(slice).unwrap();

  let mut nodes: Vec<SnapshotNode> = Vec::with_capacity(raw.snapshot.node_count as usize);
  let mut edges: Vec<SnapshotEdge> = Vec::with_capacity(raw.snapshot.edge_count as usize);

  let all_nodes = &raw.nodes;
  let all_edges = &raw.edges;

  // parse nodes
  for (node_idx, node_base_idx) in (0..all_nodes.len()).step_by(NODE_FIELDS.len()).enumerate() {
    // node type index
    let node_type_index = all_nodes[node_base_idx] as usize;

    // name index
    let name_index = all_nodes[node_base_idx + 1];
    let name = raw.strings[name_index as usize].clone();

    // id
    let id = all_nodes[node_base_idx + 2];

    // self size
    let self_size = all_nodes[node_base_idx + 3];

    // edge count
    let edge_count = all_nodes[node_base_idx + 4];

    // trace node id
    let trace_node_id = all_nodes[node_base_idx + 5];

    // detachedness
    let detachedness = all_nodes[node_base_idx + 6];

    nodes.push(SnapshotNode {
      node_idx: node_idx as u64,
      name,
      node_type_index,
      id,
      self_size,
      edge_count,
      trace_node_id,
      detachedness,
      from_edge_index: Vec::with_capacity(edge_count as usize),
      to_edge_index: Vec::with_capacity(edge_count as usize),
    });
  }

  let mut edge_from_node_idx = 0;
  let mut edge_from_node_acc = 0;

  // parse edges
  for (edge_idx, edge_base_idx) in (0..all_edges.len()).step_by(EDGE_FIELDS.len()).enumerate() {
    // edge base info
    let edge_to_node_idx = all_edges[edge_base_idx + 2] as usize / NODE_FIELDS.len();

    // ignore empty edges node
    while nodes[edge_from_node_idx].edge_count == 0 {
      edge_from_node_idx += 1;
      edge_from_node_acc = 0;
    }

    // from node
    let from_node = &mut nodes[edge_from_node_idx];
    from_node.to_edge_index.push(edge_idx as u64);
    let from_node_id = from_node.id;

    // to node
    let to_node = &mut nodes[edge_to_node_idx];
    to_node.from_edge_index.push(edge_idx as u64);
    let to_node_id = to_node.id;

    edges.push(SnapshotEdge {
      edge_index: edge_idx as u64,
      edge_type_index: all_edges[edge_base_idx] as usize,
      name_or_index_raw: all_edges[edge_base_idx + 1],
      to_node_index: edge_to_node_idx as u64,
      to_node_id,
      from_node_index: edge_from_node_idx as u64,
      from_node_id,
    });

    edge_from_node_acc += 1;

    // reset from node idx if needed
    if edge_from_node_acc >= nodes[edge_from_node_idx].edge_count as usize {
      edge_from_node_idx += 1;
      edge_from_node_acc = 0;
    }
  }

  return SnapshotDeserialized { nodes, edges };
}
