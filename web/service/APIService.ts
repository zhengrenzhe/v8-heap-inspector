import axios from "axios";

import { injectable } from "@/web/utils";
import {
  GetAllConstructorsReturnValue,
  NodeAbstractInfoReturnValue,
} from "@/binding";

@injectable()
export class APIService {
  private sendReq = async <T>(url: string, params = {}) => {
    const res = await axios.get<T>(url, {
      params,
    });
    return res.data;
  };

  public getAllConstructors = async () => {
    return this.sendReq<GetAllConstructorsReturnValue>(
      "http://localhost:3000/api/get_all_constructors",
    );
  };

  public getNodesAbstractInfoByConstructorName = async (
    constructor_name: string,
  ) => {
    return this.sendReq<NodeAbstractInfoReturnValue[]>(
      "http://localhost:3000/api/get_nodes_abstract_info_by_constructor_name",
      {
        constructor_name,
      },
    );
  };
}
