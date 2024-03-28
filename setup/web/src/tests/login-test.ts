import test, { Browser, chromium, expect, Page } from '@playwright/test';
import { loginUi } from '../fixtures/login-ui.fixtures';
import Params, { GlobalConst as gc } from '../common/utils/params';

const params = new Params();

loginUi.describe.parallel('Bookcart Page Load', () => {
  //This method will launch browser before every test case
  loginUi.beforeEach(async ({ page }, testInfo) => {
    await page.goto(gc.URL, { waitUntil: 'load', timeout: 120000 });
  });

  //This method will be taking screenshot and close browser after every test case
  /*loginUi.afterEach(async ({ page }, testInfo) => {
    await page.screenshot({
      path:
        "report/screenshots/" + testInfo.project.name + "/" + testInfo.title + ".png",
      fullPage: true,
    });
    await page.close();
  });*/

  //Test case for successful login bookcart website
  loginUi(
    'TC01_Verify user is able to successfully launch to bookcart website',
    async ({ loginPage }, testInfo) => {
      await loginUi.step('Verify book cart application homePage', async () => {
        await loginPage.verifyHomePage();
      });
    }
  );
});
