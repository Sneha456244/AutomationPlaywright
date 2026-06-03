export class LoginPage {

    constructor(page) {
        this.page = page;

        this.emailInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]');
        this.loginButton = page.locator('button[type="submit"]');
    }

    async login(email, password) {

        await this.emailInput.fill(email);

        await this.passwordInput.fill(password);

        await this.loginButton.click();
    }
}

//npx playwright test tests/login.spec.js --project=chromium --headed
import { test } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

import { loginData } from '../utils/testData';

import { waitForSeconds } from '../helpers/commonMethods';


test('Login Test', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await page.goto('https://practice.qabrains.com/');

    await loginPage.login(
        loginData.email,
        loginData.password
    );

    await waitForSeconds(page);
});

export class RegistrationPage {

    constructor(page) {

        this.page = page;

        this.nameInput = page.getByPlaceholder('eg. Jhon Doe');

        this.countryDropdown = page.locator('select').nth(0);

        this.accountTypeDropdown = page.locator('select').nth(1);

        this.emailInput = page.getByPlaceholder('eg. user@user.com');

        this.passwordInput = page.getByPlaceholder('Enter password').first();

        this.confirmPasswordInput = page.getByPlaceholder('Enter password').nth(1);

        this.signupButton = page.getByRole('button', { name: /signup/i });
    }

    async openRegistrationPage() {

        await this.page.goto('https://practice.qabrains.com/registration');
    }

    async registerUser(name, country, email, password) {

        await this.nameInput.fill(name);

        await this.countryDropdown.selectOption({ label: country });

        await this.accountTypeDropdown.selectOption({ index: 1 });

        await this.emailInput.fill(email);

        await this.passwordInput.fill(password);

        await this.confirmPasswordInput.fill(password);

        await this.signupButton.click();
    }
}

import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('Invalid Registration Validation Scenarios', () => {

    test('Verify error for empty form submission', async ({ page }) => {

        const registrationPage = new RegistrationPage(page);

        await registrationPage.openRegistrationPage();

        await registrationPage.clickSignup();

        // Validation checks
        await expect(page.locator('text=Name is required')).toBeVisible();
        await expect(page.locator('text=Email is required')).toBeVisible();
        await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('Verify invalid email validation', async ({ page }) => {

        const registrationPage = new RegistrationPage(page);

        await registrationPage.openRegistrationPage();

        await registrationPage.enterName('Sneha');
        await registrationPage.selectCountry('India');
        await registrationPage.enterEmail('invalidemail');
        await registrationPage.enterPassword('Test@123');
        await registrationPage.confirmPassword('Test@123');

        await registrationPage.clickSignup();

        // Validation check
        await expect(page.locator('text=Invalid email')).toBeVisible();
    });

    test('Verify password mismatch validation', async ({ page }) => {

        const registrationPage = new RegistrationPage(page);

        await registrationPage.openRegistrationPage();

        await registrationPage.enterName('Sneha');
        await registrationPage.selectCountry('India');
        await registrationPage.enterEmail('sneha@test.com');
        await registrationPage.enterPassword('Test@123');
        await registrationPage.confirmPassword('Wrong@123');

        await registrationPage.clickSignup();

        // Validation check
        await expect(page.locator('text=Passwords do not match')).toBeVisible();
    });

    test('Verify short password validation', async ({ page }) => {

        const registrationPage = new RegistrationPage(page);

        await registrationPage.openRegistrationPage();

        await registrationPage.enterName('Sneha');
        await registrationPage.selectCountry('India');
        await registrationPage.enterEmail('sneha@test.com');
        await registrationPage.enterPassword('123');
        await registrationPage.confirmPassword('123');

        await registrationPage.clickSignup();

        // Validation check
        await expect(page.locator('text=Password must be')).toBeVisible();
    });

});

export class ForgotPasswordPage {

    constructor(page) {

        this.page = page;

        this.emailInput = page.getByPlaceholder('eg. user@user.com');

        this.resetButton = page.getByRole('button', { name: /reset password/i });
    }

    async openForgotPasswordPage() {

        await this.page.goto('https://practice.qabrains.com/forgot-password');
    }

    async resetPassword(email) {

        await this.emailInput.fill(email);

        await this.resetButton.click();
    }
}

//npx playwright test tests/forgotPassword.spec.js --project=chromium --headed

import { test, expect } from '@playwright/test';

import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

import { forgotPasswordData } from '../utils/testData';


test('Forgot Password Test', async ({ page }) => {

    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.openForgotPasswordPage();

    await forgotPasswordPage.resetPassword(

        forgotPasswordData.email
    );

    await expect(
        page.getByText(
            `Password has been sent to ${forgotPasswordData.email}`
        )
    ).toBeVisible();
});
