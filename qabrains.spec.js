//1. Login
const { test, expect } = require('@playwright/test');
test('Login test', async ({ page }) => {

    // Open website
    await page.goto('https://practice.qabrains.com/');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Click Login button/link
    await page.locator('text=Login').first().click();

    await page.waitForTimeout(500);

    // Fill email
    await page.locator('input[type="email"]')
        .fill('qa_testers@qabrains.com');

    await page.waitForTimeout(500);

    // Fill password
    await page.locator('input[type="password"]')
        .fill('Password123');

    await page.waitForTimeout(500);

    // Click login button
    await page.locator('button:has-text("Login")').click();

//2. Registration
const { test, expect } = require('@playwright/test');

test('Registration Form Test', async ({ page }) => {

    // Navigate to Registration page
    await page.goto('https://practice.qabrains.com/registration');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Fill Name
    await page.getByPlaceholder('eg. Jhon Doe')
        .fill('Sneha');
        await page.waitForTimeout(500);

    // Select Country
    await page.locator('select').nth(0)
        .selectOption({ label: 'India' });
        await page.waitForTimeout(500);

    // Select Account Type
    await page.locator('select').nth(1)
        .selectOption({ index: 1 });
        await page.waitForTimeout(500);

    // Fill Email
    await page.getByPlaceholder('eg. user@user.com')
        .fill('snehaqa123@test.com');
        await page.waitForTimeout(500);

    // Fill Password
    await page.getByPlaceholder('Enter password')
        .first()
        .fill('Password123');
        await page.waitForTimeout(500);

    // Fill Confirm Password
    await page.getByPlaceholder('Enter password')
        .nth(1)
        .fill('Password123');
        await page.waitForTimeout(500);

    // Click Signup button
    await page.getByRole('button', { name: /signup/i })
        .click();
    

    await page.waitForTimeout(2000);

});

    await page.waitForTimeout(2000);

});
// 3.Forget password
const { test, expect } = require('@playwright/test');

test('Forgot Password Test', async ({ page }) => {

    // Navigate to Forgot Password page
    await page.goto('https://practice.qabrains.com/forgot-password');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Enter Email
    await page.getByPlaceholder('eg. user@user.com')
        .fill('sneha123@gmail.com');

    // Click Reset Password button
    await page.getByRole('button', { name: /reset password/i })
        .click();

    // Validate success message
    await expect(
        page.getByText(
            'Password has been sent to sneha123@gmail.com'
        )
    ).toBeVisible();

});
// 4.FormSubmission

const { test, expect } = require('@playwright/test');
const path = require('path');

test('Form Submission Test Using Locators', async ({ page }) => {

    // Navigate to Form Submission page
    await page.goto('https://practice.qabrains.com/form-submission');

    await page.waitForLoadState('networkidle');
 
    //Locators

    const nameInput = page.locator(
        'input[placeholder="eg. Jhon Doe"]'
    );

    const emailInput = page.locator(
        'input[placeholder="eg. user@user.com"]'
    );

    const contactInput = page.locator(
        'input[placeholder*="880"]'
    );

    const dateInput = page.locator(
        'input[type="date"]'
    );

    const uploadFile = page.locator(
        'input[type="file"]'
    );

    const blueRadio = page.getByRole(
        'radio',
        { name: 'Blue' }
    );

    const pizzaCheckbox = page.getByRole(
        'checkbox',
        { name: 'Pizza' }
    );

    const countryDropdown = page.locator('select');

    const submitButton = page.getByRole(
        'button',
        { name: 'Submit' }
    ).first();

    //full name
    await nameInput.waitFor({ state: 'visible' });

    await nameInput.fill('Sneha');
    await page.waitForTimeout(500);

    // Fill email
    await emailInput.fill('sneha123@gmail.com');
    await page.waitForTimeout(500);

    // Fill Contact Number
    // Minimum 11 digits required
    await contactInput.fill('98765432101');
    await page.waitForTimeout(500);

    await dateInput.fill('2025-08-08');
    await page.waitForTimeout(500);

    // Upload File
    // tests/testdata/sample.pdf
    await uploadFile.setInputFiles(
        path.resolve(__dirname, '../testdata/sample.pdf')
    );

    await page.waitForTimeout(500);

    await blueRadio.check();
    await page.waitForTimeout(500);

    await pizzaCheckbox.check();
    await page.waitForTimeout(500);

    await countryDropdown.selectOption({
        label: 'India'
    });

    await page.waitForTimeout(500);

    await submitButton.waitFor({
        state: 'visible'
    });
    await page.waitForTimeout(500);

    // Click Submit
    await submitButton.click();
    await page.waitForTimeout(3000);

    // Validation
    await expect(
        page.getByText('Form submit successfully.')
    ).toBeVisible();

});

