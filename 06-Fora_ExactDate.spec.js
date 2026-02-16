//npx playwright test ./Fora/ExactDate.spec.js --project=chromium --headed 
const { test, expect } = require('@playwright/test');

//test.setTimeout(90_000); // 90 seconds

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

test('TC-02: Create trip with travelers, "EXACT DATES", and trip reason', async ({ page }) => {

  // a) Enter Trip Name
  const tripName = 'PARIS Trip';
  await page.fill("input[placeholder='Enter name']", tripName);

  // Assertion 1 — Input value check
  await expect(page.locator("input[placeholder='Enter name']")).toHaveValue(tripName);

  await expect(page.locator("//div[contains(@class,'text-subheader')]")).toHaveText(tripName);

  // Assertion 2 — Case-sensitive preview check
  await expect(page.locator("//div[contains(@class,'text-subheader')]")).not.toHaveText('paris trip');

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

 //........................................
 // Click on Exact Dates field 
 //.........................................

  const exactDateDropdown = page.locator("//div[@role='button' and @data-headlessui-state]");
  await expect(exactDateDropdown).toBeVisible({ timeout: 15000 });
  await exactDateDropdown.click();

  await page.waitForTimeout(500);

 await page.waitForSelector("//div[@data-headlessui-state='open']");

 // Navigate until April appears
 while (!(await page.locator("//button[@aria-label='Friday, April 24th, 2026']").isVisible())) 
 {
    await page.locator("//button[@aria-label='Go to the Next Month']").click();
 }

 // Select dates
 await page.locator("//button[@aria-label='Friday, April 24th, 2026']").click();
 await page.locator("//button[@aria-label='Sunday, April 26th, 2026']").click();

 await page.waitForTimeout(500);

 //Summarycard validation
  const SummaryCard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(SummaryCard).toHaveText('Apr 24 - 26, 2026·2 nights·Anniversary');

 // Negative validation
 await expect(SummaryCard).not.toContainText('January');

 // e) Enable Create Trip button and click
 await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();

 // Assertion 5 — Button visible
 await expect(page.locator("button:has-text('Create Trip')")).toBeVisible();

  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);
});
  
// ==================================================
// After Each Hook — Validate Trip Name , Trip Reason , EXACT Date
// ==================================================

test.afterEach(async ({ page }) => {

  await page.waitForTimeout(2000);

  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });

  // a) Trip Name Validation
  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText('PARIS Trip');

  // Case-sensitive validation
  await expect(tripNameDetail).not.toHaveText('paris trip');

  // No leading / trailing spaces
  await expect(tripNameDetail).toHaveText(/^PARIS Trip$/);
  
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

 // c) EXACT Date Validation
 const tripSummary = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");

 // Visible
 await expect(tripSummary).toBeVisible();

 // Exact Date present
 await expect(tripSummary).toContainText('Apr 24 - 26, 2026');

 // Nights present
 await expect(tripSummary).toContainText('2 nights');

 // Ensure wrong month not saved
 await expect(tripSummary).not.toContainText('January 2026');

 await page.waitForTimeout(1000);

 // Ensure summary not empty
 await expect(tripReasonDetail).not.toBeEmpty();

 await page.waitForTimeout(1000);
});
