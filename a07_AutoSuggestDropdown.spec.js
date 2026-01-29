const { test, expect } = require('@playwright/test');

test('DemoQA Auto-suggest dropdown', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu', { waitUntil: 'domcontentloaded' });

    // Target the container, not the hidden input
    const container = page.locator('#withOptGroup'); // react-select container

    // Click the container to open dropdown
    await container.click();

    // Type the option
    const input = page.locator('#react-select-2-input');
    await input.fill('Group 2, option 1');

    
    await input.press('Enter');

    // Verify selection
    const selectedValue = await container.locator('.css-1uccc91-singleValue').textContent();
    console.log('Selected:', selectedValue); // Should print 'Group 2, option 1'

    await page.waitForTimeout(2000);
});
