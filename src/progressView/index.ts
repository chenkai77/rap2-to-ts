/*
 * @Author: depp.chen
 * @Date: 2021-10-12 14:55:40
 * @Description: 状态栏扩展
 */
import { window, ProgressLocation, Progress } from "vscode";
import { FooterStatusCommandEnum } from "../enums/index";

export class ProgressView {
  static readonly spannedFileCommand = FooterStatusCommandEnum.spannedFile;

  // 当前类的实例
  static currentInstance: ProgressView;
  // 底部栏实例
  static progressTask: Progress<{ increment: number; message: string }>;
  // window.withProgress promise Resolve回调
  static withProgressResolve: (value?: unknown) => void;

  /**
   * @description: 构造函数
   * @author: depp.chen
   */
  constructor() {}

  /**
   * @description: 初始化进度条
   * @author: depp.chen
   */
  static initProgress(title: string) {
    let windowWithProgress = window.withProgress(
      {
        location: ProgressLocation.Notification,
        title,
      },
      (progress) => {
        ProgressView.progressTask = progress;
        return new Promise((res) => {
          ProgressView.withProgressResolve = res;
        });
      }
    );
    ProgressView.currentInstance = new ProgressView();
    return ProgressView.currentInstance;
  }

  /**
   * @description: 更新进度
   * @author: depp.chen
   */
  report(increment: number, message: string) {
    ProgressView.progressTask.report({
      increment,
      message,
    });
  }

  /**
   * @description: 关闭进度条
   * @author: depp.chen
   */
  close() {
    ProgressView.withProgressResolve();
  }
}
