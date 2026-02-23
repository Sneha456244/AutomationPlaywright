// npx playwright test ./Fora/BookingFlow02.spec.js --project=chromium --headed

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
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('partners');
  await page.waitForTimeout(500);

  // Wait for partners result
  await page.waitForSelector("text=partners", { timeout: 10000 });
  await page.waitForTimeout(500);

  // Click on Partners — first element
  await page.locator("//button[.//text()[contains(.,'Partners')]]").nth(0).click();
  await page.waitForTimeout(500);
});

// ==================================================
// MAIN TEST
// ==================================================
test('Partner to Booking Flow - Downtown LA Proper Hotel', async ({ page }) => {

  await expect(page.locator("//h1[contains(.,'Partners')]")).toBeVisible();

  // WHERE -> Search Hotel
  await page.locator("input[placeholder='Partner or destination']")
    .fill('Downtown Los Angeles Proper Hotel');

  // WHEN -> Open Calendar
  await page.locator("input[placeholder='Add dates']").click();

  // ================= RANDOM DATE =================
  const today = new Date();
  const randomCheckInOffset = Math.floor(Math.random() * 60) + 15;
  const checkInDate = new Date(today);
  checkInDate.setDate(today.getDate() + randomCheckInOffset);

  const stayDuration = Math.floor(Math.random() * 3) + 1;
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + stayDuration);

  function getOrdinal(n) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  function formatDate(date) {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${weekday}, ${month} ${day}${getOrdinal(day)}, ${year}`;
  }

  const checkInLabel = formatDate(checkInDate);
  const checkOutLabel = formatDate(checkOutDate);

  console.log("Check-in:", checkInLabel);
  console.log("Check-out:", checkOutLabel);

  async function navigateToDate(page, dateLabel) {
    while (!(await page.locator(`//button[@aria-label="${dateLabel}"]`).isVisible())) {
      await page.locator("//button[@aria-label='Go to the Next Month']").click();
      await page.waitForTimeout(400);
    }
  }

  // Select Check-in
  await navigateToDate(page, checkInLabel);
  await page.locator(`//button[@aria-label="${checkInLabel}"]`).click();

  // Select Check-out
  await navigateToDate(page, checkOutLabel);
  await page.locator(`//button[@aria-label="${checkOutLabel}"]`).click();

  // SEARCH
  await page.locator("button[data-testid='search-bar-search']").click();
  await page.waitForTimeout(4000);

  // Select Hotel Card
  await page.locator("a[data-testid^='supplier-card-']").first().click();

  // STRICT MODE SAFE HOTEL VALIDATION
  const hotelName = page.locator("[data-testid='supplier-name']", {
    hasText: "Downtown Los Angeles Proper Hotel"
  });

  await hotelName.waitFor({ state: 'visible' });
  await expect(hotelName).toBeVisible();

  console.log("Hotel Selected: Downtown Los Angeles Proper Hotel");

  // FIND RATES
 // WAIT for rate tabs section to load
await page.waitForSelector("li[data-program-id]", { timeout: 20000 });

// Scroll into view (important for lazy load)
await page.locator("li[data-program-id]").first().scrollIntoViewIfNeeded();

// Try selecting THOR
const thorTab = page.locator("li[data-program-id] a:has-text('THOR')");

if (await thorTab.count() > 0) {

  console.log("THOR tab found");
  await thorTab.first().click();

} else {

  console.log("THOR not available → selecting first available rate tab");
  await page.locator("li[data-program-id] a").first().click();

}

// Wait for rates list
await page.waitForSelector("div[data-testid='rates-list-item']", { timeout: 20000 });

// Select first rate
await page.locator("div[data-testid='rates-list-item']").first().click();

  await page.locator("//button[@id='scrollToBook']").click();
  await page.locator("//button[normalize-space()='Continue']").click();

  // Select Client
  await page.waitForSelector("div.truncate:has-text('lakshmi Client testing')");
  await page.locator("div.truncate:has-text('lakshmi Client testing')").click();

  await page.locator("//input[@type='radio']").first().check();
  await page.locator("(//input[@type='radio'])[2]").check();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.locator("//button[normalize-space()='Complete Booking']").click();

  // Booking Confirmation
  const bookingTitle = page.locator("//h1[contains(text(),'Hotel booking for lakshmi Client testing')]");
  await bookingTitle.waitFor();
  console.log("Booking Title:", await bookingTitle.innerText());

  // ================= CANCEL BOOKING =================

  await page.locator('[data-testid="rowbutton-Manage booking"]').click();
  await page.locator("//span[normalize-space()='Cancel booking']").click();
  await page.locator("//button[@name='I want to cancel this booking using Portal']").click();

  await page.locator("//button[normalize-space()='Next']").click();
  await page.locator("//input[@data-testid='reason-radio-button_test1']").click();
  await page.locator("//button[normalize-space()='Cancel this booking']").click();

  const canceledBadge = page.locator("[data-testid='badge-negative']");
  await expect(canceledBadge).toContainText('Canceled');

});
