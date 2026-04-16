import { expect } from '@playwright/test';
import { test } from '../../utils/baseTest';
import { TestData } from '../../utils/testData';
import { Routes } from '../../utils/constants';

test.describe("Session Handling & Reset Behavior", () => {

  // SS_01 - Logout Redirection
  test("SS_01 - Logout redirects to login page", async ({ loginPage, inventoryPage, page }) => {

    const user = TestData.getUser("STANDARD");

    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);

    await inventoryPage.waitForInventoryPage();

    // Logout
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // Assertion
    await expect(page).toHaveURL(/index.html/);
  });

  // SS_02 - Unauthorized URL Access
  test("SS_02 - Unauthorized user cannot access inventory URL", async ({ loginPage, inventoryPage, page }) => {

    const user = TestData.getUser("STANDARD");

    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);

    await inventoryPage.waitForInventoryPage();

    // Copy inventory URL
    const inventoryUrl = page.url();

    // Logout
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // Try accessing directly
    await page.goto(inventoryUrl);

    // Assertion
    await expect(page).toHaveURL(/index.html/);
    await expect(page.locator('[data-test="error"]')).toContainText(
      "You can only access '/inventory.html' when you are logged in."
    );
  });

  // SS_03 - Cart Reset on Logout
  test("SS_03 - Cart resets after logout", async ({ loginPage, inventoryPage, page }) => {

    const user = TestData.getUser("STANDARD");

    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);

    await inventoryPage.waitForInventoryPage();

    // Add items
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.addItemToCart("Sauce Labs Bike Light");

    // Logout
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // Login again
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForInventoryPage();

    // Assertion - Cart should be empty
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  // SS_04 - Reset App State (Logged In)
  test("SS_04 - Reset App State clears cart without logout", async ({ loginPage, inventoryPage }) => {

    const user = TestData.getUser("STANDARD");

    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);

    await inventoryPage.waitForInventoryPage();

    // Add item
    await inventoryPage.addItemToCart("Sauce Labs Backpack");

    // Reset App State
    await inventoryPage.openMenu();
    await inventoryPage.resetAppState();

    // Assertions
    await expect(inventoryPage.cartBadge).toBeHidden();
    await expect(inventoryPage.getAddToCartButton("Sauce Labs Backpack"))
      .toHaveText("Add to cart");
  });

  // SS_05 - Back Button After Logout
  test("SS_05 - Back button does not allow access after logout", async ({ loginPage, inventoryPage, page }) => {

    const user = TestData.getUser("STANDARD");

    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);

    await inventoryPage.waitForInventoryPage();

    // Logout
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // Browser back
    await page.goBack();

    // Assertion
    await expect(page).toHaveURL(/index.html/);
  });

  // SS_06 - Session persists after refresh
  test("SS_06 - Session persists after page refresh", async ({ loginPage, inventoryPage, page }) => {

    const user = TestData.getUser("STANDARD");

    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);

    await inventoryPage.waitForInventoryPage();

    // Add item
    await inventoryPage.addItemToCart("Sauce Labs Backpack");

    // Refresh
    await page.reload();

    // Assertions
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  // SS_07 - Multi User Data Isolation
  test("SS_07 - Cart data should not leak between users", async ({ loginPage, inventoryPage }) => {

    const userA = TestData.getUser("STANDARD");
    const userB = TestData.getUser("PROBLEM");

    // User A
    await loginPage.navigateToLoginPage();
    await loginPage.login(userA.username, userA.password);
    await inventoryPage.waitForInventoryPage();

    await inventoryPage.addItemToCart("Sauce Labs Backpack");

    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // User B
    await loginPage.login(userB.username, userB.password);
    await inventoryPage.waitForInventoryPage();

    // Assertion - cart should be empty
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

});
