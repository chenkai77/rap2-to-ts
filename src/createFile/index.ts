/*
 * @Author: depp.chen
 * @Date: 2022-01-28 17:55:50
 * @Description: 选择窗口
 */
import { window } from "vscode";
import { getApiJsonSchema, getApiInfo } from "../apis";
import {
  IRapInterface,
  IQuickMenu,
  IModule,
  IProperties,
} from "../types/index";
import { zhEnTranslation, textToHump } from "../utils/named";
import {
  fsCreateDir,
  writeFile,
  readFile,
  returnDtsTemplates,
  returnDtsContentTemplates,
  returnApiItemTemplates,
  existsFile,
} from "../utils/file";
import { jsonSchemaToDts } from "../utils/jsonToTs";
import { formatCode } from "../utils/prettify";
import {
  requestFunName,
  wrapperDirName,
  requestEndTag,
  responseEndTag,
} from "../utils/publicVariable";
import { getConfig } from "../utils/getConfig";
import { ProgressView } from "../progressView/index";
import { IConfig } from "../types/config";

export class CreateFile {
  // 当前类的实例
  static currentInstance: CreateFile;
  // 仓库数据
  repository: IQuickMenu;
  // 模块数据
  module: IModule;
  // 模块英文名
  moduleName: string;
  // 文件夹名称
  dirName: string;
  // 进度条
  progress: ProgressView;
  // 上次进度
  lastIncrement: number;
  // 上次进度
  config: IConfig;

  /**
   * @description: 构造函数
   * @author: depp.chen
   */
  private constructor(repository: IQuickMenu, module: IModule) {
    this.repository = repository;
    this.module = module;
    this.dirName = "";
    this.moduleName = "";
    this.lastIncrement = 0;
    this.progress = { report: () => {}, close: () => {} };
    this.config = getConfig();
    this.startCreate();
  }

  async startCreate() {
    this.moduleName = await zhEnTranslation(this.module.label);
    this.dirName = `${wrapperDirName}/${this.moduleName}`;
    // 如果文件已存在
    if (
      existsFile(`${this.dirName}/index.d.ts`) &&
      (existsFile(`${this.dirName}/index.ts`) || this.config.onlyTypeFile)
    ) {
      this.progress = ProgressView.initProgress(
        `${this.repository.label}——${this.module.label}文件已存在, 正在对比新增相关接口数据`
      );
      await this.noCoverDealWithTypeFile();
      if (!this.config.onlyTypeFile) {
        await this.noCoverDealWithApiFile();
      }
      this.progress.close();
    } else {
      this.progress = ProgressView.initProgress(
        `正在生成 ${this.repository.label}——${this.module.label} 相关接口数据`
      );
      fsCreateDir(this.dirName);
      await this.createDeclareTypeFile();
      if (!this.config.onlyTypeFile) {
        await this.createApiFile();
      }
      this.progress.close();
    }
  }

  /**
   * @description: 更新进度条, 进度分三块（请求声明代码，响应声明代码，请求Api代码，前两块分33%，最后一块分34%）
   * @author: depp.chen
   * @param current : 当前进度
   * @param total : 总长度
   */
  progressReport(
    current: number,
    total: number,
    scope: "request" | "response" | "api"
  ) {
    let requestProportion: number;
    let responseProportion: number;
    if (this.config.onlyTypeFile) {
      requestProportion = 50;
      responseProportion = 50;
    } else {
      requestProportion = 33;
      responseProportion = 33;
    }
    let increment = 0;
    if (scope === "request") {
      increment = parseInt(((current / total) * requestProportion).toFixed(0));
    } else if (scope === "response") {
      increment =
        requestProportion +
        parseInt(((current / total) * responseProportion).toFixed(0));
    } else if (scope === "api") {
      increment = 66 + parseInt(((current / total) * 34).toFixed(0));
    }
    this.progress.report(increment - this.lastIncrement, increment + "%");
    this.lastIncrement = increment;
  }

  /**
   * @description: 获取接口类型文件命名空间命名
   * @author: depp.chen
   */
  getBigHumpIName(name: string) {
    let bigHump = textToHump(name, true);
    return "I" + bigHump;
  }

