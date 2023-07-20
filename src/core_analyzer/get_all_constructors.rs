use std::collections::HashMap;

use crate::core::{SnapshotDeserialized, NODE_TYPE_NATIVE, NODE_TYPE_OBJECT};

#[napi(object)]
pub struct ConstructorItemDetailReturnValue {
  pub name: String,
  pub count: i64,
  pub self_size: i64,
}

#[napi(object)]
pub struct GetAllConstructorsReturnValue {
  pub constructors: Vec<ConstructorItemDetailReturnValue>,
  pub count: i64,
}

pub fn get_all_constructors(s: &SnapshotDeserialized) -> GetAllConstructorsReturnValue {
  let mut constructors: HashMap<&String, ConstructorItemDetailReturnValue> = HashMap::new();

  for node in s.nodes.iter() {
    let node_type = node.get_node_type();
    if node_type == NODE_TYPE_OBJECT || node_type == NODE_TYPE_NATIVE {
      if constructors.contains_key(&node.name) {
        let v = constructors.get_mut(&node.name).unwrap();
        v.count += 1;
        v.self_size += node.self_size as i64;
      } else {
        constructors.insert(
          &node.name,
          ConstructorItemDetailReturnValue {
            name: node.name.clone(),
            count: 1,
            self_size: node.self_size as i64,
          },
        );
      }
    }
  }

  let cs = constructors
    .into_iter()
    .map(|(_, v)| v)
    .collect::<Vec<ConstructorItemDetailReturnValue>>();
  let len = cs.len();

  GetAllConstructorsReturnValue {
    constructors: cs,
    count: len as i64,
  }
}
