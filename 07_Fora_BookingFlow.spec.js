//npx playwright test ./Fora/BookingFlow.spec.js --project=chromium --headed
const { test, expect } = require('@playwright/test');

test.setTimeout(90_000); // 90 seconds

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
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('partners');
  await page.waitForTimeout(500);

  // Wait for partners result
  await page.waitForSelector("text=partners", { timeout: 10000 });
  await page.waitForTimeout(500);

  // Click on Partners — first element
  await page.locator("//button[.//text()[contains(.,'Partners')]]").nth(0).click();
  await page.waitForTimeout(500);
});

// =========================================================================
// Login & Navigate to Partner -> Detailed Hotel page -> Checkout -> Booking
// =========================================================================
test('Partner to Booking Flow', async ({ page }) => 
  
{
  // user is on "Partners page"
  console.log('Navigated to Partners page successfully');
  await expect(page.locator("//h1[contains(.,'Partners')]")).toBeVisible();
  await page.waitForTimeout(500);

// a) Fill "Roxy" in 'WHERE field'
await page.locator("input[data-dd-privacy='allow'][placeholder='Partner or destination']").fill('Roxy');
await page.waitForTimeout(500);

// b) Click 'WHEN field' -> Date picker opens -> select date
await page.locator("input[data-dd-privacy='allow'][placeholder='Add dates']").click();
await page.waitForTimeout(500);

// Navigate until August 2026 appears
while (!(await page.locator("//button[@aria-label='Saturday, August 1st, 2026']").isVisible())) 
{
  await page.locator("//button[@aria-label='Go to the Next Month']").click();
  await page.waitForTimeout(500);
}

// Select Check-in: August 1
await page.locator("//button[@aria-label='Saturday, August 1st, 2026']").click();
await page.waitForTimeout(500);

// Select Check-out: August 2
await page.locator("//button[@aria-label='Sunday, August 2nd, 2026']").click();
await page.waitForTimeout(500);

// c) "WHO" is added by defalut -> if user click on Search button
await page.locator("button[data-testid='search-bar-search']").click();
await page.waitForTimeout(3000);

// d) Click First Hotel Card
await page.locator("a[data-testid^='supplier-card-']").first().click();
await page.waitForTimeout(3000);

// Scroll to top
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// e) Validate hotel name -> Wait for hotel name
await page.waitForSelector("text=The Roxy Hotel New York", { timeout: 15000 });

// Assertion 1 -> Visible
await expect(page.locator("text=The Roxy Hotel New York").first()).toBeVisible();

// Assertion 2 -> Exact Text Match
await expect(page.locator("text=The Roxy Hotel New York").first())
      .toHaveText('The Roxy Hotel New York');

await page.waitForTimeout(3000);

// f) Click Find rates button
await page.locator("button[data-testid='search-bar-search']").click();
await page.waitForTimeout(500);

// g) Click on the Tab -> Tablet Plus under rates section
await page.locator("li[data-program-id] a:has-text('Tablet Plus')").click();
await page.waitForTimeout(3000);

// In that Tab select the first rates
await page.locator("div[data-testid='rates-list-item']").first().click();
await page.waitForTimeout(3000);

// Wait for button
await page.waitForSelector("//button[@id='scrollToBook']");

// h) Click scrollToBook
await page.locator("//button[@id='scrollToBook']").click();
await page.waitForTimeout(500);

// i) Click on the Continue button 
await page.locator("//button[normalize-space()='Continue']").click();
await page.waitForTimeout(500);

// Validate modal open via title
await page.waitForSelector("//h3[normalize-space()='Book on Tablet Pro']");
await expect(page.locator("//h3[normalize-space()='Book on Tablet Pro']")).toBeVisible();
await page.waitForTimeout(1000);

// j) Close modal
await page.locator("//button[normalize-space()='Close']").click();
await page.waitForTimeout(1000);

// k) Click on the Tab ->  under rates section
await page.locator("li[data-program-id] a:has-text('THOR')").click();
await page.waitForTimeout(3000);

// l) In that Tab select the first rates
await page.locator("div[data-testid='rates-list-item']").first().click();
await page.waitForTimeout(3000);

// Wait for button
await page.waitForSelector("//button[@id='scrollToBook']");

// m) Click scrollToBook
await page.locator("//button[@id='scrollToBook']").click();
await page.waitForTimeout(500);

// n) Click on the Continue button 
await page.locator("//button[normalize-space()='Continue']").click();
await page.waitForTimeout(1000);

// Wait for checkout client name
await page.waitForSelector("//span[@class='truncate']");
await page.waitForTimeout(500);

// o) Validate client name is visible
await expect(page.locator("//span[@class='truncate']")).toBeVisible();
await page.waitForTimeout(500);

await page.waitForSelector("div.truncate:has-text('lakshmi Client testing')");

// Hover to client name
await page.locator("div.truncate:has-text('lakshmi Client testing')").hover();
await page.waitForTimeout(500);

// p) Click -> clientname
await page.locator("div.truncate:has-text('lakshmi Client testing')").click();
await page.waitForTimeout(1000);

// q) Payment cards appears after client name selected
await page.waitForSelector("//input[@type='radio']");
await page.waitForTimeout(500);

// r) Select radio option
await page.locator("//input[@type='radio']").first().check();
await page.waitForTimeout(1000);

await page.waitForSelector("(//input[@type='radio'])[2]");
await page.waitForTimeout(500);

// s) Select 2nd radio button
await page.locator("(//input[@type='radio'])[2]").check();
await page.waitForTimeout(1000);

// t) Scroll down -> click on Booking Completed button 
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

  const hotelName = page.getByText('The Roxy Hotel New York');

  await hotelName.waitFor({ state: 'visible' });

  console.log("Hotel Name:", await hotelName.innerText());

});

