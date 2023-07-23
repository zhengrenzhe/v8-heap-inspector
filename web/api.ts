export const API_get_all_constructors =
  "http://localhost:3000/api/get_all_constructors";

export function API_get_nodes_abstract_info_by_constructor_name(
  constructor_name: string,
) {
  return `http://localhost:3000/api/get_nodes_abstract_info_by_constructor_name?constructor_name=${constructor_name}`;
}
