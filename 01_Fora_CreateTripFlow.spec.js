//npx playwright test ./Fora/CreateTripFlow.spec.js --project=chromium --headed 
const { test, expect } = require('@playwright/test');

// ==================================================
// Before Each Hook — Login & Navigate to Create Trip
// ==================================================
test.beforeEach(async ({ page }) => {

  // ===============================
  // 1) Login Section
  // ===============================

  // Open Fora Advisor Portal
  await page.goto('https://advisor.forastaging.net/');

  // Click "Sign in here" link
  await page.locator("a:has-text('Sign in here')").click();

  // Wait for Login form to load
  await page.waitForSelector('#username', { timeout: 20000 });

  // Enter Username
  await page.locator('#username').fill('mythili+030226@qaoncloud.com');

  // Enter Password
  await page.locator('#password').fill('Qaoncloud@01');

  // Click Sign In button
  await page.locator("button[type='submit']:has-text('Sign in')").click();

  // ===============================
  // 2) Home Page Validation Section
  // ===============================

  // Wait for Home page to load
  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });

  // Verify Home heading is visible
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();

  // wait
  await page.waitForTimeout(2000);

  // ===============================
  // 3) Click on Search
  // ===============================
  await page.locator('[data-testid="nav_bar_search"]').click();

  // ===============================
  // 4) Search "trips" and click Trips
  // ===============================

  // Wait for search input to appear
  await page.waitForSelector("input[type='search'], input[placeholder*='Search']", { timeout: 20000 });

  // Type "trips" in search
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('trips');

  // Wait for Trips result
  await page.waitForSelector("text=Trips", { timeout: 10000 });

  // Click on Trips
  await page.waitForSelector('#page-2', { timeout: 20000 });
  await page.locator('#page-2').click();

  // ===============================
  // 5) Click on Create Trip button
  // ===============================
  await expect(page.locator("//span[normalize-space()='Create trip']")).toBeVisible();
  await page.locator("//span[normalize-space()='Create trip']").click();

  // wait for Create Trip page to fully load
  await page.waitForTimeout(3000);
});

// ==================================================
// Test Case 01 — SKIPPED
// ==================================================
test.skip('TC-01: Create trip with required field only', async ({ page }) => {

  await expect(
    page.getByTestId('create-trip-container')
        .getByRole('heading', { name: 'Create a trip' })
  ).toBeVisible();

  const tripName = 'USA Trip';
  await page.fill("input[placeholder='Enter name']", tripName);

  await expect(
    page.locator("//div[contains(@class,'text-subheader')]")
  ).toHaveText(tripName);

  await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();
  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);
});

// ==================================================
// Test Case 02 — EXECUTED
// ==================================================
test('TC-02: Create trip with travelers, dates, and trip reason', async ({ page }) => {

  // a) Enter Trip Name
  const tripName = 'USA Trip';
  await page.fill("input[placeholder='Enter name']", tripName);
  await expect(page.locator("//div[contains(@class,'text-subheader')]")).toHaveText(tripName);
  await page.waitForTimeout(1000);

  // b) Add Travelers
  /*await page.locator("div.cursor-pointer.w-full.text-text-primary.text-left.border.border-border-primary.rounded-xl").click();
  await page.locator("//input[@type='checkbox']").first().check(); // pick the first traveler
  const travelerSummary = page.locator("//div[@class='pb-1 font-normal']");
  await expect(travelerSummary).toContainText('Mythili V');*/
  await page.waitForTimeout(1000);

  // c) Select Trip Reason
  const tripReasonBtn = page.locator("button[data-testid='select-trip-reason']");
  await tripReasonBtn.click();
  await page.waitForTimeout(500); // wait for dropdown
  await page.locator("//div[contains(text(),'Anniversary')]").click();
  await page.waitForTimeout(500);

  const summaryCard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(summaryCard).toContainText('Anniversary');
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
  await page.waitForTimeout(500);

  // e) Enable Create Trip button and click
  await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();
  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);
});

// ==================================================
// After Each Hook — Validate Trip Name on Another Page
// ==================================================
test.afterEach(async ({ page }) => {

  // Optional: wait for trip details to load
  await page.waitForTimeout(2000);

  // 1) Validate trip name on the current page (before back)
  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });
  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText('USA Trip');

  // Optional wait
  await page.waitForTimeout(1000);

  // 2) Click Back Arrow to go to Trips page
  const backArrow = page.locator("//a[@aria-label='Back']//*[name()='svg']");
  await backArrow.click();

// Locate the trip name element (take the first match if multiple)
const tripNameLocator = page.locator("//span[contains(@class,'w-0 grow text-wrap tablet:truncate font-semibold')]").first();

// Wait for it to be visible
await tripNameLocator.waitFor({ state: 'visible', timeout: 10000 });

// Validate it contains the expected text
await expect(tripNameLocator).toContainText('USA Trip');

console.log('Trip name "USA Trip" successfully validated on Trips page');


});


