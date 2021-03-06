import {
    Builder,
    By,
    Capabilities,
    until,
    WebDriver,
    WebElement,
  } from "selenium-webdriver";
  import * as fs from 'fs';
  const chromedriver = require("chromedriver");
  const geckodriver = require("geckodriver");
  
  /** Optional parameters for the page object */
  interface Options {
    /** if no driver is supplied, we make one */
    driver?: WebDriver;
    /** if no driver is supplied, will check for preferred browser (default chrome) */
    browser?: "chrome" | "firefox";
    /** some pages may have a base url */
    url?: string;
  }
  
  export class BasePage {
    driver: WebDriver;
    url?: string;
    pageTitle: By = By.css(`head > title`);
    until: any;
    /**
     *
     * @param {Options} options - optional paramaters for the base page object.
     * @property {WebDriver} options.driver - if no driver is provided, one will be created
     * @property {string} options.url - provide this if the page has a base url
     */
    constructor(options?: Options) {
      if (options && options.driver) this.driver = options.driver;
      if (
        options &&
        options.browser &&
        options.browser == "firefox" &&
        options.driver == undefined
      )
        this.driver = new Builder()
          .withCapabilities(Capabilities.chrome())
          .build();
      else
        this.driver = new Builder()
          .withCapabilities(Capabilities.firefox())
          .build();
      if (options && options.url) this.url = options.url;
    }
    /**
     * navigates to the url passed in, or to the one stored on the page object
     * @param {string} url - the url to navigate to, unless you wish to use the page's defined base url
     */
    async navigate(url?: string): Promise<void> {
      if (url) return await this.driver.get(url);
      else if (this.url) return await this.driver.get(this.url);
      else
        return Promise.reject(
          "BasePage.navigate() needs a URL defined on the page object, or one passed in. No URL was provided."
        );
    }
    /**
     * waits for the identified element to be located and visible before returning it.
     * @param {By} elementBy - the locator for the element to return.
     */
    async getElement(elementBy: By): Promise<WebElement> {
      await this.driver.wait(until.elementLocated(elementBy));
      let element = await this.driver.findElement(elementBy);
      await this.driver.wait(until.elementIsVisible(element));
      return element;
    }
    /**
     * clicks the given element after waiting for it
     * @param {By} elementBy - the locator for the element to click
     */
    async clickThing(elementBy: By): Promise<void> {
      let element = await this.getElement(elementBy);
      await this.driver.wait(until.elementIsEnabled(element));
      return await element.click();
    }
    /**
     * returns an element's text after waiting for it to be visible
     * @param {By} elementBy - the locator of the element to get text from
     */
    async getText(elementBy: By): Promise<string> {
      let element = await this.getElement(elementBy);
      await this.driver.wait(until.elementIsEnabled(element));
      return element.getText();
    }
    /**
     * enters keys into an element
     * @param {By} elementBy - the locator of the element to send keys to
     * 
     */
    async sendKeys(elementBy: By, keys: any): Promise<void>  {
      await this.driver.wait(until.elementLocated(elementBy));
      return this.driver.findElement(elementBy).sendKeys(keys);
    }
    async enterField(element: By, content: string): Promise<void> {
      return this.sendKeys(element, `${content}\n`);
    }
    /**
     * returns an element's attribute value after waiting for the element to be visible
     * @param {By} elementBy - the locator of the element to get the value from
     * @param {string} attribute - the attribute to return the value from, such as 'value' or 'href'
     */
    async getAttribute(elementBy: By, attribute: string): Promise<string> {
      let element = await this.getElement(elementBy);
      await this.driver.wait(until.elementIsEnabled(element));
      return element.getAttribute(attribute);
    }
    /**
     * Will take a screenshot and save it to the filepath/filename provided.
     * Automatically saves as a .png file.
     * @param {string} filepath - the filepath relative to the project's base folder where you want the screenshot saved
     * @example - page.takeScreenshot("myFolder/mypic")
     * //picture saves in "myFolder" as "mypic.png"
     */
    async takeScreenshot(filepath: string): Promise<void>  {
      fs.writeFile(
        `${filepath}.png`,
        await this.driver.takeScreenshot(),
        "base64",
        (e) => {
          if (e) console.log(e);
          else return filepath; //console.log("screenshot saved successfully");
        }
      );
    }
  }