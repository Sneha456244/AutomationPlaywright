//npx playwright test ./Fora/CreateTripAssertion2.spec.js --project=chromium --headed 
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
test('TC-02: Create trip with travelers, dates, and trip reason', async ({ page }) => {

  // a) Enter Trip Name
  const tripName = 'USA Trip';
  await page.fill("input[placeholder='Enter name']", tripName);

  // Assertion 1 — Input value check
  await expect(page.locator("input[placeholder='Enter name']")).toHaveValue(tripName);

  await expect(page.locator("//div[contains(@class,'text-subheader')]")).toHaveText(tripName);

  // Assertion 2 — Case-sensitive preview check
  await expect(page.locator("//div[contains(@class,'text-subheader')]")).not.toHaveText('usa trip');

  await page.waitForTimeout(1000);


  // c) Select Trip Reason
  const tripReasonBtn = page.locator("button[data-testid='select-trip-reason']");
  await tripReasonBtn.click();
  await page.waitForTimeout(500);

  await page.locator("//div[contains(text(),'Anniversary')]").click();
  await page.waitForTimeout(500);

  const summaryCard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(summaryCard).toContainText('Anniversary');

  // Assertion 3 — Ensure correct reason selected
  await expect(summaryCard).not.toContainText('Birthday');

  await page.waitForTimeout(500);


  // d) Select Estimated Date
  await page.locator("//button[normalize-space()='Estimated']").click();
  await page.waitForTimeout(500);

  await page.locator("[data-testid='select-select-estimated-travel-month']").click();

  const febOption = page.locator("text=February 2026");
  await febOption.waitFor({ state: 'visible', timeout: 5000 });
  await febOption.click();
  await page.waitForTimeout(500);

  const summarycard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(summarycard).toContainText('February 2026');

  // Assertion 4 — Ensure correct month selected
  await expect(summarycard).not.toContainText('January 2026');

  await page.waitForTimeout(500);


  // e) Enable Create Trip button and click
  await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();

  // Assertion 5 — Button visible
  await expect(page.locator("button:has-text('Create Trip')")).toBeVisible();

  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);
});


// ==================================================
// After Each Hook — Validate Trip Name , Trip Reason , Estimated Date
// ==================================================
test.afterEach(async ({ page }) => {

  await page.waitForTimeout(2000);

  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });

  // a) Trip Name Validation
  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText('USA Trip');

  // Case-sensitive validation
  await expect(tripNameDetail).not.toHaveText('usa trip');

  // No leading / trailing spaces
  await expect(tripNameDetail).toHaveText(/^USA Trip$/);

// b) Trip Reason Validation
const tripReasonDetail = page.locator("//button[normalize-space()='Anniversary']");

// Visible
await expect(tripReasonDetail).toBeVisible();

// Exact text match
await expect(tripReasonDetail).toHaveText('Anniversary');

// Ensure only ONE reason saved
await expect(tripReasonDetail).toHaveCount(1);

// Ensure wrong reason not saved
await expect(page.locator("//button[normalize-space()='Birthday']")).toHaveCount(0);

// c) Estimated Date Validation
const tripDateDetail = page.locator("//button[normalize-space()='February 2026']");

// Visible
await expect(tripDateDetail).toBeVisible();

// Exact match
await expect(tripDateDetail).toHaveText('February 2026');

// Ensure only ONE date saved
await expect(tripDateDetail).toHaveCount(1);

// Ensure wrong month not saved
await expect(page.locator("//button[normalize-space()='January 2026']")).toHaveCount(0);


  await page.waitForTimeout(1000);

  // Ensure summary not empty
  await expect(tripReasonDetail).not.toBeEmpty();

  await page.waitForTimeout(1000);
});
