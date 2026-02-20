//npx playwright test ./Fora/BookingDetailedPage.spec.js --project=chromium --headed
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

// ===================================================================================================
// Login & Navigate to Partner -> Detailed Hotel page -> Checkout -> Booking -> Booking Detailed Page
// ===================================================================================================
test('Partner to Booking Flow', async ({ page }) => 
  
{
  // user is on "Partners page"
  console.log('Navigated to Partners page successfully');
  await expect(page.locator("//h1[contains(.,'Partners')]")).toBeVisible();
  await page.waitForTimeout(500);

// 1 a) Fill "Roxy" in 'WHERE field'
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
await page.waitForTimeout(1000);

// g) Click on the Tab ->  under rates section
await page.locator("li[data-program-id] a:has-text('THOR')").click();
await page.waitForTimeout(3000);

// h) In that Tab select the first rates
await page.locator("div[data-testid='rates-list-item']").first().click();
await page.waitForTimeout(3000);

// Wait for button
await page.waitForSelector("//button[@id='scrollToBook']");

// i) Click scrollToBook
await page.locator("//button[@id='scrollToBook']").click();
await page.waitForTimeout(500);

// j) Click on the Continue button 
await page.locator("//button[normalize-space()='Continue']").click();
await page.waitForTimeout(1000);

// Wait for checkout client name
await page.waitForSelector("//span[@class='truncate']");
await page.waitForTimeout(500);

// k) Validate client name is visible
await expect(page.locator("//span[@class='truncate']")).toBeVisible();
await page.waitForTimeout(500);

await page.waitForSelector("div.truncate:has-text('lakshmi Client testing')");

// Hover to client name
await page.locator("div.truncate:has-text('lakshmi Client testing')").hover();
await page.waitForTimeout(500);

// l) Click -> clientname
await page.locator("div.truncate:has-text('lakshmi Client testing')").click();
await page.waitForTimeout(1000);

// m) Payment cards appears after client name selected
await page.waitForSelector("//input[@type='radio']");
await page.waitForTimeout(500);

// n) Select radio option
await page.locator("//input[@type='radio']").first().check();
await page.waitForTimeout(1000);

await page.waitForSelector("(//input[@type='radio'])[2]");
await page.waitForTimeout(500);

// o) Select 2nd radio button
await page.locator("(//input[@type='radio'])[2]").check();
await page.waitForTimeout(1000);

// p) Scroll down -> click on Booking Completed button 
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(500);

await page.waitForSelector("//button[normalize-space()='Complete Booking']");
await page.waitForTimeout(500);

await page.locator("//button[normalize-space()='Complete Booking']").click();
await page.waitForTimeout(1000);

// q) Validate Booking Title
const bookingTitle = page.locator("//h1[contains(text(),'Hotel booking for lakshmi Client testing')]");
await bookingTitle.waitFor({ state: 'visible' });
await expect(bookingTitle).toBeVisible();

// r) Print Booking Title
console.log("Booking Title:", await bookingTitle.innerText());
await page.waitForTimeout(500);
const hotelName = page.getByText('The Roxy Hotel New York');
await hotelName.waitFor({ state: 'visible' });
console.log("Hotel Name:", await hotelName.innerText());
await page.waitForTimeout(4000);

//=================================================================
//                BOOKING DETAILED PAGE 
//=================================================================


//--------------------Cancel the Bookoing-----------------------------

// 2) a) In the Detailed page click on Manage Booking section
const manageBooking = page.locator('[data-testid="rowbutton-Manage booking"]');

await expect(manageBooking).toBeVisible();
await manageBooking.click();
await page.waitForTimeout(2000);

// b) Click on "Cancel booking"
const cancelBookingOption = page.locator("//span[normalize-space()='Cancel booking']");

await cancelBookingOption.waitFor({ state: 'visible', timeout: 15000 });
await cancelBookingOption.scrollIntoViewIfNeeded();
await cancelBookingOption.click();

await page.waitForTimeout(500);

// c) wait + click on: "I want to cancel this booking using Portal"
const cancelBookingBtn = page.locator("//button[@name='I want to cancel this booking using Portal']");

// Wait for accordion content
await cancelBookingBtn.waitFor({ state: 'attached', timeout: 15000 });
await cancelBookingBtn.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

await cancelBookingBtn.click();
await page.waitForTimeout(500);

// d) click on "next"
const nextBtn = page.locator("//button[normalize-space()='Next']");

await expect(nextBtn).toBeVisible();
await nextBtn.click();

// e) To click on this specific radio button
const reasonRadio = page.locator("//input[@data-testid='reason-radio-button_test1']");

await reasonRadio.waitFor({ state: 'visible', timeout: 10000 });
await reasonRadio.click();

// f) click on cancelBooking Btn 
const cancelBookingBtn1 = page.locator("//button[normalize-space()='Cancel this booking']");

await expect(cancelBookingBtn1).toBeVisible();
await cancelBookingBtn1.click();

console.log("Cancel this booking button clicked");
await page.waitForTimeout(500);

// g) Wait until redirected back to booking details page
const canceledBadge = page.locator("[data-testid='badge-negative']");

await canceledBadge.waitFor({ state: 'visible', timeout: 15000 });
await expect(canceledBadge).toContainText('Canceled');

await page.waitForTimeout(500);

//-------------------------------Merge Booking-------------------------

// 3) a) Click on Merge Trip icon in detailed Trip page
// Click the second icon button
/*await page.locator("[data-testid='icon-button']").nth(1).click();
await page.waitForTimeout(500); // optional wait after click

// b) Select first trip card (force click due to overlay) 
const tripCards = page.locator('[data-testid="trip-card"]'); 
await expect(tripCards.first()).toBeVisible(); 
await tripCards.first().click({ force: true });

// c) Click on the Move Booking button
const moveBookingBtn = page.locator("//button[normalize-space()='Move booking']");

await expect(moveBookingBtn).toBeVisible();
await moveBookingBtn.click();
await page.waitForTimeout(500);

// d) Close modal 
const cancelModalBtn = page.locator("//button[normalize-space()='Cancel']");
await cancelModalBtn.click();
await page.waitForTimeout(4000);*/

});

