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

export class FooterStatusBar {
  static readonly spannedFileCommand = FooterStatusCommandEnum.spannedFile;

  // 当前类的实例
  static currentInstance: FooterStatusBar;
  // 底部栏实例
  private readonly statusBar: StatusBarItem;

  /**
   * @description: 构造函数
   * @author: depp.chen
   */
  private constructor(statusBar: StatusBarItem) {
    this.statusBar = statusBar;
    this.statusBar.command = FooterStatusBar.spannedFileCommand;
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
    FooterStatusBar.currentInstance = new FooterStatusBar(statusBar);
  }

  /**
   * @description: 注册command
   * @author: depp.chen
   */
  private async registerFooterStatusBar() {
    let isRegister = await commandIsRegister(
      FooterStatusBar.spannedFileCommand
    );
    // 如果已经注册了command Key则不再进行注册
    if (isRegister) {
      return;
    }
    commands.registerCommand(FooterStatusBar.spannedFileCommand, async () => {
      // 先判断配置文件是否存在
      let target = judgeConfigFile();
      if (target) {
        WindowQuickPick.showQuickPick();
      }
    });
  }

  /**
   * @description: 销毁状态栏
   * @author: depp.chen
   */
  public static disposeFMstatusBar() {
    FooterStatusBar.currentInstance?.statusBar?.dispose();
  }
}
