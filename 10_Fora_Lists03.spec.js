// npx playwright test ./Fora/Lists03.spec.js --project=chromium --headed

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
test('Lists -> Fav', async ({ page }) => {

  await expect(page.locator("//h1[contains(.,'Partners')]")).toBeVisible();
  await page.waitForTimeout(500);

  await page.locator("input[placeholder='Add dates']").click();
  await page.waitForTimeout(500);

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

  async function navigateToDate(page, dateLabel) {
    while (!(await page.locator(`//button[@aria-label="${dateLabel}"]`).isVisible())) {
      await page.locator("//button[@aria-label='Go to the Next Month']").click();
      await page.waitForTimeout(500);
    }
  }

  await navigateToDate(page, checkInLabel);
  await page.locator(`//button[@aria-label="${checkInLabel}"]`).click();
  await page.waitForTimeout(500);

  await navigateToDate(page, checkOutLabel);
  await page.locator(`//button[@aria-label="${checkOutLabel}"]`).click();
  await page.waitForTimeout(500);

  await page.locator("button[data-testid='search-bar-search']").click();
  await page.waitForTimeout(4000);


// ==================================================
// SMART FAVORITE SELECTION (Pick Unliked Card)
// ==================================================

const supplierCards = page.locator('[data-testid^="supplier-card-"]');
const cardCount = await supplierCards.count();

let targetCardFound = false;

for (let i = 0; i < cardCount; i++) {

  const card = supplierCards.nth(i);
  const favBtn = card.locator('[data-testid="favorites-list-button"]');

  await page.waitForTimeout(500);

  const ariaLabel = await favBtn.getAttribute('aria-label');

  if (ariaLabel === "Add to favorites") {

    console.log(`Selecting unliked supplier card at index ${i}`);

    await favBtn.click();
    await page.waitForTimeout(500);

    const lists = page.locator("div.flex.flex-col.cursor-pointer");
    const listCount = await lists.count();

    for (let j = 0; j < listCount; j++) {

      const list = lists.nth(j);
      const isSelected = await list.locator("svg, [aria-selected='true']").count();

      if (isSelected === 0) {
        await list.click();
        await page.waitForTimeout(500);
        break;
      }
    }
await page.locator("//button[text()='Save']").click();
    await page.waitForTimeout(5000);

    
    break;
  }
}

if (!targetCardFound) {
  console.log("All supplier cards already liked");
}


});
