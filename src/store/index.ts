import {
  ExtensionContext,
  TextEditorDecorationType,
  window,
  Range,
  Position,
} from "vscode";
import { IConfig } from "../types/config";

interface State {
  // 扩展程序激活上下文
  context: ExtensionContext | undefined;
  config: IConfig;
}

const state: State = {
  context: undefined,
  config: {},
};

const getter = {};

const mutations = {};

export { state, mutations, getter };
