const { test, expect } = require('@playwright/test');

test('handle inputbox', async ({ page }) => {

    await page.goto('https://demo.automationtesting.in/Register.html', {
        waitUntil: 'domcontentloaded'
    });

    ///Input first name
    const nameInputBox = page.locator("//input[@placeholder='First Name']");


    await expect(nameInputBox).toBeVisible();
    await expect(nameInputBox).toBeEmpty();
    await expect(nameInputBox).toBeEditable();

    await nameInputBox.fill('SAI');
    //page.fill("//input[@placeholder='First Name']",'SAI')
    await expect(nameInputBox).toHaveValue('SAI');

    await page.waitForTimeout(3000);
});
