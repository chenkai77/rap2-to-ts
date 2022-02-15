/*
 * @Author: depp.chen
 * @Date: 2022-01-25 17:16:05
 * @Description: apis
 */
import request from "../utils/request";
import { getConfig } from "../utils/getConfig";

// 获取团队列表
export function getAllOrganizationList(): Promise<any> {
  return request.get(getConfig().baseUrl + "/organization/joined", {
    headers: {
      cookie: `koa.sid=${getConfig().rapKoaSiD}; koa.sid.sig=${
        getConfig().rapKoaSidSig
      }`,
    },
  });
}

// 获取仓库列表
export function getAllRepositoryList(params: {
  organization?: number;
  cursor?: number;
  limit?: number;
}): Promise<any> {
  return request.get(getConfig().baseUrl + "/repository/list", {
    params,
    headers: {
      cookie: `koa.sid=${getConfig().rapKoaSiD}; koa.sid.sig=${
        getConfig().rapKoaSidSig
      }`,
    },
  });
}

// 获取仓库详情
export function getRepository(repositoryId: number): Promise<any> {
  return request.get(getConfig().baseUrl + "/repository/get", {
    params: {
      id: repositoryId,
      excludeProperty: true,
    },
    headers: {
      cookie: `koa.sid=${getConfig().rapKoaSiD}; koa.sid.sig=${
        getConfig().rapKoaSidSig
      }`,
    },
  });
}

// 获取具体接口数据
export function getApiInfo(params: { id: number }): Promise<any> {
  return request.get(getConfig().baseUrl + "/interface/get", {
    params,
    headers: {
      cookie: `koa.sid=${getConfig().rapKoaSiD}; koa.sid.sig=${
        getConfig().rapKoaSidSig
      }`,
    },
  });
}

// 获取具体接口json模板
export function getApiJsonSchema(params: {
  id: number;
  scope: "response" | "request";
}): Promise<any> {
  return request.get(
    getConfig().baseUrl + `/app/mock/schema/${params.id}?scope=${params.scope}`,
    {
      headers: {
        cookie: `koa.sid=${getConfig().rapKoaSiD}; koa.sid.sig=${
          getConfig().rapKoaSidSig
        }`,
      },
    }
  );
}

// 有道翻译
export function youDaoZhEnTranslation(text: string): Promise<any> {
  return request.get(
    `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(
      text
    )}`,
    {
      headers: {
        cookie: `koa.sid=${getConfig().rapKoaSiD}; koa.sid.sig=${
          getConfig().rapKoaSidSig
        }`,
      },
    }
  );
}
