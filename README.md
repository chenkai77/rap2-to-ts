# rap2-to-ts

根据 rap2 接口文档自动生成接口请求文件及对应的 Typescript 类型定义文件的插件。

该插件可以根据 rap2 的接口数据生成 JSON 映射文件（该文件主要用于定义后续自动生成的接口及类型文件的变量命名），然后可以根据对应的 JSON 文件生成接口请求文件及对应的 Typescript 类型定义文件。

# 插件说明

## 配置文件

首先需要定义插件的配置文件

```javascript
module.exports = {
  // rap2 鉴权cookie
  rapKoaSidSig: "",
  // rap2 鉴权cookie
  rapKoaSiD: "",
  // 请求地址
  baseUrl: "",
  // 输出地址
  outDir: "./src/services",
  // 请求体实例文件路径
  requestFilePath: "@/utils/request",
  // 是否只生成接口类型声明文件
  onlyTypeFile: true,
  // 可选项，返回体属性，有时会封装请求方法，处理统一请求返回泛文，只需返回接口文档中返回格式的某个属性
  responseAttr: "",
};
```

## 具体操作

![image-20220426154745736](https://qiniu.img.chenkai.xyz/vscode-plug-in/raptots01.png)

底部栏会生成两个按钮

## 按钮一（rap2Json）

用于生成 JSON 映射文件

点击后如下图所示，可选择想要操作的对应接口仓库，

![image-20220426155413196](https://qiniu.img.chenkai.xyz/vscode-plug-in/raptots02.png)

仓库选择完毕后会继续选择对应模块

![image-20220426155632743](https://qiniu.img.chenkai.xyz/vscode-plug-in/raptots03.png)

模块选择好后会生成对应的类似如下的 JSON 文件

json 数据是以模块或接口的 ID 作为键，具体数据作为其对应 value 值的格式

```json
{
  "7897": {
    "name": "接口示例模块一",
    "variableName": "orderSystem",
    "children": {
      "63937": {
        "name": "接口一",
        "url": "/xxxxxx/xxxxxx/xxxxxx",
        "variableName": "getList",
        "description": "列表请求接口"
      }
    }
  }
}
```

## 按钮二（rap2ts）

点击可以根据上面按钮一生成的 JSON 文件生成选项

![image-20220426165514901](https://qiniu.img.chenkai.xyz/vscode-plug-in/raptots04.png)

选择对应模块选项后就可以生成对应的接口数据

ts 类型示例文件

```typescript
declare namespace IOrderSystem {
  namespace Request {
    /*
     * 获取订单列表 请求类型
     */
    export interface IGetList {
      key: string;
    }
    //勿删: EndTag request:
  }
  namespace Response {
    /*
     * 获取订单列表 响应类型
     */
    export interface IGetList {
      code?: number;
      message?: string;
      id?: string;
      data?: InterfaceAData;
    }
    export interface IGetListData {
      /**
       * 授权码
       */
      code?: string;
    }
    //勿删: EndTag response:
  }
}
```

ts 请求接口数据

```typescript
import request from "@/utils/request";

/*
 * 获取订单列表
 */
export function getList(
  params: IModuleA.Request.IGetList
): Promise<IModuleA.Response.IGetList> {
  return request({
    url: "/xxxxxx/xxxxxx/xxxxxx",
    params,
  });
}
```
