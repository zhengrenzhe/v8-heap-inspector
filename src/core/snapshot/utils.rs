/// filter map 二合一
/// * `items` items to filter
/// * `mapper_filter` mapper filter, return Option
pub fn filter_map<'a, T, S>(
  items: Vec<T>,
  mapper_filter: impl Fn(T) -> Option<&'a S>,
) -> Vec<&'a S> {
  items.into_iter().filter_map(mapper_filter).collect()
}
