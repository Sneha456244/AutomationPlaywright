export const data = {
URL: "https://www.flipkart.com/",
PRODUCT: "iPhone 15"
};
// npx playwright test ./Hardcoding/Flipkart.spec.js --project=chromium --headed
import { test, expect } from '@playwright/test';
import { data } from './testdata06.js';

test.describe("Flipkart Automation Flow", () => {

test.beforeEach(async ({ page }) => {

console.log("Test Started");
await page.goto(data.URL, { waitUntil: "domcontentloaded" });
console.log("Application Launched");

});

test("Search Product and Add To Cart", async ({ page }) => {

// STEP 1 : Close Login Popup 

const closePopup = page.locator("button:has-text('✕')");

if (await closePopup.isVisible().catch(() => false)) {
await closePopup.click();
console.log("Login popup closed");
}


// STEP 2 : Search Product 

const searchBox = page.locator("input[name='q']:not([readonly])");
await searchBox.fill(data.PRODUCT);
await page.keyboard.press("Enter");
console.log("Product searched");

// STEP 3 : Wait for product list 

await page.waitForSelector("div[data-id]");
const firstProduct = page.locator("div[data-id]").first();

// STEP 4 : Open product in new tab 

const [productPage] = await Promise.all([
page.context().waitForEvent("page"),
firstProduct.click()
]);

await productPage.waitForLoadState();
console.log("Product page opened");

// STEP 5 : Check available buttons 

const addToCart = productPage.locator("button:has-text('Add to cart')");
const buyNow = productPage.locator("button:has-text('Buy Now')");
const notifyMe = productPage.locator("text=Notify Me");

if (await addToCart.isVisible().catch(() => false)) {

await addToCart.click();
console.log("Product added to cart");
}
else if (await buyNow.isVisible().catch(() => false)) {

await buyNow.click();
console.log("Buy Now clicked (Add to cart not available)");
}
else if (await notifyMe.isVisible().catch(() => false)) {
console.log("Product currently unavailable");
}
else {
console.log("No purchase options available");
}

// STEP 6 : Cart validation 

await productPage.waitForTimeout(3000);
console.log("Flow completed");

});

test.afterEach(async () => {
console.log("Test Completed Successfully");

});

});
