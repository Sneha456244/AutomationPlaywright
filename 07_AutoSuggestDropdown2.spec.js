const { test, expect } = require('@playwright/test');

test('Wikipedia Auto-suggest dropdown with robust click', async ({ page }) => {
    await page.goto('https://www.wikipedia.org/', 
        { waitUntil: 'domcontentloaded' });

    // Search input
    const searchInput = page.locator('input[name="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Playwright');

    // Wait for suggestions
    const suggestions = page.locator('.suggestion-title');
    await expect(suggestions.first()).toBeVisible();

    // Ensure at least one suggestion
    const suggestionCount = await suggestions.count();
    expect(suggestionCount).toBeGreaterThan(0);

    // Capture all suggestion texts
    const suggestionTexts = await suggestions.allTextContents();
    console.log('Suggestions:', suggestionTexts);

    // Select a suggestion containing 'Playwright (software)' using :has-text
    const desiredOption = suggestions.filter({ hasText: 'Playwright (software)' });
    await expect(desiredOption).toBeVisible(); // Assert it exists
    await desiredOption.first().click();       // Click the first match

    // Assert navigation and page title
    await expect(page).toHaveURL(/Playwright_\(.+\)/);
    await expect(page).toHaveTitle(/Playwright/);

    console.log('Wikipedia auto-suggest test passed.');

    await page.waitForTimeout(2000);
});
