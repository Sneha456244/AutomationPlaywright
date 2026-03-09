module.exports = {

    username: 'standard_user',
    password: 'secret_sauce',

    firstname: 'Test',
    lastname: '01',
    postcode: '600100',

    successMessage: 'Thank you for your order!'

};

// npx playwright test ./Hardcoding/Swag01.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');
const data = require('./testdata');


// ======================
// Before Each (Login)
// ======================

test.beforeEach(async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');
  console.log("Application launched");
  await page.waitForTimeout(500);

  await expect(page.locator("#user-name")).toBeVisible();
  console.log("Username field is visible");
  await page.waitForTimeout(500);

  await page.fill("#user-name", data.username);
  console.log("Username entered");
  await page.waitForTimeout(500);

  await expect(page.locator("#password")).toBeVisible();
  console.log("Password field is visible");
  await page.waitForTimeout(500);

  await page.fill("#password", data.password);
  console.log("Password entered");
  await page.waitForTimeout(500);

  await expect(page.locator("#login-button")).toBeVisible();
  await page.click("#login-button");
  console.log("Login button clicked");
  await page.waitForTimeout(500);

  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  console.log("Login successful - Swag Labs logo verified");
  await page.waitForTimeout(500);

});


// ======================
// Test Case
// ======================

test('Swag Labs Full Flow', async ({ page }) => {

  const logoText = await page.locator(".app_logo").textContent();
  console.log("Logo Text:", logoText);
  await page.waitForTimeout(500);

  expect(logoText.trim()).toBe("Swag Labs");
  console.log("Logo text validation passed");
  await page.waitForTimeout(500);


  await page.click("#react-burger-menu-btn");
  console.log("Hamburger menu clicked");
  await page.waitForTimeout(500);


  await expect(page.locator("#about_sidebar_link")).toBeVisible();
  await page.click("#about_sidebar_link");
  console.log("About link clicked");
  await page.waitForTimeout(500);


  await expect(page.locator("text=Full-Lifecycle AI-Quality Platform")).toBeVisible();
  console.log("SauceLabs About page validated");
  await page.waitForTimeout(500);


  await page.goBack();
  console.log("Navigated back to product page");
  await page.waitForTimeout(500);


  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  console.log("Back navigation validated");
  await page.waitForTimeout(500);


  await page.selectOption(".product_sort_container", { label: "Price (low to high)" });
  console.log("Products sorted by price low to high");
  await page.waitForTimeout(1000);


  await page.locator(".inventory_item_name").first().click();
  console.log("First product selected");
  await page.waitForTimeout(500);


  const productName = await page.locator(".inventory_details_name").textContent();
  console.log("Selected Product:", productName);
  await page.waitForTimeout(500);


  await page.click("button:has-text('Add to cart')");
  console.log("Product added to cart");
  await page.waitForTimeout(500);


  await page.click(".shopping_cart_link");
  console.log("Cart opened");
  await page.waitForTimeout(500);


  const cartProduct = await page.locator(".inventory_item_name").first().textContent();

  console.log("Product in cart:", cartProduct);
  await page.waitForTimeout(500);

  expect(cartProduct.trim()).toBe(productName.trim());
  console.log("Product validation in cart passed");
  await page.waitForTimeout(500);

  await page.click("button:has-text('Checkout')");
  console.log("Checkout clicked");
  await page.waitForTimeout(500);

  await page.fill("#first-name", data.firstname);
  console.log("Firstname entered");
  await page.waitForTimeout(500);

  await page.fill("#last-name", data.lastname);
  console.log("Lastname entered");
  await page.waitForTimeout(500);

  await page.fill("#postal-code", data.postcode);
  console.log("Postal code entered");
  await page.waitForTimeout(500);

  await page.click("#continue");
  console.log("Continue clicked");
  await page.waitForTimeout(500);

  await page.click("#finish");
  console.log("Finish clicked");
  await page.waitForTimeout(500);

  const successMsg = await page.locator(".complete-header").textContent();
  console.log("Order Success Message:", successMsg);
  await page.waitForTimeout(500);

  expect(successMsg.trim()).toBe(data.successMessage);
  console.log("Order completion validation passed");
  await page.waitForTimeout(500);


  await page.click("#back-to-products");
  console.log("Navigated back to products page");
  await page.waitForTimeout(500);

});


// ======================
// After Each (Logout)
// ======================

test.afterEach(async ({ page }) => {

  await page.click("#react-burger-menu-btn");
  console.log("Hamburger menu opened for logout");
  await page.waitForTimeout(500);

  await page.click("#logout_sidebar_link");
  await page.waitForTimeout(1000);
  console.log("Logout successful");

});
