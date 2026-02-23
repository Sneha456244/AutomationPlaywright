// npx playwright test ./Fora/BookingPage.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');

test.setTimeout(90000);

// ==================================================
// Before Each Hook — Login & Navigate to Partner
// ==================================================
test.beforeEach(async ({ page }) => {

  // ===============================
  // 1) Login Section
  // ===============================

  // Open Fora Advisor Portal
  await page.goto('https://advisor.forastaging.net/');
  await page.waitForTimeout(500);

  // Click "Sign in here" link
  await page.locator("a:has-text('Sign in here')").click();
  await page.waitForTimeout(500);

  // Wait for Login form to load
  await page.waitForSelector('#username', { timeout: 20000 });
  await page.waitForTimeout(500);

  // Enter Username
  await page.locator('#username').fill('lakshmi@qaoncloud.com');
  await page.waitForTimeout(500);

  // Enter Password
  await page.locator('#password').fill('Qaoncloud@01');
  await page.waitForTimeout(500);

  // Click Sign In button
  await page.locator("button[type='submit']:has-text('Sign in')").click();
  await page.waitForTimeout(500);

  // ===============================
  // 2) Home Page Validation Section
  // ===============================

  // Wait for Home page to load
  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });
  await page.waitForTimeout(500);

  // Verify Home heading is visible
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();
  await page.waitForTimeout(500);

  // ===============================
  // 3) Click on Search
  // ===============================
  await page.locator('[data-testid="nav_bar_search"]').click();
  await page.waitForTimeout(500);

  // Wait for search input to appear
  await page.waitForSelector("input[type='search'], input[placeholder*='Search']", { timeout: 20000 });
  await page.waitForTimeout(500);

  // Type "partners" in search
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('bookings');
  await page.waitForTimeout(500);

  // Wait for partners result
  await page.waitForSelector("text=bookings", { timeout: 10000 });
  await page.waitForTimeout(500);

  // Click on Partners — first element
  await page.locator("//button[.//text()[contains(.,'Bookings')]]").nth(0).click();
  await page.waitForTimeout(500);
});
test('Bookings Page ', async ({ page }) => {

  await expect(page.locator("//h1[contains(.,'Bookings')]")).toBeVisible(); 
  await page.waitForTimeout(500);

  const upcomingCheckbox = page.locator("//div[normalize-space()='Upcoming']//input[@type='checkbox']");

  await upcomingCheckbox.waitFor({ state: 'visible' });
  await upcomingCheckbox.click({ force: true });
  await page.waitForTimeout(1000);

  await expect(page.locator("button[aria-haspopup='dialog']").nth(1)).toBeVisible();
  await page.locator("button[aria-haspopup='dialog']").nth(1).click({ force: true });
  await page.waitForTimeout(3000);

  const moveTripBtn = page.locator("//button[normalize-space()='Move to another trip']");

  await moveTripBtn.waitFor({ state: 'visible' });
  await moveTripBtn.click();
  await page.waitForTimeout(1000);

/*await page.waitForLoadState('networkidle');

const bookingCards = page.locator("[data-testid^='booking-card-']");
await expect(bookingCards.first()).toBeVisible({ timeout: 15000 });
await bookingCards.first().click();
await page.waitForTimeout(1000);

//a) Click on Merge Trip icon in detailed Trip page
// Click the second icon button
await page.locator("[data-testid='icon-button']").nth(1).click();
await page.waitForTimeout(500); // optional wait after click */

// b) Select first trip card (force click due to overlay) 
const tripCards = page.locator('[data-testid="trip-card"]'); 
await expect(tripCards.first()).toBeVisible(); 
await tripCards.first().click({ force: true });
await page.waitForTimeout(1000);

// c) Click on the Move Booking button
const moveBookingBtn = page.locator("//button[normalize-space()='Move booking']");

await expect(moveBookingBtn).toBeVisible();
await moveBookingBtn.click();
await page.waitForTimeout(1000);

// d) Close modal safely
await page.getByRole('button', { name: 'Cancel' })
  .click({ timeout: 3000 })
  .catch(() => console.log("Cancel button not visible"));
  await page.waitForTimeout(1000);

// e) Back to  Bookings
const backBtn = page.locator("[data-testid='header-back-button']");

await backBtn.waitFor({ state: 'visible' });
await backBtn.click();
await page.waitForTimeout(2000);

});

// ==================================================
// After Each Hook — Validate Booking Details
// ==================================================
test.afterEach(async ({ page }) => {

const firstBookingCard = page.locator("[data-testid^='booking-card-']").first();
await expect(firstBookingCard).toBeVisible();

console.log("First Booking Card Details:");
console.log(await firstBookingCard.innerText());
await page.waitForTimeout(3000);

  
});
