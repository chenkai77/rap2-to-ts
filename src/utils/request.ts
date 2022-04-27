import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { window } from "vscode";
import { getConfig } from "./getConfig";
import { state } from "../store/index";

interface GdAxiosInstance extends AxiosInstance {
  // 重载一下返回
  (config: IAxiosRequestConfig): Promise<any>;
  get(url: string, config?: IAxiosRequestConfig): Promise<any>;
  post(url: string, data?: any, config?: IAxiosRequestConfig): Promise<any>;
}
interface IAxiosRequestConfig extends AxiosRequestConfig {
  showError?: boolean;
}

const axios: GdAxiosInstance = Axios.create({
  timeout: 20000, // 请求超时 20s
});

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config: IAxiosRequestConfig): IAxiosRequestConfig => {
    const configProps = config || {};
    config.headers = {
      ...config.headers,
      cookie: `koa.sid=${state.config.rapKoaSiD}; koa.sid.sig=${state.config.rapKoaSidSig}`,
    };
    return configProps;
  },
  (error) => Promise.reject(error)
);

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {
    const config: IAxiosRequestConfig = response?.config;
    if (
      response.data.errMsg &&
      response.data.isOk === false &&
      config.showError !== false
    ) {
      window.showErrorMessage("rap2接口报错,请检查配置文件参数是否过期");
      return Promise.reject();
    }
    return response.data;
  },
  (error) => {
    window.showErrorMessage("rap2接口报错,请检查配置文件参数是否过期");
    return Promise.reject(error);
  }
);

export default axios;
