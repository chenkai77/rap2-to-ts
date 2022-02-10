/*
 * @Author: depp.chen
 * @Date: 2022-01-28 11:08:36
 * @Description: 获取配置
 */
import {
  window,
  StatusBarItem,
  StatusBarAlignment,
  commands,
  workspace,
} from "vscode";
import path from "path";
import { configFileName } from "./publicVariable";
import { IConfig } from "../types/config";
import { returnDefaultConfig } from "./file";
import fs from "fs";

/**
 * @description: 获取工作区
 * @author: depp.chen
 */
export async function getWorkSpacePath() {
  let workspaceFolders = workspace.workspaceFolders;
  if (workspaceFolders) {
    if (workspaceFolders.length === 1) {
      return workspaceFolders[0].uri.fsPath;
    } else {
      const chooseFolder = await window.showWorkspaceFolderPick({
        placeHolder: "请选择工作空间",
      });
      if (chooseFolder) {
        return chooseFolder.uri.fsPath;
      }
    }
  }
  return null;
}

/**
 * @description: 获取配置文件路径
 * @author: depp.chen
 */
export function getConfigPath() {
  if (workspace.workspaceFolders) {
    let configPath = path.join(
      workspace.workspaceFolders[0].uri.fsPath,
      `./${configFileName}`
    );
    return configPath;
  }
  return "";
}

/**
 * @description: 获取配置
 * @author: depp.chen
 */
export function getConfig(): IConfig {
  let configPath = getConfigPath();
  const isExist = fs.existsSync(configPath);
  if (isExist) {
    if (require.cache[configPath]) {
      delete require.cache[configPath];
    }
    const configData: IConfig = require(configPath);
    return configData;
  }
  return {};
}

/**
 * @description: 自动生成默认配置文件
 * @author: depp.chen
 */
export function autoCreateConfigFile() {
  window
    .showErrorMessage(`读取配置文件出错, 是否进行初始化配置文件?`, "是", "否")
    .then((text) => {
      if (text === "是") {
        let configPath = getConfigPath();
        if (configPath) {
          fs.writeFileSync(configPath, returnDefaultConfig());
          window.showInformationMessage("配置初始化成功，请完善配置内容");
        } else {
          window.showInformationMessage("配置初始化失败，请检查项目文件");
        }
      }
    });
}

/**
 * @description: 判断配置文件是否存在
 * @author: depp.chen
 */
export function judgeConfigFile() {
  let configPath = getConfigPath();
  if (configPath) {
    const isExist = fs.existsSync(configPath);
    if (isExist) {
      let config: IConfig = getConfig();
      if (!config.rapKoaSiD || !config.rapKoaSidSig || !config.baseUrl) {
        window.showInformationMessage("请完善rap2配置信息");
        return false;
      }
      if (!config.outDir) {
        window.showInformationMessage("请完善配置文件输出目录");
        return false;
      }
      if (!config.requestFilePath) {
        window.showInformationMessage("请完善请求体实例文件路径");
        return false;
      }
      return true;
    }
  }
  autoCreateConfigFile();
  return false;
}
