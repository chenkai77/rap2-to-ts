/*
 * @Author: depp.chen
 * @Date: 2022-01-28 17:55:50
 * @Description: 选择窗口
 */
import { window } from "vscode";
import { IRapInterface, IModule } from "../types/index";
import { zhEnTranslation } from "../utils/named";
import { rootWriteFile, rootReadFile, rootExistsFile } from "../utils/file";
import { formatJsonCode } from "../utils/prettify";
import { apiJsonFileName } from "../utils/publicVariable";
import { IJsonData } from "../types/index";

export class CreateJson {
  // 当前类的实例
  static currentInstance: CreateJson;
  // 模块数据
  module: IModule;

  /**
   * @description: 构造函数
   * @author: depp.chen
   */
  private constructor(module: IModule) {
    this.module = module;
    this.startCreate();
  }

  /**
   * @description: 開始生成JSON
   * @author: depp.chen
   */
  async startCreate() {
    // 如果文件已存在
    if (rootExistsFile(apiJsonFileName)) {
      window.showInformationMessage(`JSON文件已存在, 正在对比相关数据`);
      await this.noCoverDealWithJSONFile();
      window.showInformationMessage(`JSON更新数据成功`);
    } else {
      window.showInformationMessage(`开始生成JSON文件`);
      await this.createJsonFile();
      window.showInformationMessage(`JSON文件生成成功`);
    }
  }

  /**
   * @description: 根据模块生成JSON数据
   * @author: depp.chen
   */
  async createJsonForModule(interfaces: IRapInterface[]) {
    let children: IJsonData = {};
    for (let i = 0; i < interfaces.length; i++) {
      let item = interfaces[i];
      // 临时命名用英文翻译
      let temporaryVariableName = await zhEnTranslation(item.name);
      children[item.id] = {
        name: item.name,
        url: item.url,
        variableName: temporaryVariableName,
        description: item.description,
      };
    }
    return children;
  }

  /**
   * @description: 根据模块接口列表创建JSON数据
   * @author: depp.chen
   */
  async createModuleData() {
    let moduleVariableName = await zhEnTranslation(this.module.label);
    let childrenJsonData = await this.createJsonForModule(
      this.module.interfaces
    );
    return {
      name: this.module.label,
      variableName: moduleVariableName,
      children: childrenJsonData,
    };
  }

  /**
   * @description: 创建JSON文件
   * @author: depp.chen
   */
  async createJsonFile() {
    let moduleData = await this.createModuleData();
    let jsonData: IJsonData = {
      [this.module.id]: moduleData,
    };
    this.writeJsonFile(jsonData);
  }

  /**
   * @description: JSON对比更新
   * @author: depp.chen
   */
  async noCoverDealWithJSONFile() {
    let fileContent = rootReadFile(apiJsonFileName);
    let jsonData = JSON.parse(fileContent);
    if (!jsonData[this.module.id]) {
      let moduleData = await this.createModuleData();
      jsonData[this.module.id] = moduleData;
    } else {
      let interfaces = this.module.interfaces;
      for (let i = 0; i < interfaces.length; i++) {
        let item = interfaces[i];
        if (!jsonData[this.module.id].children[item.id]) {
          let temporaryVariableName = await zhEnTranslation(item.name);
          jsonData[this.module.id].children[item.id] = {
            name: item.name,
            url: item.url,
            variableName: temporaryVariableName,
            description: item.description,
          };
        }
      }
    }
    this.writeJsonFile(jsonData);
  }

  /**
   * @description: 写入JSON文件
   * @author: depp.chen
   * @param {IJsonData} jsonData
   */
  writeJsonFile(jsonData: IJsonData) {
    let json = JSON.stringify(jsonData);
    const fileData = formatJsonCode(json);
    rootWriteFile(apiJsonFileName, fileData);
  }

  /**
   * @description: 创建接口相关文件
   * @author: depp.chen
   * @param data : 相关数据
   */
  static async initCreate(data: { module: IModule }) {
    const { module } = data;
    CreateJson.currentInstance = new CreateJson(module);
  }
}
