pub const NODE_TYPES: [&'static str; 15] = [
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

pub const EDGE_TYPES: [&'static str; 7] = [
  "context", "element", "property", "internal", "hidden", "shortcut", "weak",
];

pub const NODE_FIELDS: [&'static str; 7] = [
  "type",
  "name",
  "id",
  "self_size",
  "edge_count",
  "trace_node_id",
  "detachedness",
];

pub const EDGE_FIELDS: [&'static str; 3] = ["type", "name_or_index", "to_node"];
