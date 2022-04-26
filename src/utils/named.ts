/*
 * @Author: depp.chen
 * @Date: 2022-02-08 14:01:26
 * @Description: 命名
 */

import { youDaoZhEnTranslation } from "../apis/index";

/**
 * @description 英文转小写
 * @author depp.chen
 */
export function textToLocaleLowerCase(text: string): string {
  return text.toLocaleLowerCase();
}

/**
 * @description 转驼峰
 * @author depp.chen
 * @param isBigHump : 是否大驼峰
 */
export function textToHump(name: string, isBigHump = false): string {
  let hump = name.replace(/[_|\-|\s](\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
  hump =
    (isBigHump
      ? hump.charAt(0).toLocaleUpperCase()
      : hump.charAt(0).toLocaleLowerCase()) + hump.slice(1);
  return hump;
}

/**
 * @description: 去掉所有非中文字符
 * @author: depp.chen
 * @param {string} text 文本
 */
export function removeSymbol(text: string) {
  return text.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, "");
}

/**
 * @description: 翻译 中 ——> 英
 * @author: depp.chen
 * @param {string} text 翻译的文本
 */
export function zhEnTranslation(text: string) {
  let conversionText = removeSymbol(text);
  return youDaoZhEnTranslation(conversionText)
    .then((res) => {
      let text = res.translateResult[0][0].tgt;
      text = text.replace(/(The)|(That)|(To)/g, ""); // 去掉单词 The，That，To
      return textToHump(text);
    })
    .catch(() => {
      throw new Error("有道翻译接口请求失败");
    });
}
