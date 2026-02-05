const { test, expect } = require('@playwright/test');

test('Fora login via Google and verify home page', async ({ page }) => {
    // Go to Fora staging site
    await page.goto('https://advisor.forastaging.net/');

    // Click "Sign in with your Fora email"
    await page.locator('text=Sign in with your Fora email').click();

    // -------- Google Email Step --------
    await page.locator('input[type="email"]:visible').fill('mythili.v030226@forastaging.net');
    await page.locator('#identifierNext').click();

    // -------- Google Password Step --------
    await page.locator('input[type="password"]:visible').fill('Qaoncloud@01');
    await page.locator('#passwordNext').click();

    // -------- Google Continue Page --------
    await page.locator('button:has-text("Continue")').click();

    // Wait for Home page content instead
    await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });

    // Validate Home heading
    await expect(
        page.locator("//h2[normalize-space()='Home']")
    ).toBeVisible();

    await page.waitForTimeout(4000);
});
