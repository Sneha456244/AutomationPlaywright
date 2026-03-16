module.exports = {

URL: "https://demo.automationtesting.in/Register.html",

FIRSTNAME: "Sneha",
LASTNAME: "Tester",
ADDRESS: "Chennai Tamil Nadu India",
EMAIL: "sneha@test.com",
PHONE: "9876543210",

PASSWORD: "Test@123",

SKILL: "Java",

YEAR: "1998",
MONTH: "May",
DAY: "10"

};
// npx playwright test ./Hardcoding/GlobalSQA.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');
const data = require('./testdata03');


// =====================================
// Before Each Hook
// =====================================

test.beforeEach(async ({ page }) => {

await page.goto(data.URL);
console.log("Application launched");

await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(2000);

});

// 1) Test Flow

test('GlobalSQA Complete Drag & Drop Flow', async ({ page }) => {

// TC1 - Validate Page Title
await expect(page).toHaveTitle(/Drag And Drop/);

console.log("TC1 Passed - Page title validated");

await page.waitForTimeout(1000);

// TC2 - Validate iframe loaded
const frame = page.frameLocator("iframe.demo-frame").first();

await frame.locator("#gallery").waitFor({ state: 'visible' });

await expect(frame.locator("#gallery")).toBeVisible();

console.log("TC2 Passed - Iframe loaded successfully");

await page.waitForTimeout(1000);


// TC3 - Validate images available
const images = frame.locator("#gallery li");

const imageCount = await images.count();

console.log("Total images in gallery:", imageCount);

expect(imageCount).toBeGreaterThan(0);

console.log("TC3 Passed - Images available in gallery");

await page.waitForTimeout(1000);

// TC4 - Drag Image to Trash
const image = images.first();
const trash = frame.locator("#trash");

await expect(image).toBeVisible();
await expect(trash).toBeVisible();

await image.dragTo(trash);

console.log("TC4 Passed - Image dragged to trash");

await page.waitForTimeout(2000);

// TC5 - Validate image moved to trash
const movedImage = frame.locator("#trash li");

await expect(movedImage).toBeVisible();

console.log("TC5 Passed - Drag and Drop validated successfully");

await page.waitForTimeout(2000);

});


// =====================================
// After Each Hook
// =====================================

test.afterEach(async () => {

console.log("Test completed successfully");

});
