// npx playwright test ./Fora/Lists.spec.js --project=chromium --headed

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
test('Lists -> Fav', async ({ page }) => {

  await expect(page.locator("//h1[contains(.,'Partners')]")).toBeVisible();

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

  const favBtn = page.locator('[data-testid="favorites-list-button"]').first();

  await expect(favBtn).toBeVisible();
  await favBtn.click();
  await page.waitForTimeout(500);

  await page.locator('button.bg-main\\/6').click();
  await page.waitForTimeout(500);

  const modal = page.locator('div[role="dialog"]');

  await modal.locator('input.wrapper-test-field').fill('Dream02');
  await page.waitForTimeout(500);

  await page.locator('[role="dialog"]')
  .getByRole('button', { name: 'Add list' })
  .click();
});
