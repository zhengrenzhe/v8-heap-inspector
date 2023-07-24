import axios from "axios";
import { useRequest } from "ahooks";

import { injectable, useService } from "@/web/utils";
import { GetAllConstructorsReturnValue } from "@/binding";

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
    return this.sendReq<GetAllConstructorsReturnValue>(
      "http://localhost:3000/api/get_nodes_abstract_info_by_constructor_name",
      {
        constructor_name,
      },
    );
  };
}

export function useAPI<
  API_NAME extends keyof APIService,
  API_ARGS extends Parameters<APIService[API_NAME]>,
>(
  cfg: API_ARGS extends []
    ? { apiName: API_NAME }
    : { apiName: API_NAME; apiArgs: API_ARGS },
) {
  const apiService = useService(APIService);

  return useRequest(
    () => {
      // @ts-ignore
      return apiService[cfg.apiName](...(cfg?.apiArgs ?? []));
    },
    {
      cacheKey: cfg.apiName,
      staleTime: Number.MAX_SAFE_INTEGER,
    },
  );
}
