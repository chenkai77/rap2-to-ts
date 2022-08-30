/*
 * @Author: depp.chen
 * @Date: 2022-01-28 15:50:29
 * @Description: 文件操作
 */
import fs from "fs";
import path from "path";
import { getConfig } from "./getConfig";
import {
  window,
  StatusBarItem,
  StatusBarAlignment,
  commands,
  workspace,
} from "vscode";
import { state } from "../store/index";

/**
 * @description: 获取对应项目文件位置
 * @author: depp.chen
 * @param filePath : 文件路径
 */
export function getFilePath(filePath: string) {
  if (workspace.workspaceFolders) {
    return path.join(workspace.workspaceFolders[0].uri.fsPath, filePath);
  } else {
    return "";
  }
}

/**
 * @description: 根路径写入文件
 * @author: depp.chen
 * @param fileName : 文件名
 * @param fileData : 文件内容
 */
export function rootWriteFile(fileName: string, fileData: string) {
  fs.writeFileSync(getFilePath(fileName), fileData);
}

/**
 * @description: 根路径读取文件
 * @author: depp.chen
 * @param fileName : 文件名
 * @param fileData : 文件内容
 */
export function rootReadFile(fileName: string) {
  return fs.readFileSync(getFilePath(fileName)).toString();
}

/**
 * @description: 判断根路径文件是否存在
 * @author: depp.chen
 * @param fileName : 文件名
 */
export function rootExistsFile(fileName: string) {
  return fs.existsSync(getFilePath(fileName));
}

/**
 * @description: 获取书面文件生成位置
 * @author: depp.chen
 * @param fileName : 文件名
 */
export function getDeclarePath(fileName: string) {
  return getFilePath(`${getConfig().outDir}/${fileName}`);
}

/**
 * @description: 写入文件
 * @author: depp.chen
 * @param fileName : 文件名
 * @param fileData : 文件内容
 */
export function writeFile(fileName: string, fileData: string) {
  fs.writeFileSync(getDeclarePath(fileName), fileData);
}

/**
 * @description: 判断文件是否存在
 * @author: depp.chen
 * @param fileName : 文件名
 */
export function existsFile(fileName: string) {
  return fs.existsSync(getDeclarePath(fileName));
}

/**
 * @description: 读取文件
 * @author: depp.chen
 * @param fileName : 文件名
 */
export function readFile(fileName: string) {
  return fs.readFileSync(getDeclarePath(fileName)).toString();
}

/**
 * @description: 生成文件夹 recursive: true 可以递归创建目录
 * @author: depp.chen
 * @param {string} path : 文件地址
 */
export function fsCreateDir(path: string): void {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(getDeclarePath(path), { recursive: true });
  }
}

/**
 * @description: 返回 dts 模板文件内容
 * @author: depp.chen
 */
export function returnDtsTemplates() {
  const templates = fs
    .readFileSync(
      path.join(state.context!?.extensionPath, "./templates/dts.tpl")
    )
    .toString();
  return templates;
}

/**
 * @description: 返回 dtsContent 模板文件内容
 * @author: depp.chen
 */
export function returnDtsContentTemplates() {
  const templates = fs
    .readFileSync(
      path.join(state.context!?.extensionPath, "./templates/dtsContent.tpl")
    )
    .toString();
  return templates;
}

/**
 * @description: 返回 apiItem 模板文件内容
 * @author: depp.chen
 */
export function returnApiItemTemplates() {
  const templates = fs
    .readFileSync(
      path.join(state.context!?.extensionPath, "./templates/apiItem.tpl")
    )
    .toString();
  return templates;
}

/**
 * @description: 返回默认配置文件内容
 * @author: depp.chen
 */
export function returnDefaultConfig() {
  const templates = fs
    .readFileSync(
      path.join(
        state.context!?.extensionPath,
        "./templates/defaultRapToTs.config.js"
      )
    )
    .toString();
  return templates;
}
