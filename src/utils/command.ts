import { commands } from "vscode";

/**
 * @description: 判断command是否已经注册
 * @author: depp.chen
 * @param { string } key : command值
 */
export const commandIsRegister = async (key: string) => {
  const commandList = await commands.getCommands(true);
  return commandList.indexOf(key) > -1;
};
