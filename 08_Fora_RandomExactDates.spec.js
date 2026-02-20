//npx playwright test ./Fora/RandomExactDates.spec.js --project=chromium --headed 
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

// ================= RANDOM DATE GENERATOR =================
function getRandomFutureDates() {

  const today = new Date();
  const futureYear = today.getFullYear() + Math.floor(Math.random() * 3) + 1;
  const month = Math.floor(Math.random() * 12);

  const checkInDay = Math.floor(Math.random() * 20) + 1;
  const checkOutDay = checkInDay + 2;

  const checkInDate = new Date(futureYear, month, checkInDay);
  const checkOutDate = new Date(futureYear, month, checkOutDay);

  return { checkInDate, checkOutDate };
}


// ================= FORMAT FOR CALENDAR =================
function formatDateForAria(date) {

  const day = date.getDate();

  const suffix =
    day === 1 || day === 21 || day === 31 ? 'st' :
    day === 2 || day === 22 ? 'nd' :
    day === 3 || day === 23 ? 'rd' : 'th';

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${weekday}, ${month} ${day}${suffix}, ${year}`;
}

function formatSummary(checkIn, checkOut) {

  const sameMonth =
    checkIn.getMonth() === checkOut.getMonth() &&
    checkIn.getFullYear() === checkOut.getFullYear();

  const monthShort = checkIn.toLocaleDateString('en-US', { month: 'short' });

  const startDay = checkIn.getDate();
  const endDay = checkOut.getDate();

  const nights =
    Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  if (sameMonth) {
    return `${monthShort} ${startDay} - ${endDay}, ${checkIn.getFullYear()}·${nights} nights·Anniversary`;
  } else {

    const endMonthShort = checkOut.toLocaleDateString('en-US', { month: 'short' });

    return `${monthShort} ${startDay} - ${endMonthShort} ${endDay}, ${checkIn.getFullYear()}·${nights} nights·Anniversary`;
  }
}

test('TC-02: Create trip with EXACT DATES and trip reason', async ({ page }) => {

  // Enter Trip Name
  const tripName = 'PARIS Trip';
  await page.fill("input[placeholder='Enter name']", tripName);

  await expect(page.locator("input[placeholder='Enter name']")).toHaveValue(tripName);
  await expect(page.locator("//div[contains(@class,'text-subheader')]")).toHaveText(tripName);
  await expect(page.locator("//div[contains(@class,'text-subheader')]")).not.toHaveText('paris trip');


  // Select Trip Reason
  await page.locator("button[data-testid='select-trip-reason']").click();
  await page.waitForTimeout(800);   // ⏳ animation wait

  await page.locator("//div[contains(text(),'Anniversary')]").click();
  await page.waitForTimeout(800);   // ⏳ summary update wait

  const summaryCard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(summaryCard).toContainText('Anniversary');
  await expect(summaryCard).not.toContainText('Birthday');

  // Generate Random Dates
  const { checkInDate, checkOutDate } = getRandomFutureDates();

  const checkInLabel = formatDateForAria(checkInDate);
  const checkOutLabel = formatDateForAria(checkOutDate);

  console.log("Check-in:", checkInLabel);
  console.log("Check-out:", checkOutLabel);


  // Open Calendar
  const calendar = page.locator("//div[@role='button' and @data-headlessui-state]");
  await expect(calendar).toBeVisible();
  await calendar.click();

  await page.waitForSelector("//div[@data-headlessui-state='open']");


  // Navigate to Check-in Date
  while (!(await page.locator(`//button[@aria-label='${checkInLabel}']`).isVisible())) {
    await page.locator("//button[@aria-label='Go to the Next Month']").click();
  }
  await page.locator(`//button[@aria-label='${checkInLabel}']`).click();


  // Navigate to Check-out Date
  while (!(await page.locator(`//button[@aria-label='${checkOutLabel}']`).isVisible())) {
    await page.locator("//button[@aria-label='Go to the Next Month']").click();
  }
  await page.locator(`//button[@aria-label='${checkOutLabel}']`).click();


  // Validate Summary
  const expectedSummary = formatSummary(checkInDate, checkOutDate);
  await expect(summaryCard).toHaveText(expectedSummary);

 // e) Enable Create Trip button and click
 await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();

 // Assertion 5 — Button visible
 await expect(page.locator("button:has-text('Create Trip')")).toBeVisible();

  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);
});
  
// ==================================================
// Post-Test Hook — Validate Trip Name, Trip Reason & Exact Date
// ==================================================

test.afterEach(async ({ page }) => {

  await page.waitForTimeout(2000);

  // -------------------------------
  // a) Trip Name Validation
  // -------------------------------
  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await tripNameDetail.waitFor({ state: 'visible', timeout: 10000 });

  // Visible check
  await expect(tripNameDetail).toBeVisible();

  // Exact match
  await expect(tripNameDetail).toHaveText('PARIS Trip');

  // Case-sensitive validation
  await expect(tripNameDetail).not.toHaveText('paris trip');

  // No extra spaces validation
  await expect(tripNameDetail).toHaveText(/^PARIS Trip$/);


  // -------------------------------
  // b) Trip Reason Validation
  // -------------------------------
  const tripReasonDetail = page.locator("//button[normalize-space()='Anniversary']");

  // Visible check
  await expect(tripReasonDetail).toBeVisible();

  // Exact match
  await expect(tripReasonDetail).toHaveText('Anniversary');

  // Ensure only one reason is saved
  await expect(tripReasonDetail).toHaveCount(1);

  // Ensure incorrect reason is not saved
  await expect(page.locator("//button[normalize-space()='Birthday']")).toHaveCount(0);


  // -------------------------------
  // c) Exact Date Summary Validation
  // -------------------------------
  const tripSummary = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");

  // Visible check
  await expect(tripSummary).toBeVisible();

  await page.waitForTimeout(3000);

});
