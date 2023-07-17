#[napi]
pub const NODE_TYPE_HIDDEN: &str = "hidden";
#[napi]
pub const NODE_TYPE_ARRAY: &str = "array";
#[napi]
pub const NODE_TYPE_STRING: &str = "string";
#[napi]
pub const NODE_TYPE_OBJECT: &str = "object";
#[napi]
pub const NODE_TYPE_CODE: &str = "code";
#[napi]
pub const NODE_TYPE_CLOSURE: &str = "closure";
#[napi]
pub const NODE_TYPE_REGEXP: &str = "regexp";
#[napi]
pub const NODE_TYPE_NUMBER: &str = "number";
#[napi]
pub const NODE_TYPE_NATIVE: &str = "native";
#[napi]
pub const NODE_TYPE_SYNTHETIC: &str = "synthetic";
#[napi]
pub const NODE_TYPE_CONCATENATED_STRING: &str = "concatenated string";
#[napi]
pub const NODE_TYPE_SLICED_STRING: &str = "sliced string";
#[napi]
pub const NODE_TYPE_SYMBOL: &str = "symbol";
#[napi]
pub const NODE_TYPE_BIGINT: &str = "bigint";
#[napi]
pub const NODE_TYPE_OBJECT_SHAPE: &str = "object shape";

#[napi]
pub const NODE_TYPES: [&str; 15] = [
  NODE_TYPE_HIDDEN,
  NODE_TYPE_ARRAY,
  NODE_TYPE_STRING,
  NODE_TYPE_OBJECT,
  NODE_TYPE_CODE,
  NODE_TYPE_CLOSURE,
  NODE_TYPE_REGEXP,
  NODE_TYPE_NUMBER,
  NODE_TYPE_NATIVE,
  NODE_TYPE_SYNTHETIC,
  NODE_TYPE_CONCATENATED_STRING,
  NODE_TYPE_SLICED_STRING,
  NODE_TYPE_SYMBOL,
  NODE_TYPE_BIGINT,
  NODE_TYPE_OBJECT_SHAPE,
];

#[napi]
pub const EDGE_TYPE_CONTEXT: &str = "context";
#[napi]
pub const EDGE_TYPE_ELEMENT: &str = "element";
#[napi]
pub const EDGE_TYPE_PROPERTY: &str = "property";
#[napi]
pub const EDGE_TYPE_INTERNAL: &str = "internal";
#[napi]
pub const EDGE_TYPE_HIDDEN: &str = "hidden";
#[napi]
pub const EDGE_TYPE_SHORTCUT: &str = "shortcut";
#[napi]
pub const EDGE_TYPE_WEAK: &str = "weak";

#[napi]
pub const EDGE_TYPES: [&str; 7] = [
  EDGE_TYPE_CONTEXT,
  EDGE_TYPE_ELEMENT,
  EDGE_TYPE_PROPERTY,
  EDGE_TYPE_INTERNAL,
  EDGE_TYPE_HIDDEN,
  EDGE_TYPE_SHORTCUT,
  EDGE_TYPE_WEAK,
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
