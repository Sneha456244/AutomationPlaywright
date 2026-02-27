// npx playwright test ./Fora/ListsToBooking.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');

test.setTimeout(90000);

// ==================================================
// Before Each Hook — Login & Navigate to Partner
// ==================================================
test.beforeEach(async ({ page }) => {

  await page.goto('https://advisor.forastaging.net/');
  await page.waitForTimeout(500);

  await page.locator("a:has-text('Sign in here')").click();
  await page.waitForTimeout(500);

  await page.waitForSelector('#username', { timeout: 20000 });
  await page.waitForTimeout(500);

  await page.locator('#username').fill('lakshmi@qaoncloud.com');
  await page.waitForTimeout(500);

  await page.locator('#password').fill('Qaoncloud@01');
  await page.waitForTimeout(500);

  await page.locator("button[type='submit']:has-text('Sign in')").click();
  await page.waitForTimeout(500);

  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });
  await page.waitForTimeout(500);

  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();
  await page.waitForTimeout(500);

  await page.locator('[data-testid="nav_bar_search"]').click();
  await page.waitForTimeout(500);

  await page.waitForSelector("input[type='search'], input[placeholder*='Search']", { timeout: 20000 });
  await page.waitForTimeout(500);

  await page.locator("input[type='search'], input[placeholder*='Search']").fill('partners');
  await page.waitForTimeout(500);

  await page.waitForSelector("text=partners", { timeout: 10000 });
  await page.waitForTimeout(500);

  await page.locator("//button[.//text()[contains(.,'Partners')]]").nth(0).click();
  await page.waitForTimeout(500);
});

// ==================================================
// MAIN TEST
// ==================================================
test('Lists -> Fav -> Booking', async ({ page }) => {

  await expect(page.locator("//h1[contains(.,'Partners')]")).toBeVisible();
  await page.waitForTimeout(500);

  await page.locator(
  '[data-testid="favorites-list-button"][aria-label="Add to favorites"]').first().click();
  await page.waitForTimeout(1000);

  await page.locator("div.flex.flex-col.cursor-pointer").nth(1).click();
  await page.waitForTimeout(1000);  

  await page.locator("//button[text()='Save']").click();
  await page.waitForTimeout(1000); 

  await page.locator('[data-testid="nav_bar_lists"]').click();
  await page.waitForTimeout(1000);

  await page
  .locator('[data-testid="main-partners-page"] a')
  .nth(1)
  .click();
  await page.waitForTimeout(1000);

  await page.locator('p:has-text("Add dates to see rates")').nth(0).click();
  await page.waitForTimeout(2000);

  await page.locator('[data-testid="view-rates-button"]').click();
  await page.waitForTimeout(1000);

  await page.locator('[data-testid="search-when"]').click();
  await page.waitForTimeout(1000);

  const marchDates = page.locator('div:has-text("March 2026")')
  .locator('button:not([disabled])');

  const count = await marchDates.count();

  const random1 = Math.floor(Math.random() * count);
  let random2 = Math.floor(Math.random() * count);

  while (random1 === random2) {
  random2 = Math.floor(Math.random() * count);
  }

  await marchDates.nth(random1).click();
  await marchDates.nth(random2).click();
  await page.waitForTimeout(1000);

  await page.locator('[data-testid="search-bar-search"]').click();
  await page.waitForTimeout(1000);

  // Click on the Tab ->  under rates section
  await page.locator("li[data-program-id] a:has-text('Expedia')").click();
  await page.waitForTimeout(3000);

  // In that Tab select the first rates
  await page.locator("div[data-testid='rates-list-item']").first().click();
  await page.waitForTimeout(3000);

  // Wait for button
  await page.waitForSelector("//button[@id='scrollToBook']");

  // Click scrollToBook
  await page.locator("//button[@id='scrollToBook']").click();
  await page.waitForTimeout(500);

  // Click on the Continue button 
  await page.locator("//button[normalize-space()='Continue']").click();
  await page.waitForTimeout(1000);

  // Wait for checkout client name
  await page.waitForSelector("//span[@class='truncate']");
  await page.waitForTimeout(500);

  // Validate client name is visible
  await expect(page.locator("//span[@class='truncate']")).toBeVisible();
  await page.waitForTimeout(500);

  await page.waitForSelector("div.truncate:has-text('lakshmi Client testing')");

  // Hover to client name
  await page.locator("div.truncate:has-text('lakshmi Client testing')").hover();
  await page.waitForTimeout(500);

  // Click -> clientname
  await page.locator("div.truncate:has-text('lakshmi Client testing')").click();
  await page.waitForTimeout(1000);

  // Payment cards appears after client name selected
  await page.waitForSelector("//input[@type='radio']");
  await page.waitForTimeout(500);

  // Select radio option
  await page.locator("//input[@type='radio']").first().check();
  await page.waitForTimeout(1000);

  await page.waitForSelector("(//input[@type='radio'])[2]");
  await page.waitForTimeout(500);

  // Select 2nd radio button
  await page.locator("(//input[@type='radio'])[2]").check();
  await page.waitForTimeout(1000);

  // Scroll down -> click on Booking Completed button 
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  await page.waitForSelector("//button[normalize-space()='Complete Booking']");
  await page.waitForTimeout(500);

  await page.locator("//button[normalize-space()='Complete Booking']").click();
  await page.waitForTimeout(1000);

});

// =====================================================
// After Each Hook — validate Confirmation msg & Details
// =====================================================

test.afterEach(async ({ page }) => 
{

  // Wait for confirmation message
  await page.waitForSelector("text=Booking Confirmed", { timeout: 15000 });
  await page.waitForTimeout(500);

  // Validate message is visible
  await expect(page.locator("text=Booking Confirmed")).toBeVisible();
  await page.waitForTimeout(1000);

  // Validate Booking Title
  const bookingTitle = page.locator("//h1[contains(text(),'Hotel booking for lakshmi Client testing')]");

  await bookingTitle.waitFor({ state: 'visible' });
  await expect(bookingTitle).toBeVisible();

  // Print Booking Title
  console.log("Booking Title:", await bookingTitle.innerText());

  await page.waitForTimeout(500);

  const hotelName = page.locator('[data-testid="supplier-link"]');
  await expect(hotelName).toBeVisible();
  const hotelText = await hotelName.innerText();
  console.log("Hotel Name:", hotelText);

});
