// tripData.js

// ================= LOGIN =================
const credentials = {
  email: 'mythili+030226@qaoncloud.com',
  password: 'Qaoncloud@01'
};

// ================= TRIP NAME =================
const trip = {
  name: 'USA Trip'
};

// ================= TRIP REASONS =================
const tripReasons = [
  'Adventure',
  'Anniversary',
  'Babymoon',
  'Bachelor/bachelorette',
  'Birthday',
  'Couples trip',
  'Family trip',
  'Friends trip',
  'Health/wellness',
  'Honeymoon',
  'Other',
  'Solo trip',
  'Wedding',
  'Work/business'
];

function getRandomTripReason() {
  return tripReasons[Math.floor(Math.random() * tripReasons.length)];
}

// ================= RANDOM FUTURE DATE =================
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

// ================= DATE FORMAT =================
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

module.exports = {
  credentials,
  trip,
  getRandomFutureDates,
  formatDateForAria,
  getRandomTripReason
};
// callingData02.spec.js
// npx playwright test ./Fora/CallingData02.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');

const {
  credentials,
  trip,
  getRandomFutureDates,
  formatDateForAria,
  getRandomTripReason
} = require('./tripData');

test.setTimeout(90_000);

// ================= LOGIN =================
test.beforeEach(async ({ page }) => {

  await page.goto('https://advisor.forastaging.net/');
  await page.locator("a:has-text('Sign in here')").click();

  await page.locator('#username').fill(credentials.email);
  await page.locator('#password').fill(credentials.password);
  await page.locator("button[type='submit']:has-text('Sign in')").click();

  // Wait for Home page to load
  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();
  await page.waitForTimeout(2000);

  // Click on Search
  await page.locator('[data-testid="nav_bar_search"]').click();

  // Search "trips" and click Trips
  await page.waitForSelector("input[type='search'], input[placeholder*='Search']", { timeout: 20000 });
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('trips');
  await page.waitForSelector("text=Trips", { timeout: 10000 });

  // Click on Trips
  await page.waitForSelector('#page-2', { timeout: 20000 });
  await page.locator('#page-2').click();

  // Click on Create Trip button
  await expect(page.locator("//span[normalize-space()='Create trip']")).toBeVisible();
  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(3000);
});

// ================= TEST =================
test('Create Trip using external data', async ({ page }) => {

  await expect(
    page.getByTestId('create-trip-container')
        .getByRole('heading', { name: 'Create a trip' })
  ).toBeVisible();

  // Trip Name
  await page.fill("input[placeholder='Enter name']", trip.name);
  await page.waitForTimeout(500);
  console.log("Given Trip name:", trip.name);

  // ================= RANDOM DATE =================
  const { checkInDate, checkOutDate } = getRandomFutureDates();

  const checkInLabel = formatDateForAria(checkInDate);
  const checkOutLabel = formatDateForAria(checkOutDate);

  console.log("Check-in:", checkInLabel);
  console.log("Check-out:", checkOutLabel);

  const calendar = page.locator("//div[@role='button' and @data-headlessui-state]");
  await calendar.click();

  while (!(await page.locator(`//button[@aria-label='${checkInLabel}']`).isVisible())) {
    await page.locator("//button[@aria-label='Go to the Next Month']").click();
  }
  await page.locator(`//button[@aria-label='${checkInLabel}']`).click();

  while (!(await page.locator(`//button[@aria-label='${checkOutLabel}']`).isVisible())) {
    await page.locator("//button[@aria-label='Go to the Next Month']").click();
  }
  await page.locator(`//button[@aria-label='${checkOutLabel}']`).click();
  await page.waitForTimeout(1000);

  // ================= RANDOM TRIP REASON =================
  const reason = getRandomTripReason();
  console.log("Trip Reason Selected:", reason);

  await page.locator("button[data-testid='select-trip-reason']").click();
  await page.locator(`//div[contains(text(),'${reason}')]`).click();
  await page.waitForTimeout(500);

  // Create Trip
  await page.locator("button:has-text('Create Trip')").click();
});

// ================= VERIFY =================
test.afterEach(async ({ page }) => {

  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  await expect(tripNameDetail).toHaveText(trip.name);
  await page.waitForTimeout(3000);

});
