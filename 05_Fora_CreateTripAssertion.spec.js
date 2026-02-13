//npx playwright test ./Fora/CreateTripAssertion.spec.js --project=chromium --headed 
const { test, expect } = require('@playwright/test');

test.setTimeout(90_000); // 90 seconds

// ==================================================
// Before Each Hook — Login & Navigate to Create Trip
// ==================================================
test.beforeEach(async ({ page }) => {

  await page.goto('https://advisor.forastaging.net/');
  await page.locator("a:has-text('Sign in here')").click();

  await page.waitForSelector('#username', { timeout: 20000 });
  await page.locator('#username').fill('mythili+030226@qaoncloud.com');
  await page.locator('#password').fill('Qaoncloud@01');
  await page.locator("button[type='submit']:has-text('Sign in')").click();

  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();

  await page.waitForTimeout(2000);

  await page.locator('[data-testid="nav_bar_search"]').click();

  await page.waitForSelector("input[type='search'], input[placeholder*='Search']", { timeout: 20000 });
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('trips');

  await page.waitForSelector("text=Trips", { timeout: 10000 });
  await page.waitForSelector('#page-2', { timeout: 20000 });
  await page.locator('#page-2').click();

  await expect(page.locator("//span[normalize-space()='Create trip']")).toBeVisible();
  await page.locator("//span[normalize-space()='Create trip']").click();

  await page.waitForTimeout(3000);
});


// ==================================================
// Test Case
// ==================================================
test('TC-01: Create trip with lowercase name and verify case is preserved', async ({ page }) => {

  await expect(
    page.getByTestId('create-trip-container')
        .getByRole('heading', { name: 'Create a trip' })
  ).toBeVisible();

  const tripName = 'USA Trip';

  await page.fill("input[placeholder='Enter name']", tripName);

  // Assertion 1 — Input value must match exactly
  await expect(page.locator("input[placeholder='Enter name']")).toHaveValue(tripName);

  // Preview Assertion
  const previewLocator = page.locator("//div[contains(@class,'text-subheader')]");

  await expect(previewLocator).toHaveText(tripName);

  // Assertion 2 — Ensure case-sensitive match
  await expect(previewLocator).not.toHaveText('usa trip');

  await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();

  // Assertion 3 — Button visible check
  await expect(page.locator("button:has-text('Create Trip')")).toBeVisible();

  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);
});


// ==================================================
// After Each Hook — Validate Trip Name on Another Page
// ==================================================
test.afterEach(async ({ page }) => {

  await page.waitForTimeout(2000);

  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });

  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText('USA Trip');

  // Assertion 4 — Case-sensitive validation
  await expect(tripNameDetail).not.toHaveText('usa trip');

  // Assertion 5 — Ensure trip name is not empty
  await expect(tripNameDetail).not.toBeEmpty();

  // Assertion 6 
  await expect(tripNameDetail).toHaveText(/^USA Trip$/);

  await page.waitForTimeout(1000);
});