  /**
   * @description: 声明文件拆分为 Request 和 Response 两块
   * @author: depp.chen
   */
  breakUpDeclarationFile(fileData: string) {
    const requestReg = new RegExp(`\\s*namespace\\s*Request\\s*{`);
    const responseReg = new RegExp(`\\s*namespace\\s*Response\\s*{`);
    let requestRegIndex = fileData.search(requestReg);
    let responseRegIndex = fileData.search(responseReg);
    if (requestRegIndex !== -1 && responseRegIndex !== -1) {
      return {
        requestText: fileData.slice(requestRegIndex, responseRegIndex),
        responseText: fileData.slice(responseRegIndex),
      };
    }
    return null;
  }

  /**
   * @description: 转为大驼峰
   * @author: depp.chen
   */
  getInterfaceName(name: string) {
    return textToHump(name, true);
  }

  /**
   * @description: 获取接口具体数据中对应name的数据
   * @author: depp.chen
   */
  getArrayTarget(data: any[], name: string) {
    if (data && data.length && name) {
      let target = data.find((e) => e.name === name);
      // 删除id, 避免 jsonSchemaToDts 报错
      delete target.id;
      return target || {};
    } else {
      return {};
    }
  }

  /**
   * @description: 获取接口具体数据中必填数据
   * @author: depp.chen
   */
  getApiRequiredArr(data: any[]) {
    if (data && data.length) {
      let requiredArr = data.filter((e) => e.required);
      return requiredArr.map((e) => e.name);
    } else {
      return [];
    }
  }

  /**
   * @description: 类型声明文件数组形式转对象，便于ts转换
   * @author: depp.chen
   */
  propertiesConversion(
    data: IProperties,
    apiProperties: any[],
    // scope?: "request" | "response"
    tsTypeName: string
  ) {
    if (data.properties && data.properties.length) {
      let propertiesObj = Object.create(null);
      data.properties.forEach((e) => {
        let propertyTarget = this.getArrayTarget(apiProperties, e.name);
        // 排除请求头header的参数
        if (propertyTarget.pos === 1) {
          return;
        }
        propertiesObj[e.name] = {
          ...propertyTarget,
          ...e,
        };
        let idName = tsTypeName + this.getInterfaceName(e.name);
        if (e.properties && e.properties.length) {
          propertiesObj[e.name].id = idName;
          this.propertiesConversion(
            propertiesObj[e.name],
            propertyTarget.children,
            idName
          );
        }
        if (e.items && e.items.length) {
          propertiesObj[e.name].items.forEach((item: IProperties) => {
            this.propertiesConversion(item, propertyTarget.children, idName);
          });
          (propertiesObj[e.name].items as unknown) =
            propertiesObj[e.name].items[0];
          propertiesObj[e.name].items.id = idName;
        }
      });
      data.properties = propertiesObj;
      // 避免生成ts interface 可索引的类型
      data.additionalProperties = false;
      data.required = this.getApiRequiredArr(apiProperties);
      // if (scope === "response") {
      //   let responseAttr = this.config.responseAttr;
      //   if (responseAttr) {
      //     data.required.push(responseAttr);
      //   }
      // }
    }
    return data;
  }

  /**
   * @description: 根据模块生成接口类型声明代码
   * @author: depp.chen
   */
  async createTypeForModule(
    interfaces: IRapInterface[],
    scope: "request" | "response"
  ) {
    let allApiTypeData = "";
    for (let i = 0; i < interfaces.length; i++) {
      let item = interfaces[i];
      const apiInfo = await getApiInfo({ id: item.id }).then((res) => {
        return res.data;
      });
      await getApiJsonSchema({ id: item.id, scope }).then(async (res) => {
        let propertiesData =
          scope === "request"
            ? apiInfo.requestProperties
            : apiInfo.responseProperties;
        let tsTypeName = await zhEnTranslation(item.name);
        tsTypeName = this.getInterfaceName(tsTypeName);
        let resConversion = JSON.parse(
          JSON.stringify(
            this.propertiesConversion(res, propertiesData, tsTypeName)
          )
        );
        let tsTypeData = await jsonSchemaToDts(resConversion, tsTypeName);
        allApiTypeData += tsTypeData + "\r\n";
      });
      // 更新进度
      if (scope === "request") {
        this.progressReport(i + 1, interfaces.length, "request");
      } else {
        this.progressReport(i + 1, interfaces.length, "response");
      }
    }
    let endTag = scope === "request" ? requestEndTag : responseEndTag;
    return allApiTypeData + "\r\n" + endTag;
  }

