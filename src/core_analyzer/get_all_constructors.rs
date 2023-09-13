use std::collections::HashMap;

use crate::core::SnapshotDeserialized;

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

/// 获取堆内存中所有构造器
/// * `s` 反序列化后的堆内存快照
pub fn get_all_constructors(s: &SnapshotDeserialized) -> GetAllConstructorsReturnValue {
  // 构造器列表
  let mut constructors: HashMap<String, ConstructorItemDetailReturnValue> = HashMap::new();

  // 遍历所有节点，统计结果
  for node in s.nodes.iter() {
    let cls = &node.get_node_cls_name(s);
    if constructors.contains_key(cls) {
      let v: &mut ConstructorItemDetailReturnValue = constructors.get_mut(cls).unwrap();
      v.count += 1;
      v.self_size += node.self_size as i64;
    } else {
      constructors.insert(
        cls.to_owned(),
        ConstructorItemDetailReturnValue {
          name: cls.clone(),
          count: 1,
          self_size: node.self_size as i64,
        },
      );
    }
  }

  // 转换为列表
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
