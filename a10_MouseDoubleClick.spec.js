const { test, expect } = require('@playwright/test');

test('Mouse Double Click', async ({ page }) => {

  await page.goto('https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_ev_ondblclick');

  // Switch to iframe
  const frame = page.frameLocator('#iframeResult');

  // Locate button inside iframe
  const doubleClickBtn = frame.locator('button');

  // Perform double click
  await doubleClickBtn.dblclick();

  // Verify text change
  const expectedText = frame.locator('#demo');
  await expect(expectedText).toHaveText('Hello World');

  await page.waitForTimeout(4000);
});
