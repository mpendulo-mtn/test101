import { Page, test } from '@playwright/test';
import { LoginPage } from '../pages/login-logout-ui/login-page';
import { WebUtil } from '../common/utils/web-utils';

type pageInitiator = {
  loginPage: LoginPage;
  wu: WebUtil;
};

const environment = test.extend<pageInitiator>({
  wu: async ({ page, browserName }, use) => {
    await use(new WebUtil(page, browserName));
  },

  loginPage: async ({ wu, page }, use) => {
    await use(new LoginPage(wu, page));
  },
});

export const loginUi = environment;
