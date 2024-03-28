import { WebUtil } from './utils/web-utils';

export class BaseClass {
  protected wu: WebUtil;

  constructor(wu: WebUtil) {
    this.wu = wu;
  }
}
