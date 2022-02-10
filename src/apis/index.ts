/*
 * @Author: depp.chen
 * @Date: 2022-01-25 17:16:05
 * @Description: apis
 */
import request from "../utils/request";

// 获取团队列表
export function getAllOrganizationList(): Promise<any> {
  return request.get("/organization/joined", {});
}

// 获取仓库列表
export function getAllRepositoryList(params: {
  organization?: number;
  cursor?: number;
  limit?: number;
}): Promise<any> {
  return request.get("/repository/list", {
    params,
  });
}

// 获取仓库详情
export function getRepository(repositoryId: number): Promise<any> {
  return request.get("/repository/get", {
    params: {
      id: repositoryId,
      excludeProperty: true,
    },
  });
}

// 获取具体接口数据
export function getApiInfo(params: { id: number }): Promise<any> {
  return request.get("/interface/get", { params });
}

// 获取具体接口json模板
export function getApiJsonSchema(params: {
  id: number;
  scope: "response" | "request";
}): Promise<any> {
  return request.get(`/app/mock/schema/${params.id}?scope=${params.scope}`);
}

// 有道翻译
export function youDaoZhEnTranslation(text: string): Promise<any> {
  return request.get(
    `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(
      text
    )}`
  );
}