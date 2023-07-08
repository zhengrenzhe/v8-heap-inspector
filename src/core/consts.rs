#[napi]
pub const NODE_TYPES: [&str; 15] = [
  "hidden",
  "array",
  "string",
  "object",
  "code",
  "closure",
  "regexp",
  "number",
  "native",
  "synthetic",
  "concatenated string",
  "sliced string",
  "symbol",
  "bigint",
  "object shape",
];

#[napi]
pub const NODE_TYPES_LENGTH: i32 = NODE_TYPES.len() as i32;

#[napi]
pub const EDGE_TYPES: [&str; 7] = [
  "context", "element", "property", "internal", "hidden", "shortcut", "weak",
];

#[napi]
pub const NODE_FIELDS: [&str; 7] = [
  "type",
  "name",
  "id",
  "self_size",
  "edge_count",
  "trace_node_id",
  "detachedness",
];

#[napi]
pub const EDGE_FIELDS: [&str; 3] = ["type", "name_or_index", "to_node"];
