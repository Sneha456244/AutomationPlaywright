const { test, expect } = require('@playwright/test');

test('Negative Checkout Flow Mandatory Field Validations', async ({ page }) => {

    test.setTimeout(60000);

    await page.goto('https://demowebshop.tricentis.com/');
    await page.waitForTimeout(500);
    console.log("Application launched successfully");

    await page.locator("//ul[@class='top-menu']//a[normalize-space()='Books']").click();
    await page.waitForTimeout(500);
    console.log("Books tab clicked");

    const fictionCard = page.locator(
        "//a[normalize-space()='Fiction']/ancestor::div[contains(@class,'item-box')]");
    await page.waitForTimeout(500);

    await fictionCard.locator("input[value='Add to cart']").click();
    await page.waitForTimeout(500);
    console.log("Fiction book added to cart");

    await expect(page.locator('#bar-notification'))
    .toContainText('The product has been added to your shopping cart');
    await page.waitForTimeout(500);
    console.log("Product added to cart message verified");

    await page.locator("//a[normalize-space()='Shopping cart']").click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/cart/);
    await page.waitForTimeout(500);
    console.log("Navigated to Shopping Cart page");

    await page.locator('#termsofservice').check();
    await page.waitForTimeout(500);
    console.log("Terms and Conditions selected");

    await page.locator('#checkout').click();
    await page.waitForTimeout(500);
    console.log("Checkout button clicked");

    await page.locator("//input[@value='Checkout as Guest']").click();
    await page.waitForTimeout(500);
    console.log("Checkout as Guest selected");

    await page.locator("//input[@onclick='Billing.save()']").click();
    await page.waitForTimeout(500);
    console.log("Clicked Continue without entering billing details");

    await expect(page.locator("[data-valmsg-for='BillingNewAddress.FirstName']"))
    .toContainText('First name is required.');
    await page.waitForTimeout(500);
    console.log("First Name validation verified");

    await expect(page.locator("[data-valmsg-for='BillingNewAddress.LastName']"))
    .toContainText('Last name is required.');
    await page.waitForTimeout(500);
    console.log("Last Name validation verified");

    await expect(page.locator("[data-valmsg-for='BillingNewAddress.Email']"))
    .toContainText('Email is required.');
    await page.waitForTimeout(500);
    console.log("Email validation verified");

    await expect(page.locator('#BillingNewAddress_CountryId'))
    .toHaveValue('0');
    await page.waitForTimeout(500);
    console.log("Country dropdown validation verified");

    await expect(page.locator("[data-valmsg-for='BillingNewAddress.City']"))
    .toContainText('City is required');
    await page.waitForTimeout(500);
    console.log("City validation verified");

    await expect(page.locator("[data-valmsg-for='BillingNewAddress.Address1']"))
    .toContainText('Street address is required');
    await page.waitForTimeout(500);
    console.log("Address validation verified");

    /*await expect(page.locator("[data-valmsg-for='BillingNewAddress_ZipPostalCode']"))
    .toContainText('Zip / postal code is required');
    await page.waitForTimeout(500);
    console.log("Zip Code validation verified");*/

    await expect(page.locator("[data-valmsg-for='BillingNewAddress.PhoneNumber']"))
    .toContainText('Phone is required');
    await page.waitForTimeout(500);
    console.log("Phone Number validation verified");

    console.log("All mandatory field validations passed successfully");
});
