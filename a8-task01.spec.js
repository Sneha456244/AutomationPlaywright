const { test, expect } = require('@playwright/test');

test('automate Google Sign in', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to your app
  await page.goto('https://fir-ui-demo-84a6c.firebaseapp.com/');

  // Click "Sign in with Google"
  await page.locator('text=Sign in with Google').click();

  // Wait for Google Auth popup
  const [googlePopup] = await Promise.all([
    context.waitForEvent('page'),
    // The click above should trigger the new popup
  ]);

  await googlePopup.waitForLoadState();

  // Fill Google credentials
  
  await googlePopup.fill('input[type="email"]', 'sneha@qaoncloud.com');
  await googlePopup.keyboard.press('Enter');

  await googlePopup.waitForTimeout(2000); // wait for password input to appear
  await googlePopup.fill('input[type="password"]', 'Sneha@');
  await googlePopup.keyboard.press('Enter');

  // Wait for redirect back to app
  await page.waitForURL('https://fir-ui-demo-84a6c.firebaseapp.com/**', { timeout: 15000 });

  // Clean up
  await context.close();
});
