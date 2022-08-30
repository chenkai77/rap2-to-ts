/*
 * @Author: depp.chen
 * @Date: 2021-10-12 14:55:40
 * @Description: 状态栏扩展
 */
import { window, StatusBarItem, StatusBarAlignment, commands } from "vscode";
import { FooterStatusCommandEnum } from "../enums/index";
import { commandIsRegister } from "../utils/command";
import { WindowQuickPick } from "../windowQuickPick";
import { judgeConfigFile } from "../utils/getConfig";
import { rootExistsFile, rootReadFile } from "../utils/file";
import { apiJsonFileName } from "../utils/publicVariable";

export class SpannedFileFooterStatusBar {
  static readonly spannedFileCommand = FooterStatusCommandEnum.spannedFile;

  // 当前类的实例
  static currentInstance: SpannedFileFooterStatusBar;
  // 底部栏实例
  private readonly statusBar: StatusBarItem;

  /**
   * @description: 构造函数
   * @author: depp.chen
   */
  private constructor(statusBar: StatusBarItem) {
    this.statusBar = statusBar;
    this.statusBar.command = SpannedFileFooterStatusBar.spannedFileCommand;
    this.statusBar.text = `$(notebook-template) rap2ts`;
    this.registerFooterStatusBar();
    this.statusBar.show();
  }

  /**
   * @description: 初始化按钮
   * @author: depp.chen
   */
  static async initFooterStatusBar() {
    let statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
    SpannedFileFooterStatusBar.currentInstance = new SpannedFileFooterStatusBar(
      statusBar
    );
  }

  /**
   * @description: 注册command
   * @author: depp.chen
   */
  private async registerFooterStatusBar() {
    let isRegister = await commandIsRegister(
      SpannedFileFooterStatusBar.spannedFileCommand
    );
    // 如果已经注册了command Key则不再进行注册
    if (isRegister) {
      return;
    }
    commands.registerCommand(
      SpannedFileFooterStatusBar.spannedFileCommand,
      async () => {
        // 再判断配置文件是否存在
        let target = judgeConfigFile();
        if (target) {
          // 先判断JSON文件是否存在
          if (rootExistsFile(apiJsonFileName)) {
            WindowQuickPick.showQuickPickToCreateFile();
          } else {
            let target = await window.showInformationMessage(
              "提示",
              {
                modal: true,
                detail: "未找到对应JSON文件，是否先生成JSON文件？",
              },
              "生成JSON文件"
            );
            if (target === "生成JSON文件") {
              WindowQuickPick.showQuickPick();
            }
          }
        }
      }
    );
  }

  /**
   * @description: 销毁状态栏
   * @author: depp.chen
   */
  public static disposeFMstatusBar() {
    SpannedFileFooterStatusBar.currentInstance?.statusBar?.dispose();
  }
}
