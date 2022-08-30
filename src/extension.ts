import { ExtensionContext } from "vscode";
import { state } from "./store/index";
import { SpannedFileFooterStatusBar } from "./footerStatusBar/spannedFile";
import { SpannedJsonFooterStatusBar } from "./footerStatusBar/spannedJson";

// 激活
export function activate(context: ExtensionContext) {
  // 将上下文储存至store
  state.context = context;
  // 初始化底部按钮
  SpannedJsonFooterStatusBar.initFooterStatusBar();
  SpannedFileFooterStatusBar.initFooterStatusBar();
}
// 销毁
export function deactivate() {
  SpannedFileFooterStatusBar.disposeFMstatusBar();
  SpannedJsonFooterStatusBar.disposeFMstatusBar();
}
