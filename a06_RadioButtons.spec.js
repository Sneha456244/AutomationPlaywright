const { test, expect } = require('@playwright/test')

test('handle Radio button', async ({ page }) => {

    await page.goto('https://demo.automationtesting.in/Register.html', {
        waitUntil: 'domcontentloaded'
    });

    const radioButton = page.locator("//input[@value='Male']").check(); // check the male radio button

    await expect(page.locator("//input[@value='Male']")).toBeChecked();
    await expect(await page.locator("//input[@value='Male']").isChecked()).toBeTruthy();     // Male

    await expect(await page.locator("//input[@value='FeMale']").isChecked()).toBeFalsy();   // Female

    await page.waitForTimeout(2000);

})
