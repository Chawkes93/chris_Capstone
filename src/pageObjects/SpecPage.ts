import { By, until, WebDriver } from "selenium-webdriver";

//here we set up the page object. it needs the following methods:
// * navigate
// * doSearch
// * getResults
export class SpecPage {
  driver: WebDriver;
  // any page that can search should work, but google is easy.
  url: string = "https://www.google.com";

  searchBar: By = By.name("q");
  results: By = By.id("rso");

  //for the methods, I'm going to copy/paste from another page object for some basic functionality
  //including the constructor and navigate functions. I'll make the doSearch and getResults using those.
  constructor(driver: WebDriver) {
    this.driver = driver;
  }
  async navigate() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(this.searchBar));
    await this.driver.wait(
      until.elementIsVisible(await this.driver.findElement(this.searchBar))
    );
  }

  async sendKeys(elementBy: By, keys: any) {
    await this.driver.wait(until.elementLocated(elementBy));
    return this.driver.findElement(elementBy).sendKeys(keys);
  }

  async getText(elementBy: By) {
    await this.driver.wait(until.elementLocated(elementBy));
    return (await this.driver.findElement(elementBy)).getText();
  }

  async doSearch(text: string) {
    return this.sendKeys(this.searchBar, `${text}\n`);
  }

  async getResults() {
    return this.getText(this.results);
  }
}