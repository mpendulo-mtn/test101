import { ElementHandle, Locator, Page } from '@playwright/test';
import Params, { GlobalConst as gc } from './params';

export class WebUtil {
  private page: Page;
  private browserName: string;
  private pages: Page[] = [];
  private previousElement: SVGElement | HTMLElement | undefined;

  constructor(page: Page, browserName: string) {
    this.page = page;
    this.browserName = browserName;
    this.pages.push(page);
  }

  async goToURL(url: string) {
    await this.page.goto(url, { waitUntil: 'load', timeout: 0 });
  }

  async beforeEach() {
    await this.page.goto(gc.URL, { waitUntil: 'load', timeout: 120000 });
  }

  async findElements(selector: string): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    let elements = await this.page.$$(selector);
    if (elements != undefined && elements != null) {
      return elements;
    }
    return elements;
  }

  async findElement(selector: string): Promise<Locator | null> {
    let element = await this.page.locator(selector);
    if (element != null && element != undefined) {
      return element.first();
    }
    return null;
  }

  async fillTextOrFail(selector: string, inputText: any) {
    await this.waitForSelectorOrFail(selector);
    await this.page.fill(selector, inputText.toString());
    await this.waitFor(1000);
  }

  async clickButtonOrFail(selector: string) {
    await this.waitForSelectorOrFail(selector);
    // await this.page.waitForTimeout(5000); //commenting out because of wait, "May I Help you" element will come and overlap accept button
    await this.page.click(selector, { timeout: 35000 });
    //await this.page.waitForLoadState('networkidle', {timeout : 120000});
  }

  async waitForSelectorOrFail(selector: string, timeout: number = 30000) {
    return await this.page.waitForSelector(selector, { timeout: timeout });
  }

  async waitForSelectorToDisappear(selector: string, timeout: number = 30000) {
    let currentTime = 0;
    let isElementPresent = true;
    while (await this.isVisible(selector)) {
      currentTime = currentTime + 500;
      await this.waitFor(500);
      if (currentTime == timeout) {
        break;
      }
    }

    if (!(await this.isVisible(selector))) {
      isElementPresent = false;
    }
    return isElementPresent;
  }

  async waitFor(time: number) {
    await this.page.waitForTimeout(time);
  }

  async waitForPageToLoad() {
    await this.page.waitForLoadState('load', { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async isVisible(selector: string): Promise<Boolean> {
    return await this.page.isVisible(selector, { timeout: 30000 });
  }

  async isEnabled(selector: string): Promise<Boolean> {
    return await this.page.isEnabled(selector);
  }

  async checkElementPresent(selector: string): Promise<Boolean> {
    await this.waitFor(5000);
    let condition = await this.isVisible(selector);
    return condition;
  }

  async checkElementClickbality(selector: string): Promise<Boolean> {
    let condition = (await this.isVisible(selector)) && (await this.isEnabled(selector));
    return condition;
  }

  async keyPress(keyValue: string) {
    await this.page.keyboard.press(keyValue);
  }

  async getText(selector: string): Promise<string | null> {
    let element = await this.findElement(selector);
    try {
      if (element != null && element != undefined) {
        return await element.innerText({ timeout: 30000 });
      }
    } catch (e) {
      //element text couldnt be grabbed in the set time. try other way
      console.log('Waited for 30s to get the text.Trying one more time...');
      if (element != null && element != undefined) {
        return await element.textContent({ timeout: 30000 });
      }
    }
    return null;
  }

  async findInnerElement(selector1: string, selector2: string): Promise<Locator | null> {
    let secondElement = null;
    let firstElement = await this.findElement(selector1);
    if (firstElement != null && firstElement != undefined) {
      let secondElement = await firstElement.locator(selector2);
      if (secondElement != null && secondElement != undefined) {
        return secondElement;
      }
    }
    return secondElement;
  }

  async getAttributeValue(selector: string, attrib: string): Promise<string | null> {
    let element = await this.findElement(selector);
    if (element != null) {
      let attribValue = await element.getAttribute(attrib, { timeout: 30000 });
      if (attrib != null && attrib != undefined) {
        return attribValue;
      }
    }
    return null;
  }

  async getInputElementValue(selector: string) {
    return await this.page.$eval(selector, (element: HTMLInputElement) => element.value);
  }

  async clearInputElementValue(selector: string) {
    return await this.page.$eval(selector, (element: HTMLInputElement) => (element.value = ''));
  }

  async highlightElement(selector: string) {
    await this.page.$eval(selector, async (element) => {
      await this.unhighlightLastElement();
      element.style.border = '3px solid red';
      this.previousElement = element;
    });
  }

  async unhighlightLastElement() {
    if (this.previousElement != null && this.previousElement != undefined) {
      this.previousElement.style.border = '';
    }
  }

  async fetchRequestResponse(requestURL: string): Promise<string> {
    try {
      const response = await this.page.waitForResponse(
        (response) => response.url().includes(requestURL),
        { timeout: 60000 }
      );
      const buff = Buffer.from(await response.body());
      return buff.toString();
    } catch (e) {
      throw Error(
        `Timed out (60s). Request /.*/${requestURL}/.* didnt trigger, so couldnt fetch response.`
      );
    }
  }

  async screenShotPage(sysPath: string, isFullPage: boolean): Promise<Buffer> {
    if (sysPath == '') {
      return this.page.screenshot({ fullPage: isFullPage });
    }

    return this.page.screenshot({ path: sysPath, fullPage: isFullPage });
  }

  async getPage(): Promise<Page> {
    return this.page;
  }

  async setPage(page: Page) {
    this.page = page;
  }

  async getAllPages(): Promise<Page[]> {
    return this.pages;
  }

  async addNewPage(page: Page) {
    this.pages.push(page);
  }
  async getBrowserName(): Promise<string> {
    return this.browserName;
  }

  async filterJsonWithKeys(pDataQueryJson, pStartsWith) {
    let result = {};
    if (pDataQueryJson) {
      for (let key in pDataQueryJson) {
        if (key.toUpperCase().startsWith(pStartsWith)) {
          result[key] = pDataQueryJson[key];
        }
      }
    }
    return result;
  }

  // Common functions created by Alekhya
  async openBrowser(env: { launch: () => any }) {
    try {
      //To launch browser instance with any environment
      const browser = await env.launch();
      const page = await browser.newPage();
      console.log(browser);
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  }

  async navigateToURL(url: string) {
    try {
      // Navigate to the specified URL
      await this.page.goto(url, { waitUntil: 'load', timeout: 20000 });
    } catch (error) {
      console.error('Error navigating to url:', error);
    }
  }

  async clickElement(selector: string) {
    try {
      // Wait for the element to be visible and clickable
      console.log('Entered into clickElement function');
      await this.page.waitForSelector(selector);
      // Click the element
      await this.page.click(selector);
    } catch (error) {
      console.error('Error clicking element with selector', error);
    }
  }

  async enterText(selector: string, text: any) {
    try {
      // Wait for the field to be visible and enter the text
      (await this.page.waitForSelector(selector)).fill(text);
    } catch (error) {
      console.error('Error entering the text in the field', error);
    }
  }

  async clearText(selector: any) {
    try {
      // Wait for the input field to be visible
      await this.page.waitForSelector(selector);

      // Focus on the input field
      await this.page.focus(selector);

      // Clear the input field
      await this.page.$eval(selector, (input: { value: string }) => (input.value = ''));
    } catch (error) {
      console.error('Error entering the text in the field', error);
    }
  }

  async selectCheckbox(selector: any) {
    try {
      // Wait for the checkbox to be visible
      await this.page.waitForSelector(selector);

      // Check if the checkbox is already selected
      const isChecked = await this.page.$eval(
        selector,
        (checkbox: { checked: any }) => checkbox.checked
      );

      // If the checkbox is not selected, click it to select it
      if (!isChecked) {
        await this.page.click(selector);
        console.log('Checkbox of the selector is not selected');
      } else {
        console.log('Checkbox is already selected');
      }
    } catch (error) {
      console.error('Error selecting the checkbox', error);
    }
  }

  async selectRadioButton(selector: any) {
    try {
      // Wait for the radioButton to be visible
      await this.page.waitForSelector(selector);

      // Check if the radioButton is already selected
      const radioButton = await this.page.$eval(
        selector,
        (radioButton: { checked: any }) => radioButton.checked
      );

      // If the radioButton is not selected, click it to select it
      if (!radioButton) {
        await this.page.click(selector);
        console.log('RadioButton of the selector is not selected');
      } else {
        console.log('RadioButton is already selected');
      }
    } catch (error) {
      console.error('Error selecting the radio button', error);
    }
  }

  async checkIfElementVisible(selector: string) {
    try {
      // Wait for the input to be visible
      const input = await this.page.waitForSelector(selector);

      // If the input is visible, click it to select it
      if (await input.isVisible()) {
        await this.page.click(selector);
        console.log('Element is clicked');
      } else {
        console.log('Element is not found to click');
      }
    } catch (error) {
      console.error('Error finding the element selector', error);
    }
  }

  async checkIfElementEnabled(selector: string) {
    try {
      // Wait for the input to be visible
      const input = await this.page.waitForSelector(selector);

      // If the input to be enabled, click it to select it
      if (await input.isEnabled()) {
        await this.page.click(selector);
        console.log('Element is clicked');
      } else {
        console.log('Element is not found to click');
      }
    } catch (error) {
      console.error('Error finding the element selector', error);
    }
  }

  async checkIfElementSelected(selector: any) {
    try {
      // Wait for the element to be visible
      await this.page.waitForSelector(selector);

      // Check if the element is a checkbox
      const isCheckbox = await this.page.$eval(selector, (element) => {
        return element instanceof HTMLInputElement && element.type === 'checkbox';
      });

      if (isCheckbox) {
        // If it's a checkbox, check the 'checked' property
        const isChecked = await this.page.$eval(
          selector,
          (element: HTMLInputElement) => element.checked
        );
        console.log('Is it selected (checkbox):', isChecked);
        return isChecked;
      } else {
        // For other elements, check if it has the 'selected' attribute
        const isSelected = await this.page.$eval(selector, (element: HTMLElement) =>
          element.hasAttribute('selected')
        );
        console.log('Is it selected:', isSelected);
        return isSelected;
      }
    } catch (error) {
      console.error('Error selecting the element', error);
      return false; // Return false in case of an error
    }
  }

  async selectElementFromDropdown(selector: string, value: any) {
    try {
      // Wait for the dropdown to be visible
      await this.page.waitForSelector(selector);

      // Click the dropdown to open it
      await this.page.click(selector);

      // Select the option based on its value
      await this.page.selectOption(selector, { value });

      console.log('Selected option with value from dropdown');
    } catch (error) {
      console.error('Error selecting option from dropdown', error);
    }
  }
}
