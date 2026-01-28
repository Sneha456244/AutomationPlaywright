const { test, expect } = require('@playwright/test')

test('handle check Boxes', async ({ page }) => {

    await page.goto('https://testing.qaautomationlabs.com/checkbox.php?utm_source=chatgpt.com')

    //Single Checkbox
    await page.locator("//input[@id='multichk1']").check();
    //await page.check("//input[@id='multichk1']");

    expect(await page.locator("//input[@id='multichk1']")).toBeChecked();
    expect(await page.locator("//input[@id='multichk1']").isChecked()).toBeTruthy();  //Check the 1st box is check

    expect(await page.locator("//input[@id='multichk3']").isChecked()).toBeFalsy();  //check the 3rd box is uncheck

    //Multiple Checkboxes  ->Checked
    const CheckboxeLocators=[
        "//input[@id='multichk1']",
        "//input[@id='multichk2']",
        "//input[@id='multichk3']"
    ]

    for(const locator of CheckboxeLocators)
    {
        await page.locator(locator).check();
    }
    
    await page.waitForTimeout(3000);

    //Multiple Checkboxes ->Unchecked (unselected multiple check boxes which are already selected)

    for(const locator of CheckboxeLocators)
    {
        if(await page.locator(locator).isChecked())
        {
            await page.locator(locator).uncheck();
        }
    }

    await page.waitForTimeout(3000);

})
