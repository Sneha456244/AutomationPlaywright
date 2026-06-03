// login-negative-validation.spec.js

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Negative Login Validation Scenarios', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://practice.qabrains.com/');
    });

    // 1. Empty Email and Password
    test('Validate required field messages', async ({ page }) => {

        const loginButton = page.locator('button[type="submit"]');

        await loginButton.click();

        // Email required validation
        await expect(
            page.locator('text=Email is a required field')
        ).toBeVisible();

        // Password required validation
        await expect(
            page.locator('text=Password is a required field')
        ).toBeVisible();
    });


    // 2. Invalid Email Format
    test('Validate invalid email format', async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.emailInput.fill('@gmail.com');

        await loginPage.passwordInput.fill('123456');

        await loginPage.loginButton.click();

        // HTML validation message
        const emailValidation = await loginPage.emailInput.evaluate(
            (el) => el.validationMessage
        );

        expect(emailValidation).toContain(
            "Please enter a part followed by '@'"
        );
    });


    // 3. Password Less Than 6 Characters
    test('Validate password minimum character validation', async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.emailInput.fill('user@gmail.com');

        await loginPage.passwordInput.fill('11');

        await loginPage.loginButton.click();

        await expect(
            page.locator('text=Password must be at least 6 characters')
        ).toBeVisible();
    });


    // 4. Invalid Credentials
    test('Validate invalid login credentials', async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.login(
            'wronguser@gmail.com',
            'WrongPassword123'
        );

        await expect(
            page.locator('text=Invalid email or password')
        ).toBeVisible();
    });


    // 5. Email Without Domain
    test('Validate email without domain', async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.emailInput.fill('test@');

        await loginPage.passwordInput.fill('Password123');

        await loginPage.loginButton.click();

        const validationMessage = await loginPage.emailInput.evaluate(
            (el) => el.validationMessage
        );

        expect(validationMessage).toContain(
            "Please enter a part following '@'"
        );
    });


    // 6. Email Without @ Symbol
    test('Validate email without @ symbol', async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.emailInput.fill('testgmail.com');

        await loginPage.passwordInput.fill('Password123');

        await loginPage.loginButton.click();

        const validationMessage = await loginPage.emailInput.evaluate(
            (el) => el.validationMessage
        );

        expect(validationMessage).toContain('@');
    });


    // 7. Password With Spaces Only
    test('Validate password with spaces', async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.emailInput.fill('user@gmail.com');

        await loginPage.passwordInput.fill('     ');

        await loginPage.loginButton.click();

        await expect(
            page.locator('text=Password is a required field')
        ).toBeVisible();
    });

});
