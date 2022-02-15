/*
 * @Author: depp.chen
 * @Date: 2022-01-28 17:55:50
 * @Description: 选择窗口
 */
import { window } from "vscode";
import {
  getAllOrganizationList,
  getAllRepositoryList,
  getRepository,
} from "../apis";
import { IQuickMenu, IModule } from "../types/index";
import { CreateFile } from "../createFile";

export class WindowQuickPick {
  // 当前类的实例
  static currentInstance: WindowQuickPick;

  /**
   * @description: 构造函数
   * @author: depp.chen
   */
  private constructor() {}

  /**
   * @description: 获取团队菜单
   * @author: depp.chen
   */
  static getOrganizationMenu() {
    return getAllOrganizationList().then((res) => {
      const list = res.data.map((item: any) => {
        return {
          label: item.name,
          id: item.id,
        };
      });
      return list;
    });
  }

  /**
   * @description: 获取仓库列表
   * @author: depp.chen
   */
  static getRepositoryMenu(organizationId: number) {
    return getAllRepositoryList({
      organization: organizationId,
      cursor: 1,
      limit: 100,
    }).then((res) => {
      const list = res.data.map((item: any) => {
        return {
          label: item.name,
          id: item.id,
        };
      });
      return list;
    });
  }

  /**
   * @description: 获取仓库列表
   * @author: depp.chen
   */
  static getRepositoryModule(repositoryId: number) {
    return getRepository(repositoryId).then((res) => {
      const list = res.data.modules.map((item: any) => {
        return {
          label: item.name,
          id: item.id,
          interfaces: item.interfaces,
        };
      });
      return list;
    });
  }

  /**
   * @description: 新开选择窗口
   * @author: depp.chen
   */
  static async showQuickPick() {
    let organization = await WindowQuickPick.getOrganizationMenu();
    let organizationRes;
    if (organization && organization.length === 1) {
      organizationRes = organization[0];
    } else {
      organizationRes = await window.showQuickPick<IQuickMenu>(organization, {
        placeHolder: "请选择团队",
      });
    }
    if (organizationRes) {
      let repository = await WindowQuickPick.getRepositoryMenu(
        organizationRes.id
      );
      let repositoryRes = await window.showQuickPick<IQuickMenu>(repository, {
        placeHolder: "请选择仓库",
      });
      if (repositoryRes) {
        let modules = await WindowQuickPick.getRepositoryModule(
          repositoryRes.id
        );
        let modulesRes = await window.showQuickPick<IModule>(modules, {
          placeHolder: "请选择模块",
        });
        if (modulesRes) {
          CreateFile.initCreate({
            repository: repositoryRes,
            module: modulesRes,
          });
        }
      }
    }
  }
}
