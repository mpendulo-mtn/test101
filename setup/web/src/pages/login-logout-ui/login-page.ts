import { chromium, Browser, Page, expect } from '@playwright/test';
import { WebUtil } from '../../common/utils/web-utils';
import { BaseClass } from '../../common/base-class';

export class LoginPage extends BaseClass {
  private page: Page;

  constructor(wu: WebUtil, page: Page) {
    super(wu);
    this.page = page;
  }

  //locators for book cart app home page
  public BOOK_CART_HOMEPAGE = "//a[text()='All Categories']";

  //Function to verify successful launched application
  async verifyHomePage() {
    await this.page.waitForSelector(this.BOOK_CART_HOMEPAGE, { timeout: 5000 });
    await expect(await this.page.isVisible(this.BOOK_CART_HOMEPAGE)).toBeTruthy();
    console.log('Application launched successfully');
  }
}
