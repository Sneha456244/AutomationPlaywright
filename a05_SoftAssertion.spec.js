// Soft Assertions example using Demoblaze
const { test, expect } = require('@playwright/test');

test('SoftAssertionsTest', async ({ page }) => {

    // Open app URL
    await page.goto('https://www.demoblaze.com/');

    // 1) URL validation
    await expect.soft(page).toHaveURL('https://www.demoblaze.com/');

    // 2) Title validation
    await expect.soft(page).toHaveTitle('STORE');

    // 3) Logo visibility
    const logo = page.locator('#nava');
    await expect.soft(logo).toBeVisible();

    // 4) Navbar links visible
    const homeLink = page.locator('a:has-text("Home")');
    await expect.soft(homeLink).toBeVisible();

    const contactLink = page.locator('a:has-text("Contact")');
    await expect.soft(contactLink).toBeVisible();

    const aboutUsLink = page.locator('a:has-text("About us")');
    await expect.soft(aboutUsLink).toBeVisible();

    const cartLink = page.locator('#cartur');
    await expect.soft(cartLink).toBeVisible();

    // 5) Login button enabled
    const loginBtn = page.locator('#login2');
    await expect.soft(loginBtn).toBeEnabled();

    // 6) Signup button enabled
    const signupBtn = page.locator('#signin2');
    await expect.soft(signupBtn).toBeEnabled();

    // 7) Categories section visible
    const categories = page.locator('.list-group');
    await expect.soft(categories).toBeVisible();

    // 8) Product cards count (Home page)
    const products = page.locator('.card-block');
    await expect.soft(products).toHaveCount(9);

});
