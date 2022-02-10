import { ExtensionContext } from "vscode";
import { state } from "./store/index";
import { FooterStatusBar } from "./footerStatusBar/index";

// 激活
export function activate(context: ExtensionContext) {
  // 将上下文储存至store
  state.context = context;
  // 初始化底部按钮
  FooterStatusBar.initFooterStatusBar();
}
// 销毁
export function deactivate() {}
