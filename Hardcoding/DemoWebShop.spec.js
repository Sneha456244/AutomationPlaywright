module.exports = {

email: "testautomation123@test.com",
password: "Test@123",

searchProduct: "Laptop",

successMessage: "Welcome to our store"

};

// npx playwright test ./Hardcoding/DemoWebShop.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');
const data = require('./testdata02');


// ======================================
// BEFORE EACH -> LOGIN
// ======================================

test.beforeEach(async ({ page }) => {

  await page.goto("https://demowebshop.tricentis.com/");
  await page.waitForTimeout(1000);
  console.log("Application launched");

  await page.waitForSelector("//a[text()='Log in']");
  await page.click("//a[text()='Log in']");
  await page.waitForTimeout(1000);
  console.log("Login page opened");

  await page.waitForSelector("#Email");
  await expect(page.locator("#Email")).toBeVisible();
  await page.fill("#Email", data.email);
  await page.waitForTimeout(1000);
  console.log("Email entered");

  await page.waitForSelector("#Password");
  await expect(page.locator("#Password")).toBeVisible();
  await page.fill("#Password", data.password);
  await page.waitForTimeout(1000);
  console.log("Password entered");

  await page.waitForSelector("input[value='Log in']");
  await page.click("input[value='Log in']");
  await page.waitForTimeout(2000);
  console.log("Login button clicked");

  await page.waitForSelector(".account");
  await expect(page.locator(".account")).toBeVisible();
  console.log("Login successful");

});


// ======================================
// MAIN TEST
// ======================================

test("Demo Web Shop End to End Flow", async ({ page }) => {

  await page.waitForSelector(".header-logo");
  await page.waitForTimeout(1000);
  console.log("Home page loaded");


  // ---------------- SEARCH PRODUCT ----------------

  await page.waitForSelector("#small-searchterms");
  await page.fill("#small-searchterms", data.searchProduct);
  await page.waitForTimeout(1000);
  console.log("Product entered in search box");

  await page.waitForSelector("input[value='Search']");
  await page.click("input[value='Search']");
  await page.waitForTimeout(2000);
  console.log("Search button clicked");


  // ---------------- SELECT PRODUCT ----------------

  await page.waitForSelector(".product-title a");
  await page.locator(".product-title a").first().click();
  await page.waitForTimeout(2000);
  console.log("Product selected");


  // ---------------- ADD TO CART ----------------

  await page.waitForSelector("input[value='Add to cart']");
  await page.click("input[value='Add to cart']");
  await page.waitForTimeout(2000);
  console.log("Product added to cart");


  // WAIT FOR SUCCESS MESSAGE

  await page.waitForSelector(".bar-notification.success");
  await page.waitForTimeout(1500);
  console.log("Add to cart success message displayed");


  // ---------------- OPEN CART ----------------

  await page.waitForSelector("#topcartlink");
  await page.click("#topcartlink");

  await page.waitForURL("**/cart");
  await page.waitForTimeout(2000);
  console.log("Cart page opened");


  // ---------------- VALIDATE PRODUCT ----------------

  await page.waitForSelector(".product-name");

  const cartProduct = await page.locator(".product-name").first().textContent();

  console.log("Product in cart:", cartProduct);

  await expect(page.locator(".product-name").first()).toBeVisible();
  await page.waitForTimeout(1000);

  console.log("Cart validation passed");


  // ---------------- ACCEPT TERMS ----------------

  await page.waitForSelector("#termsofservice");
  await page.check("#termsofservice");
  await page.waitForTimeout(1000);
  console.log("Terms accepted");


  // ---------------- CHECKOUT ----------------

  await page.waitForSelector("#checkout");
  await page.click("#checkout");
  await page.waitForTimeout(2000);

  console.log("Checkout button clicked");

});


// ======================================
// AFTER EACH -> LOGOUT
// ======================================

test.afterEach(async ({ page }) => {

  try {

    await page.waitForSelector("//a[text()='Log out']", { timeout: 5000 });

    await page.click("//a[text()='Log out']");
    await page.waitForTimeout(1000);

    console.log("Logout successful");

  }

  catch {

    console.log("Logout skipped because test ended earlier");

  }

});
