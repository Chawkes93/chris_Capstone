
import {
    By,
    until,
} from "selenium-webdriver";
import { BasePage } from "./BasPage";
var chiSquaredTest = require('chi-squared-test');
import assert from 'assert';
const mapObject = require('map-obj');


export class DnDB extends BasePage {
    emailField: By = By.xpath(`//input[@id='identifierId']`);
    passwordField: By = By.css('[type="password"]')
    googleSignInButton: By = By.css('[id="signin-with-google"]')
    chooseOtherAccount: By = By.xpath(`//li[@class="JDAKTe eARute W7Aapd zpCp3 SmR8"]`)
    signInTitle: By = By.css(`head > title`);
    nextButton: By = By.xpath(`//button/div[2]`)
    accountName: By = By.css("#site-main > div.site-bar > div > div > div > div.site-interactions-group.site-interactions-group-user > div > div.user-interactions-profile > div > span");
    wrongPassword: By = By.xpath(`//div/span[contains(string(), 'Wrong password')]`);
    diceResults: By = By.xpath(`//span[@class="dice_result__info__breakdown"]`);
    expectedResults: Array<number> = [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
    diceButtonList: By = By.xpath(`(//span[@class="dice-icon-die dice-icon-die--d20"])[1]`);
    d20: By = By.xpath(`(//span[@class="dice-icon-die dice-icon-die--d20"])[2]`);
    rollSelectedDice: By = By.xpath(`//div[@class="dice-toolbar__roll"]`);
    criticalValue: number = 27
    




    constructor(options: any) {
        super(options);
        this.url = "https://www.dndbeyond.com/sign-in?returnUrl=https://www.dndbeyond.com/";
    };



    async getElementText(elementBy: By): Promise<string> {
        let element = await this.getElement(elementBy)
        return await element.getText();
    };



    async googleSignIn() {
        //Store the ID of the original window
        let originalWindow = await this.driver.getWindowHandle();
        //Check we don't have other windows open already
        assert((await this.driver.getAllWindowHandles()).length === 1);
        //Click the link which opens in a new window
        await this.driver.findElement(this.googleSignInButton).click();
        //Wait for the new window or tab
        await this.driver.wait(
            async () => (await this.driver.getAllWindowHandles()).length === 2,
            10000
        );
        //Loop through until we find a new window handle
        let windows = await this.driver.getAllWindowHandles();
        windows.forEach(async handle => {
        if (handle !== originalWindow) {
            await this.driver.switchTo().window(handle);
            }
        });
        await this.driver.wait(until.titleIs("Sign in - Google Accounts"), 10000);
    }



    async signInInputs(email: string, password: string) {
        await this.getElement(this.emailField)
        await this.sendKeys(this.emailField, email)
        await this.driver.sleep(3238);
        await this.clickThing(this.nextButton)
        await this.driver.sleep(3238);
        await this.sendKeys(this.passwordField, password)
        await this.driver.sleep(1238);
        await this.clickThing(this.nextButton)
    }



    async pageCheck(elementBy: By, match: RegExp): Promise<boolean> {
        let elementx = await this.getElement(elementBy);
        let elementy = (await elementx.getText()).toString();
        return match.test(elementy)
    }



    async remainingWindow() {
        let w = await this.driver.getAllWindowHandles();
        await this.driver.switchTo().window(w[0]);
    }



    async multipleClicks(clicks: number, elementBy: By) {
        for (let i=0; i < clicks; i ++) {
            await this.clickThing(elementBy);
           }
    }



    stringToArray(str: string, regexRemove: RegExp): any {
        let diceArray: string[] = (str.toString()).replace(regexRemove, " ").split(" ")
        var arrNum = diceArray.map(Number)
        var sum = arrNum.reduce((a, b) => a + b, 0)
        var mean = (sum / 100)
        console.log(`\n\n\n***  MEAN ***\n\r\r       ${mean}\n\n\n\n`)        
        return arrNum
    }



    countResults(arr: any[]) {
    var diceValues: string[] = [],
        valueCount: number[] = [],
      prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        diceValues.push(arr[i]);
        valueCount.push(1);
      } else {
        valueCount[valueCount.length - 1]++;
      }
      prev = arr[i];
    }
            var counts: number[] = [];
            for (var i = 0; i < arr.length; i++) {
            var num: number = arr[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
            }         
            console.log(`\n\n*** DICE RESULTS *** \n\r \n\r1 = ${counts[1]} \n\r2 = ${counts[2]} \n\r3 = ${counts[3]} \n\r4 = ${counts[4]} \n\r5 = ${counts[5]} \n\r6 = ${counts[6]} \n\r7 = ${counts[7]} \n\r8 = ${counts[8]} \n\r9 = ${counts[9]} \n\r10 = ${counts[10]} \n\r11 = ${counts[11]} \n\r12 = ${counts[12]} \n\r13 = ${counts[13]} \n\r14 = ${counts[14]} \n\r15 = ${counts[15]} \n\r16 = ${counts[16]} \n\r17 = ${counts[17]} \n\r18 = ${counts[18]} \n\r19 = ${counts[19]} \n\r20 = ${counts[20]}\n\n`);
    return valueCount;
  }



    doChiSquare(observation: number[], expectation: number[], reduction: number): number {
        let test = chiSquaredTest(observation, expectation, reduction)
        let ChS = test.chiSquared
        let CS = ChS.toString().replace(/\.\d+/g,"")
        let Prob = test.probability * 100
        let P = Prob.toString().replace(/\.\d+/g,"")


            console.log(`\n\r\n\r\n\r\n\r/////   There is a ${P}% chance the dice comes from the same distribution    ////////\n\n\n`)
            console.log(`\n\n\n\n***  CHI SQUARE VALUE  ***\n\r                 ${CS}\n\n\n\n`)
            return  Number(CS)
}



    async testD20(elementBy: By) {
        var expectation = this.expectedResults
        var x: string = await this.getElementText(elementBy)
        var observe = this.countResults(this.stringToArray(x, /\+/g))        
        return  this.doChiSquare(observe, expectation, 1)
    }
};