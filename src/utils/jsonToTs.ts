/*
 * @Author: depp.chen
 * @Date: 2022-01-24 11:02:04
 * @Description: json转ts
 */
import { compile } from "json-schema-to-typescript";

// json schema生成声明文件
export function jsonSchemaToDts(
  jsonSchema: any,
  name: string
): Promise<string> {
  // 防止导出的对象重名，对子对象进行重命名
  // recursionRename(jsonSchema.properties, name)
  return new Promise((resolve, reject) => {
    jsonSchema.title = name;
    compile(jsonSchema, name, {
      unknownAny: false, // 尽可能使用unknown代替any
      bannerComment: "", // 在每个生成的文件顶部附加免责声明
      ignoreMinAndMaxItems: true, // 忽略数组类型的maxItems和minItems，避免生成元组
      unreachableDefinitions: true, // 为没有被模式引用的定义生成代码
    })
      .then((dts) => {
        resolve(dts);
      })
      .catch((err) => {
        reject(`json schema转声明文件失败：${err.toString()}`);
      });
  });
}
