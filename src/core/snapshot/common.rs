#[derive(Clone, Copy)]
/// 相邻方向
pub enum AdjacentType {
  /// 来源方向，例如 A -> B，A 就是 B 的 From 方向
  From,
  /// 目的方向，例如 A -> B，B 就是 A 的 To 方向
  To,
}
