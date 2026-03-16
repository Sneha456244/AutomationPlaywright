module.exports = {

URL: "https://www.croma.com",

PRODUCT: "Laptop",

BRAND_FILTER_COUNT: 3,

FEATURE_FILTER_COUNT: 4

};
// npx playwright test ./Hardcoding/Croma.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');
const data = require('./testdata05');

// =======================
// Before Each
// =======================

test.beforeEach(async ({ page }) => {

console.log("Test Started");
await page.goto(data.URL);
await page.waitForLoadState('domcontentloaded');
console.log("Application Launched");

});

// =======================
// Test Case
// =======================

test("Croma Search and Filter Flow", async ({ page }) => {

// Step 1 — Search Product

const searchBox = page.locator("#searchV2");
await expect(searchBox).toBeVisible();
await searchBox.fill(data.PRODUCT);
await page.keyboard.press("Enter");
await page.waitForLoadState('networkidle');
console.log("Step 1: Searched product - " + data.PRODUCT);

// Step 2 — Open Brand Panel

const brandPanel = page.locator("#panel0bh-header").first();
await expect(brandPanel).toBeVisible();
await brandPanel.click();
await page.waitForTimeout(2000);
console.log("Brand filter panel opened");

// Step 3 — Select Brand Filters

const brandCheckboxes = page.locator("//div[@id='panel0bh-content']//span[@class='check']");
const brandCount = await brandCheckboxes.count();
for (let i = 0; i < data.BRAND_FILTER_COUNT && i < brandCount; i++) {
await brandCheckboxes.nth(i).click();
await page.waitForTimeout(500);

}
console.log("Step 2: Selected first 3 Brand filters");

// Step 4 — Open Feature Panel

const featurePanel = page.locator("//div[@id='panel1']//div[@id='panel1bh-header']").first();
await expect(featurePanel).toBeVisible();
await featurePanel.click();
await page.waitForTimeout(2000);
console.log("Feature filter panel opened");

// Step 5 — Select Feature Filters

const featureCheckboxes = page.locator("//div[@id='panel1bh-content']//span[@class='check']");
const featureCount = await featureCheckboxes.count();
for (let i = 0; i < data.FEATURE_FILTER_COUNT && i < featureCount; i++) {
await featureCheckboxes.nth(i).click();
await page.waitForTimeout(500);

}
console.log("Step 3: Selected first 4 Feature filters");

// Step 6 — Clear All Filters

const clearAll = page.locator("//span[@class='clear-all']").first();
await expect(clearAll).toBeVisible();
await clearAll.click();
await page.waitForTimeout(2000);
console.log("Step 4: Cleared all filters");

// Step 7 — Open Cart

const cartIcon = page.locator("//a[@data-testid='cart-icon']");
await expect(cartIcon).toBeVisible();
await cartIcon.click();
await page.waitForTimeout(2000);
console.log("Step 5: Cart opened");

// Step 8 — Verify Cart Page

const cartHeader = page.locator("//h2[normalize-space()='Your Cart']");
await expect(cartHeader).toBeVisible();
console.log("Step 6: Cart page verified successfully");

});

// =======================
// After Each
// =======================

test.afterEach(async () => {
console.log("Test Completed Successfully");

});
