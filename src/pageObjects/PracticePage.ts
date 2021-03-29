import { By, until, WebDriver } from "selenium-webdriver";

/**
 * PracticePage is a page object pointing to Medium.com's topic page.
 * It has methods to navigate there, to search, and to pull article titles.
 */
export class PracticePage {
  /** the page's driver object */
  driver: WebDriver;
  /** https://medium.com/topics */
  url: string = "https://medium.com/topics";
  /** the header marking that we are on the topics page */
  header: By = By.xpath("//h1[text()='Explore topics']");
  /** the button to open the search input */
  searchButton: By = By.css('[title="Search Medium"]');
  /** the titles in the search results */
  stories: By = By.css(".graf--title");
  /**
   * @param {WebDriver} driver - the driver object the page object should interact with
   * @example
   * const page = new PracticePage(driver);
   */
  constructor(driver: WebDriver) {
    this.driver = driver;
  }
  /**
   * Will navigate to https://medium.com/topics
   * @example
   * await page.navigate();
   */
  async navigate() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(this.header));
    await this.driver.wait(
      until.elementIsVisible(await this.driver.findElement(this.header))
    );
  }
  /**
   * Will open the searchbox and input the search terms, hitting enter
   * @param {string} searchTerm - The word/phrase you want to search
   * @example
   * await page.searchStories("Test Automation");
   */
  async searchStories(searchTerm: string) {
    await click(this.driver, this.searchButton);
    await this.driver.switchTo().activeElement().sendKeys(`${searchTerm}\n`);
    await this.driver.wait(until.elementLocated(this.stories));
  }

  /**
   * Will return an array of strings; the titles that appeared as a result of
   * the user's search. Note: The titles are returned lower case.
   * @example
   * let titles = await page.getStoryTitles();
   */
  async getStoryTitles() {
    let titles = [];
    await this.driver.wait(until.elementsLocated(this.stories));
    let elements = await this.driver.findElements(this.stories);
    for (let i = 0; i < elements.length; i++) {
      titles.push(await (await elements[i].getText()).toLowerCase());
    }
    return titles;
  }
}

const sendKeys = async function (driver: WebDriver, elementBy: By, keys: any) {
  await driver.wait(until.elementLocated(elementBy));
  return driver.findElement(elementBy).sendKeys(keys);
};
const click = async function (driver: WebDriver, elementBy: By) {
  await driver.wait(until.elementLocated(elementBy));
  return (await driver.findElement(elementBy)).click();
};