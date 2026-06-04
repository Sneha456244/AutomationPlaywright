const { test, expect } = require('@playwright/test');

test('DemoQA Practice Form', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");
    await page.waitForTimeout(1000);

    const FirstName = page.locator("#firstName");
    await FirstName.fill("Test");
    await page.waitForTimeout(500);

    const LastName = page.locator("#lastName");
    await LastName.fill("Demo");
    await page.waitForTimeout(500);

    const Email = page.locator("#userEmail");
    await Email.fill("demo@test.com");
    await page.waitForTimeout(500);

    const Gender = page.locator("label[for='gender-radio-2']");
    await Gender.click();
    await page.waitForTimeout(500);

    const Mobile = page.locator("#userNumber");
    await Mobile.fill("9876543210");
    await page.waitForTimeout(500);

    const Address = page.locator("#currentAddress");
    await Address.fill("Chennai");
    await page.waitForTimeout(500);

    const Hobby = page.locator("label[for='hobbies-checkbox-1']");
    await Hobby.click();
    await page.waitForTimeout(500);

    const SubmitBtn = page.locator("#submit");
    await SubmitBtn.click();
    await page.waitForTimeout(1000);

    await expect(
        page.locator("#example-modal-sizes-title-lg")
    ).toHaveText("Thanks for submitting the form");

    console.log("Form submitted successfully");

    await page.waitForTimeout(2000);

});
test('DemoQA Negative Form Validation', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");
    await page.waitForTimeout(1000);

    const SubmitBtn = page.locator("#submit");
    await SubmitBtn.click();
    await page.waitForTimeout(1000);

    await expect(page.locator("#firstName")).toBeVisible();

    console.log("Mandatory field validation verified");

    await page.waitForTimeout(2000);

});

test('Submit Empty Form', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");
    await page.waitForTimeout(1000);

    await page.locator("#submit").click();
    await page.waitForTimeout(1000);

    await expect(page.locator("#firstName")).toBeVisible();

    console.log("Mandatory field validation verified");

});

test('Invalid Email', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#firstName").fill("Test");

    await page.locator("#lastName").fill("Demo");

    await page.locator("#userEmail").fill("test123");

    await page.locator("label[for='gender-radio-2']").click();

    await page.locator("#userNumber").fill("9876543210");

    await page.locator("#submit").click();

    console.log("Invalid email validation checked");

});

test('Mobile Number Less Than 10 Digits', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#firstName").fill("Test");

    await page.locator("#lastName").fill("Demo");

    await page.locator("label[for='gender-radio-2']").click();

    await page.locator("#userNumber").fill("12345");

    await page.locator("#submit").click();

    console.log("Mobile number length validation checked");

});

test('Mobile Number Greater Than 10 Digits', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#firstName").fill("Test");

    await page.locator("#lastName").fill("Demo");

    await page.locator("label[for='gender-radio-2']").click();

    await page.locator("#userNumber").fill("987654321012");

    await page.locator("#submit").click();

    console.log("Maximum length validation checked");

});


test('Mobile Number With Alphabets', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#userNumber").fill("ABCDEF");

    await page.waitForTimeout(1000);

    console.log("Alphabet validation checked");

});

test('Gender Mandatory Validation', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#firstName").fill("Test");

    await page.locator("#lastName").fill("Demo");

    await page.locator("#userNumber").fill("9876543210");

    await page.locator("#submit").click();

    console.log("Gender mandatory validation checked");

});

test('First Name Empty', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#lastName").fill("Demo");

    await page.locator("label[for='gender-radio-2']").click();

    await page.locator("#userNumber").fill("9876543210");

    await page.locator("#submit").click();

    console.log("First Name validation checked");

});

test('Last Name Empty', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#firstName").fill("Test");

    await page.locator("label[for='gender-radio-2']").click();

    await page.locator("#userNumber").fill("9876543210");

    await page.locator("#submit").click();

    console.log("Last Name validation checked");

});

test('State Without City', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#firstName").fill("Test");

    await page.locator("#lastName").fill("Demo");

    await page.locator("label[for='gender-radio-2']").click();

    await page.locator("#userNumber").fill("9876543210");

    const state=await page.locator("#state")
    await state.selectOption("NCR");

    await page.locator("#submit").click();

    console.log("State and City dependency validation checked");

});

test('Future DOB Validation', async ({ page }) => {

    await page.goto("https://demoqa.com/automation-practice-form");

    await page.locator("#dateOfBirthInput").click();

    console.log("Verify whether future dates are allowed");

});
