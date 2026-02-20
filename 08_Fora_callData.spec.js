// npx playwright test ./Fora/callData.spec.js --project=chromium --headed

// data.js
module.exports = {
  credentials: {
    email: 'mythili+030226@qaoncloud.com',
    password: 'Qaoncloud@01'
  },
  trip: {
    name: 'USA Trip'
  }
};

const { test, expect } = require('@playwright/test');
const { credentials, trip } = require('./data'); // import test data

test.setTimeout(90_000); // 90 seconds

// ==================================================
// Before Each Hook — Login & Navigate to Create Trip
// ==================================================
test.beforeEach(async ({ page }) => {
  // Go to login page
  await page.goto('https://advisor.forastaging.net/');
  await page.locator("a:has-text('Sign in here')").click();

  // Login
  await page.waitForSelector('#username', { timeout: 20000 });
  await page.locator('#username').fill(credentials.email);
  await page.locator('#password').fill(credentials.password);
  await page.locator("button[type='submit']:has-text('Sign in')").click();

  // Verify home page
  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();
  await page.waitForTimeout(2000);

  // Navigate to Trips > Create Trip
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
// Test Case — Create Trip
// ==================================================
test('TC-01: Create trip with lowercase name and verify case is preserved', async ({ page }) => {

  await expect(
    page.getByTestId('create-trip-container')
        .getByRole('heading', { name: 'Create a trip' })
  ).toBeVisible();

  // Fill trip name from data
  await page.fill("input[placeholder='Enter name']", trip.name);

  // Assertion 1 — Input value must match exactly
  await expect(page.locator("input[placeholder='Enter name']")).toHaveValue(trip.name);

  // Preview Assertion
  const previewLocator = page.locator("//div[contains(@class,'text-subheader')]");
  await expect(previewLocator).toHaveText(trip.name);

  // Assertion 2 — Ensure case-sensitive match
  await expect(previewLocator).not.toHaveText(trip.name.toLowerCase());

  // Create Trip button assertions
  const createButton = page.locator("button:has-text('Create Trip')");
  await expect(createButton).toBeEnabled();
  await expect(createButton).toBeVisible();

  await createButton.click();
  await page.waitForTimeout(4000);
});

// ==================================================
// After Each Hook — Validate Trip Name on Another Page
// ==================================================
test.afterEach(async ({ page }) => {
  await page.waitForTimeout(2000);

  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });

  // Assertion 3 — Trip name visible & correct
  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText(trip.name);

  // Assertion 4 — Case-sensitive validation
  await expect(tripNameDetail).not.toHaveText(trip.name.toLowerCase());

  // Assertion 5 — Ensure trip name is not empty
  await expect(tripNameDetail).not.toBeEmpty();

  // Assertion 6 — Exact match using regex
  await expect(tripNameDetail).toHaveText(new RegExp(`^${trip.name}$`));

  await page.waitForTimeout(1000);
});
