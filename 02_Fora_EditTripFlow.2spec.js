//npx playwright test ./Fora/EditTripFlow2.spec.js --project=chromium --headed 
const { test, expect } = require('@playwright/test');
const { asyncWrapProviders } = require('node:async_hooks');

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
// Test Case 02 — Create trip with travelers, dates, and trip reason
// ==================================================
test('TC-02: Create trip with travelers, dates, and trip reason', async ({ page }) => {

  // a) Enter Trip Name
  const tripName = 'Paris Trip';
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
  await page.waitForTimeout(3000);

// ==================================================
// EDIT EXISTING TRIP NAME (travelers, dates, and trip reason)-TODAY TASK
// ==================================================

// 1) Click on Edit icon
const editIcon = page.locator("//div[@class='hidden tablet:inline-block']");
await editIcon.waitFor({ state: 'visible', timeout: 10000 });
await editIcon.click();

// 2) Wait for Edit Trip modal to open
await page.waitForSelector("text=Edit trip details", { timeout: 10000 });

// 3) Wait for Trip Name input (Edit modal)
const editTripNameInput = page.locator("input[placeholder='Enter name']");
await editTripNameInput.waitFor({ state: 'visible', timeout: 10000 });

// 4) Update Trip Name
await editTripNameInput.fill('Paris Dream');

// 5) UPDATE ESTIMATED DATE (Edit modal)

// Wait for Edit Trip modal
await page.waitForSelector("text=Edit trip details", { timeout: 10000 });

// Click Estimated date selector
const estimatedDateBtn = page.locator(
  "button[data-testid='select-select-estimated-travel-month']"
);

await estimatedDateBtn.waitFor({ state: 'visible', timeout: 10000 });
await estimatedDateBtn.click();

// Wait for listbox to open
const estimatedListbox = page.locator("[role='listbox']");
await estimatedListbox.waitFor({ state: 'visible', timeout: 5000 });

// Select December 2026 (NO scrollIntoView)
const decemberOption = estimatedListbox.locator("text=December 2026");
await decemberOption.waitFor({ state: 'visible', timeout: 5000 });
await decemberOption.click();

await page.waitForTimeout(1000);

// 6) UPDATE TRIP REASON (Edit modal)

// Click Trip reason selector
const TripReasonBtn = page.locator(
  "button[data-testid='select-trip-reason']"
);

await TripReasonBtn.waitFor({ state: 'visible', timeout: 10000 });
await TripReasonBtn.click();

// Wait for trip reason listbox
const reasonListbox = page.locator("[role='listbox']");
await reasonListbox.waitFor({ state: 'visible', timeout: 5000 });

// Select "Solo trip"
const soloTripOption = reasonListbox.locator("text=Solo trip");
await soloTripOption.waitFor({ state: 'visible', timeout: 5000 });
await soloTripOption.click();

// 7) Wait for Save button to be enabled and click
/*const saveButton = page.locator(
    "//footer[@class='w-full flex p-4 border-t border-border-primary justify-between']//button[@type='button'][normalize-space()='Save']"
  );

await saveButton.waitFor({ state: 'visible', timeout: 10000 });
await saveButton.click();*/

const saveButton = page.locator(
  "//footer[@class='w-full flex p-4 border-t border-border-primary justify-between']//button[@type='button'][normalize-space()='Save']"
);

// Wait for Save button to appear
await saveButton.waitFor({ state: 'visible', timeout: 10000 });

// Extra wait to ensure it's enabled & clickable
await expect(saveButton).toBeEnabled({ timeout: 10000 });

// Small buffer for UI animation/state update
await page.waitForTimeout(500);

// Click Save
await saveButton.click();

// Wait for Edit Trip modal to close
//await editModal.waitFor({ state: 'detached', timeout: 15000 });

// Validate updated trip name on details page
const updatedTripName = page.locator("//span[@class='break-words overflow-hidden']");
await updatedTripName.waitFor({ state: 'visible', timeout: 10000 });
await expect(updatedTripName).toHaveText('Paris Dream');

});

// ===============================
// After Each Hook — Back and Validate Another Page
// ===============================
test.afterEach(async ({ page }) => {

  await page.waitForTimeout(3000);

  // 1) Click Back Arrow to go to Trips page
  const backArrow = page.locator("//a[@aria-label='Back']//*[name()='svg']");
  
  if (await backArrow.isVisible()) 
    {
    await backArrow.click();
    }

  // 2) Locate trip name (first match)
  const tripNameLocator = page
    .locator("//span[contains(@class,'w-0 grow text-wrap tablet:truncate font-semibold')]")
    .first();

  await tripNameLocator.waitFor({ state: 'visible', timeout: 10000 });

  await expect(tripNameLocator).toContainText('Paris Dream');

  console.log('Trip name "Paris Dream" successfully validated on Trips page');
});
