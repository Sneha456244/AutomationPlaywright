const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Logged-in Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    console.log('Opened Login Page');

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await page.waitForTimeout(500)

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.waitForTimeout(500)
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.waitForTimeout(500)
    await page.locator('[data-test="login-button"]').click();
    await page.waitForTimeout(500)

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();

    console.log('Login Successful');
    await page.waitForTimeout(500)
  });

  
  test('E2E Purchase Flow', async ({ page }) => {

    console.log('Starting E2E Purchase Flow');

    const addToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.waitForTimeout(500)
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
    console.log('Item Added to Cart');
    await page.waitForTimeout(500)

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="shopping-cart-link"]').click();
    console.log('Navigated to Cart');
    await expect(page.locator('.cart_list')).toBeVisible();
    await page.waitForTimeout(500)

    await page.locator('[data-test="checkout"]').click();
    console.log('Checkout Started');
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await page.waitForTimeout(500)

    await page.locator('[data-test="firstName"]').fill('Sneha');
    await page.waitForTimeout(500)
    await page.locator('[data-test="lastName"]').fill('S');
    await page.waitForTimeout(500)
    await page.locator('[data-test="postalCode"]').fill('600001');
    await page.waitForTimeout(500)

    await page.locator('[data-test="continue"]').click();
    await page.waitForTimeout(500)
    await expect(page.locator('.checkout_summary_container')).toBeVisible();

    await page.locator('[data-test="finish"]').click();
    await page.waitForTimeout(500)

    const successMsg = await page.locator('[data-test="complete-header"]').textContent();

    if (successMsg === 'Thank you for your order!') {
      console.log('E2E Purchase Flow PASSED');
    } else {
      console.log('E2E Purchase Flow FAILED');
    }
  });


  test('Verify Pricing Consistency', async ({ page }) => {

    console.log('Starting Pricing Consistency Test');

    const priceElement = page.locator('.inventory_item_price').first();
    await expect(priceElement).toBeVisible();
    await page.waitForTimeout(500)

    const price = await priceElement.textContent();
    console.log('Product Price:', price);
    await page.waitForTimeout(500)

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.waitForTimeout(500)

    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForTimeout(500)

    const cartPriceElement = page.locator('.inventory_item_price');
    await expect(cartPriceElement).toBeVisible();

    const cartPrice = await cartPriceElement.textContent();
    console.log('Cart Price:', cartPrice);
    await expect(cartPriceElement).toHaveText(price);
    await page.waitForTimeout(500)

    await page.locator('[data-test="checkout"]').click();
    await page.waitForTimeout(500)

    await page.locator('[data-test="firstName"]').fill('Test');
    await page.waitForTimeout(500)
    await page.locator('[data-test="lastName"]').fill('User');
    await page.waitForTimeout(500)
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.waitForTimeout(500)

    await page.locator('[data-test="continue"]').click();

    const overviewPriceElement = page.locator('.inventory_item_price');
    await page.waitForTimeout(500)
    await expect(overviewPriceElement).toBeVisible();

    const overviewPrice = await overviewPriceElement.textContent();
    console.log('Checkout Price:', overviewPrice);

    if (price === cartPrice && price === overviewPrice) {
      console.log('Pricing Consistency PASSED');
    } else {
      console.log('Pricing Consistency FAILED');
    }

    await page.waitForTimeout(500)
  });


  test('Verify Price Low to High Sorting', async ({ page }) => {

    console.log('Starting Sorting Test');

    const dropdown = page.locator('[data-test="product-sort-container"]');
    await expect(dropdown).toBeVisible();
    await page.waitForTimeout(500)

    await dropdown.selectOption('lohi');
    await page.waitForTimeout(500)

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));

    console.log('Prices:', numericPrices);

    const sorted = [...numericPrices].sort((a, b) => a - b);

    if (JSON.stringify(numericPrices) === JSON.stringify(sorted)) {
      console.log('Sorting PASSED');
    } else {
      console.log('Sorting FAILED');
    }

    await page.waitForTimeout(500)
  });


  test('Verify Cart State Persistence - CONSISTENCY', async ({ page }) => {

    console.log('Starting Cart Persistence Test');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.waitForTimeout(500)

    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toHaveText('1');
    await page.waitForTimeout(500)

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_list')).toBeVisible();
    await page.waitForTimeout(500)

    await page.goBack();
    await page.waitForTimeout(500)

    const badgeText = await badge.textContent();

    if (badgeText === '1') {
      console.log('Cart Persistence PASSED');
    } else {
      console.log('Cart Persistence FAILED');
    }
  });

});


// Session Handling
test.describe('Session Handling', () => {

  test('Verify Session Reset After Logout', async ({ page }) => {

    console.log('Starting Session Reset Test');

    await page.goto('https://www.saucedemo.com/');

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.waitForTimeout(500)
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.waitForTimeout(500)
    await page.locator('[data-test="login-button"]').click();
    await page.waitForTimeout(500)

    await expect(page).toHaveURL(/inventory/);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.waitForTimeout(500)
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('#react-burger-menu-btn').click();
    await page.waitForTimeout(500)

    const logoutBtn = page.locator('[data-test="logout-sidebar-link"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    await page.waitForTimeout(500)

    console.log('Logged Out');

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await page.waitForTimeout(500)

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.waitForTimeout(500)
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.waitForTimeout(500)
    await page.locator('[data-test="login-button"]').click();
    await page.waitForTimeout(500)

    await expect(page).toHaveURL(/inventory/);

    const cartCount = await page.locator('.shopping_cart_badge').count();

    if (cartCount === 0) {
      console.log('Session Reset PASSED');
    } else {
      console.log('Session Reset FAILED');
    }

    await page.waitForTimeout(500)
  });

});
