import { DnDB } from "../pageObjects/dndBeyond";


describe("***Authentication***", () => {
    const page = new DnDB({ browser: "chrome" });
    beforeEach(async () => {
        await page.navigate();
    });

    afterEach(async () => {
        await page.driver.manage().deleteAllCookies();
    })

    test("The app accepts proper credentials", async () => {  
        // Set account name expectation, email, and password
        let account = "PhilliamTheGreatest"
        let trueEmail = "philliam.miller@gmail.com"
        let truePassword = "Phil_miller1"
        // Pick Google sign in
        await page.googleSignIn();
        // Enter email and password
        await page.signInInputs(trueEmail, truePassword);
        // Go back to dndbeyond.com
        await page.remainingWindow();
            // Test that account name is visibile on homepage
            expect(await page.getElementText(page.accountName)).toContain(account);
    });
    test("The app rejects bad credentials", async () => {  
        // Set account name expectation, email, and password
        let trueEmail = "philliam.miller@gmail.com"
        let falsePassword = "Bill_miller1"
        // Give it a second
        await page.driver.sleep(5238);
        // Pick Google sign in
        await page.googleSignIn();
        await page.driver.sleep(5238);
        // Click the "Choose another account" button
        await page.clickThing(page.chooseOtherAccount);
        // Enter email and password
        await page.signInInputs(trueEmail,falsePassword);
            // Test that login failure occured, by finding error message
            expect(page.pageCheck(page.wrongPassword, /Wrong Password.*/));
    });
    

    afterAll(async () => {
        await page.driver.quit();
    });
});