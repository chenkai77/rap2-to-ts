/*
 * @Author: depp.chen
 * @Date: 2022-01-28 11:32:42
 * @Description: 配置文件类型
 */
export interface IConfig {
  // rap2 鉴权cookie
  rapKoaSidSig?: string;
  // rap2 鉴权cookie
  rapKoaSiD?: string;
  // 请求地址
  baseUrl?: string;
  // 输出地址
  outDir?: string;
  // 请求体实例文件路径
  requestFilePath?: string;
  // 返回体属性，有时会封装请求方法，处理统一请求返回泛文，只需返回接口文档中返回格式的某个属性
  responseAttr?: string;
}
