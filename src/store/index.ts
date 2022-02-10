import {
  ExtensionContext,
  TextEditorDecorationType,
  window,
  Range,
  Position,
} from "vscode";

interface State {
  // 扩展程序激活上下文
  context: ExtensionContext | undefined;
}

const state: State = {
  context: undefined,
};

const getter = {};

const mutations = {};

export { state, mutations, getter };