  /**
   * @description: 创建接口类型声明文件
   * @author: depp.chen
   */
  async createDeclareTypeFile() {
    const requestApiTypeData = await this.createTypeForModule(
      this.module.interfaces,
      "request"
    );
    const responseApiTypeData = await this.createTypeForModule(
      this.module.interfaces,
      "response"
    );
    let dtsContentText = returnDtsContentTemplates();
    dtsContentText = dtsContentText.replace(
      "@{RequestData}",
      requestApiTypeData
    );
    dtsContentText = dtsContentText.replace(
      "@{ResponseData}",
      responseApiTypeData
    );
    let dtsText = returnDtsTemplates();
    let bigHumpModuleName = this.getBigHumpIName(this.moduleName);
    dtsText = dtsText.replace("@{DtsName}", bigHumpModuleName);
    dtsText = dtsText.replace("@{DtsContent}", dtsContentText);
    writeFile(`${this.dirName}/index.d.ts`, formatCode(dtsText));
  }

  /**
   * @description: 不覆盖已存在的接口声明文件处理
   * @author: depp.chen
   */
  async noCoverDealWithTypeFile() {
    let fileContent = readFile(`${this.dirName}/index.d.ts`);
    let breakUpDeclarationFile = this.breakUpDeclarationFile(fileContent);
    if (breakUpDeclarationFile) {
      let { requestText, responseText } = breakUpDeclarationFile;
      let requestNewAddInterfaces = [];
      let responseNewAddInterfaces = [];
      for (let i = 0; i < this.module.interfaces.length; i++) {
        const item = this.module.interfaces[i];
        let tsTypeName = await zhEnTranslation(item.name);
        const requestReg = new RegExp(
          `\\s*export\\s*(interface|type)\\s*${this.getInterfaceName(
            tsTypeName
          )}\\s*{[\\s\\S]*}`
        );
        const responseReg = new RegExp(
          `\\s*export\\s*(interface|type)\\s*${this.getInterfaceName(
            tsTypeName
          )}\\s*{[\\s\\S]*}`
        );
        if (requestText.search(requestReg) === -1) {
          requestNewAddInterfaces.push(item);
        }
        if (responseText.search(responseReg) === -1) {
          responseNewAddInterfaces.push(item);
        }
      }
      const requestApiTypeData = await this.createTypeForModule(
        requestNewAddInterfaces,
        "request"
      );
      const responseApiTypeData = await this.createTypeForModule(
        responseNewAddInterfaces,
        "response"
      );
      fileContent = fileContent.replace(requestEndTag, requestApiTypeData);
      fileContent = fileContent.replace(responseEndTag, responseApiTypeData);
      writeFile(`${this.dirName}/index.d.ts`, formatCode(fileContent));
    } else {
      window.showInformationMessage(
        `${this.module.label}声明文件不规范,已重新生成`
      );
      await this.createDeclareTypeFile();
    }
  }

