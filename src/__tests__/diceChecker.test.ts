import { DnDB } from "../pageObjects/dndBeyond";



describe("***20 Sided Dice Test***", () => {
    const page = new DnDB({ browser: "chrome" });
    beforeEach(async () => {
        await page.navigate();
    });

    afterEach(async () => {
        await page.driver.manage().deleteAllCookies();
    })

    test("D20 is fair, according to Chi Squared Test", async () => {  
        // Set account name expectation, email, and password
        let trueEmail = "philliam.miller@gmail.com"
        let truePassword = "Phil_miller1"
        // Sign in
        await page.googleSignIn();
        await page.signInInputs(trueEmail, truePassword);
        await page.remainingWindow();
        await page.getElementText(page.accountName);
        // Nav to character sheet
        await page.navigate("https://www.dndbeyond.com/profile/PhilliamTheGreatest/characters/47573721");
        await page.driver.manage().window().maximize()
        // Select dice menu
        await page.clickThing(page.diceButtonList);
        // Click d20 100 times, qeueing up 100 roles
        await page.multipleClicks(100, page.d20)
        // Click button that roles selected die
        await page.clickThing(page.rollSelectedDice)
        // Wait for dice to roll
        await page.driver.sleep(10000)
        // Pull results from each role, process the data, and execute Chi Squared test
        expect(await page.testD20(page.diceResults)).toBeLessThanOrEqual(page.criticalValue)
    });
    afterAll(async () => {
        await page.driver.quit();
    });
});


/*
        *** Summary ***

        If we role the dice 100 times, then we are expecting each number
        to land 5 times

        *** Values ***

        DF (degrees of freedom) = 19

        Level of Significance = 0.1

        Critical Value = 27.204

        *** Logic ***

        If (Critical Value > Test Statistic) {
            return true
        } else if (Critical Value < Test Statistic){
            return false
        } else {
            something went wrong with your code
        }

*/