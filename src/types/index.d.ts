/*
 * @Author: depp.chen
 * @Date: 2022-02-08 13:45:43
 * @Description: 接口数据格式
 */

export interface IRapInterface {
  id: number;
  name: string;
  url: string;
  description: string;
}

export interface IQuickMenu {
  id: number;
  label: string;
}

export interface IModule {
  id: number;
  label: string;
  variableName?: string;
  interfaces: IRapInterface[];
}

export interface IProperties {
  name: string;
  type: string;
  items?: IProperties[];
  properties?: IProperties[];
  [k: string]: any;
}

export interface IJsonDataItem {
  name: string;
  variableName: string;
  description?: string;
  url?: string;
  children?: IJsonData;
}
export interface IJsonData {
  [k: string | number]: IJsonDataItem;
}

export type ModuleInterface = IRapInterface & { variableName: string };

export type ModuleType = IModule & {
  variableName: string;
  interfaces: ModuleInterface[];
};