  /**
   * @description: 根据模块生成接口代码
   * @author: depp.chen
   */
  async createApiForModule(interfaces: IRapInterface[]) {
    let allApiData = "";
    for (let i = 0; i < interfaces.length; i++) {
      let item = interfaces[i];
      const apiInfo = await getApiInfo({ id: item.id }).then((res) => {
        return res.data;
      });
      let bigHumpModuleName = this.getBigHumpIName(this.moduleName);
      let tsTypeName = await zhEnTranslation(item.name);
      let bigHumpTsTypeName = this.getInterfaceName(tsTypeName);
      let apiItemTemplates = returnApiItemTemplates();
      let method = apiInfo.method.toLocaleLowerCase(); // 请求方法
      let bodyQueryArr = apiInfo.requestProperties.filter(
        (e: { pos: number }) => e.pos !== 1
      );
      if (bodyQueryArr.length) {
        let isOptional = bodyQueryArr.every(
          (e: { required: boolean }) => !e.required
        );
        let dataQuery =
          "data" +
          (isOptional ? "?:" : ":") +
          `${bigHumpModuleName}.Request.${bigHumpTsTypeName}`;
        apiItemTemplates = apiItemTemplates.replace("@{DataQuery}", dataQuery);
        let queryParam = ["put", "post", "patch"].includes(method)
          ? "data"
          : "params:data";
        apiItemTemplates = apiItemTemplates.replace(
          "@{QueryParam}",
          queryParam
        );
      } else {
        apiItemTemplates = apiItemTemplates.replace("@{DataQuery}", "");
        apiItemTemplates = apiItemTemplates.replace("@{QueryParam}", "");
      }
      apiItemTemplates = apiItemTemplates.replace("@{Name}", apiInfo.name);
      apiItemTemplates = apiItemTemplates.replace(
        "@{Description}",
        apiInfo.description
      );
      apiItemTemplates = apiItemTemplates.replace(
        "@{InterfaceName}",
        tsTypeName
      );
      let responseType = `${bigHumpModuleName}.Response.${bigHumpTsTypeName}`;
      let responseAttr = this.config.responseAttr;
      if (responseAttr) {
        // 判断一层属性存不存在
        let target = apiInfo.responseProperties.find(
          (e: { name: string }) => e.name === responseAttr
        );
        if (target) {
          responseType += this.getInterfaceName(responseAttr);
          if (target.type === "Array") {
            responseType += "[]";
          }
        } else {
          responseType = "any"; // 不存在该类型，则视为 any
        }
      }
      apiItemTemplates = apiItemTemplates.replace(
        "@{ResponseType}",
        responseType
      );
      apiItemTemplates = apiItemTemplates.replace(
        "@{RequestKeyword}",
        requestFunName
      );
      apiItemTemplates = apiItemTemplates.replace(
        "@{InterfaceUrl}",
        apiInfo.url
      );
      apiItemTemplates = apiItemTemplates.replace("@{InterfaceMethod}", method);
      allApiData += apiItemTemplates + "\r\n\r\n\r\n";
      this.progressReport(i + 1, interfaces.length, "api");
    }
    return allApiData;
  }

  /**
   * @description: 生成请求导入代码
   * @author: depp.chen
   */
  getImportRequestCode() {
    let requestFilePath = this.config.requestFilePath;
    return `import ${requestFunName} from "${requestFilePath}"`;
  }

  /**
   * @description: 创建接口文件
   * @author: depp.chen
   */
  async createApiFile() {
    let apiData = await this.createApiForModule(this.module.interfaces);
    apiData = this.getImportRequestCode() + "\r\n\r\n\r\n" + apiData;
    const fileData = formatCode(apiData);
    writeFile(`${this.dirName}/index.ts`, fileData);
  }

  /**
   * @description: 不覆盖已存在的接口声明文件处理
   * @author: depp.chen
   */
  async noCoverDealWithApiFile() {
    let fileContent = readFile(`${this.dirName}/index.ts`);
    let requestFilePath = this.config.requestFilePath;
    const requestReg = new RegExp(
      `import\\s*request\\s*from\\s*["']{1}${requestFilePath}["']{1}`
    );
    if (fileContent.search(requestReg) === -1) {
      await this.createApiFile();
      return;
    }
    let apiNewAddInterfaces = [];
    for (let i = 0; i < this.module.interfaces.length; i++) {
      const item = this.module.interfaces[i];
      let tsTypeName = await zhEnTranslation(item.name);
      const apiReg = new RegExp(
        `\\s*export\\s*function\\s*${tsTypeName}\\s*\\(`
      );
      if (fileContent.search(apiReg) === -1) {
        apiNewAddInterfaces.push(item);
      }
    }
    let apiData = await this.createApiForModule(apiNewAddInterfaces);
    writeFile(
      `${this.dirName}/index.ts`,
      formatCode(fileContent + "\r\n\r\n" + apiData)
    );
  }

  /**
   * @description: 创建接口相关文件
   * @author: depp.chen
   * @param data : 相关数据
   */
  static async initCreate(data: { repository: IQuickMenu; module: IModule }) {
    const { repository, module } = data;
    CreateFile.currentInstance = new CreateFile(repository, module);
  }
}
