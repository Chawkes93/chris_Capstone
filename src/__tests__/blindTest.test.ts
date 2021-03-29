
import { PracticePage } from "../pageObjects/PracticePage"
const chromedriver = require("chromedriver");
import { WebDriver, Builder, Capabilities } from "selenium-webdriver";
const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();
const page = new PracticePage(driver)

test("can search stories", async () => {
  await page.navigate();
  await page.searchStories("Test Automation")
  let titles = await page.getStoryTitles();
  expect(titles[0]).toContain("test automation");
});
afterAll(async () => {
  await driver.quit();
});