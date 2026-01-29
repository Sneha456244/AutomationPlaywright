const { test, expect } = require('@playwright/test');

test("Bootstrap Multiselect", async ({ page }) => {

    await page.goto('https://davidstutz.github.io/bootstrap-multiselect/');

    // Scroll to optgroup example
    const select = page.locator('#example-multiple-optgroups');
    await select.scrollIntoViewIfNeeded();

    // Locate the correct dropdown button 
    const dropdownBtn = page.locator(
        '#example-multiple-optgroups + .btn-group button.multiselect'
    );

    // 1) Locator-based assertion
    /*const optionsLocator = dropdown.locator('button.multiselect-option');
    await expect(optionsLocator).toHaveCount(5);*/

    // 2️) lenght
    /*const options = await dropdown.$$('button.multiselect-option');
    await expect(options.length).toBe(5);*/

    // Open dropdown
    await dropdownBtn.click();

    // options ONLY to the opened dropdown
    const dropdown = dropdownBtn.locator('..').locator('.multiselect-container');
    const options = await dropdown.locator('button.multiselect-option').all();

    // 3) SELECT OPTIONS
    for (const option of options) {
        const value = (await option.textContent()).trim();

        if (value.includes('Option 2.1') || value.includes('Option 2.2')) {
            await option.click();
        }
    }

    // 4) DESELECT OPTION
    for (const option of options) {
        const value = (await option.textContent()).trim();

        if (value.includes('Option 1.1')) {
            await option.click();
        }
    }

    // Close dropdown
    await page.keyboard.press('Escape');

    await page.waitForTimeout(2000);
});
