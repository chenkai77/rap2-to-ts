/*
 * @Author: depp.chen
 * @Date: 2022-02-08 13:45:43
 * @Description: 接口数据格式
 */

export interface IRapInterface {
  id: number;
  name: string;
}

export interface IQuickMenu {
  id: number;
  label: string;
}

export interface IModule {
  id: number;
  label: string;
  interfaces: IRapInterface[];
}

export interface IProperties {
  name: string;
  type: string;
  items?: IProperties[];
  properties?: IProperties[];
  [k: string]: any;
}
