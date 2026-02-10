//npx playwright test tests/Fora/MergeTripFlow.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');

test.setTimeout(90_000); // 90 seconds

// ==================================================
// BeforeEach — Login & Navigate to Trips Page
// ==================================================
test.beforeEach(async ({ page }) => {

  // Login
  await page.goto('https://advisor.forastaging.net/');
  await page.locator("a:has-text('Sign in here')").click();

  await page.waitForSelector('#username', { timeout: 20000 });
  await page.locator('#username').fill('mythili+030226@qaoncloud.com');
  await page.locator('#password').fill('Qaoncloud@01');
  await page.locator("button[type='submit']:has-text('Sign in')").click();

  // Home validation
  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();

  // Navigate to Trips
  await page.locator('[data-testid="nav_bar_search"]').click();
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('trips');

  await page.waitForSelector("text=Trips", { timeout: 15000 });
  await page.locator('#page-2').click();

  await page.waitForSelector(
    "//span[normalize-space()='Create trip']",
    { timeout: 20000 }
  );
});


// ==================================================
// Test — Create Test01 
// ==================================================
test('Create Test01 trip', async ({ page }) => {

  await page.locator("//span[normalize-space()='Create trip']").click();

  await page.fill("input[placeholder='Enter name']", 'Test01');
  await expect(page.locator("//div[contains(@class,'text-subheader')]"))
    .toHaveText('Test01');

  await page.locator("button[data-testid='select-trip-reason']").click();
  await page.locator("//div[contains(text(),'Anniversary')]").click();

  await page.locator("//button[normalize-space()='Estimated']").click();
  await page.locator("[data-testid='select-select-estimated-travel-month']").click();
  await page.locator("text=February 2026").click();

  // e) Enable Create Trip button and click
  await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();
  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);

  // Optional: wait for trip details to load
  await page.waitForTimeout(2000);

  // 1) Validate trip name on the current page (before back)
  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });
  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText('Test01');

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
await expect(tripNameLocator).toContainText('Test01');

console.log('Trip name "Test01" successfully validated on Trips page');

});

// ==================================================
// AfterEach — Merge Trip Flow
// ==================================================
test.afterEach(async ({ page }) => {

  // Open first trip menu
  await page.locator('button[aria-haspopup="dialog"]').first().click();

  // Click Merge into another trip
  const mergeButton = page.getByRole('button', { name: 'Merge into another trip' });
  await expect(mergeButton).toBeVisible();
  await mergeButton.click();

// 1) Click on "New trip" button
await page.waitForSelector("//button[normalize-space()='New trip']", {
  timeout: 15000
});
await page.locator("//button[normalize-space()='New trip']").click();

// 2) Wait a bit, then enter trip name
await page.waitForSelector("//input[@id='new-trip-name']", {
  timeout: 15000
});
await page.fill("//input[@id='new-trip-name']", 'Test04');

// (Optional but recommended) small wait for UI stability
await page.waitForTimeout(500);

// 3) Click on "Create" button
await page.waitForSelector("//button[normalize-space()='Create']", {
  timeout: 15000
});
await page.locator("//button[normalize-space()='Create']").click();
await page.waitForTimeout(3000);

// Search Test04
await page.locator('div.flex.flex-col.gap-y-1.grow input').fill('Test04');

// Select first trip card (force click due to overlay) 
/*const tripCards = page.locator('[data-testid="trip-card"]'); 
await expect(tripCards.first()).toBeVisible(); 
await tripCards.first().click({ force: true });*/

//After search select the Test04
const tripCards = page.locator('[data-testid="trip-card"]');

// wait until at least one card is visible
await expect(tripCards.first()).toBeVisible();

// select Test04 specifically
const test04Card = tripCards.filter({ hasText: 'Test04' });

await test04Card.first().click({ force: true });

// 5) Click Merge trips
const mergeTripsBtn = page.locator("//button[normalize-space()='Merge trips']");
await expect(mergeTripsBtn).toBeVisible();
await mergeTripsBtn.click({ force: true });

  // 6) Validate confirmation text
  const confirmationText = page.getByText(
    'Are you sure you want to merge?',
    { exact: true }
  );
  await expect(confirmationText).toBeVisible();

  // 7) Click final Merge
  await page.locator("//button[normalize-space()='Merge']").click({ force: true });

  // Validate & print confirmation section
  const section = page.locator('div.overflow-x-hidden');
  await expect(section).toBeVisible();

  console.log('Merge confirmation section:\n', await section.innerText());

   // 8) Click Back Arrow to go to Trips page
  const backArrow = page.locator("//a[@aria-label='Back']//*[name()='svg']");
  await backArrow.click();

  await expect(page.getByText('Test04').first()).toBeVisible();
  console.log('Merge successful — Test04 exists after merge');
});
