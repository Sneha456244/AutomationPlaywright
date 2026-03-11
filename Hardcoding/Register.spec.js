module.exports = {

URL: "https://demo.automationtesting.in/Register.html",

FIRSTNAME: "Sneha",
LASTNAME: "Tester",
ADDRESS: "Chennai Tamil Nadu India",
EMAIL: "sneha@test.com",
PHONE: "9876543210",

PASSWORD: "Test@123",

SKILL: "Java",

YEAR: "1998",
MONTH: "May",
DAY: "10"

};
// npx playwright test ./Hardcoding/Register.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');
const data = require('./testdata04');


// =========================
// Before Each
// =========================

test.beforeEach(async ({ page }) => {

console.log("Test Started");

await page.goto(data.URL);

await page.waitForLoadState('domcontentloaded');

console.log("Application launched");

});


// =========================
// Test Case
// =========================

test("Automation Demo Register Flow", async ({ page }) => {


// Validate Register Page
const registerHeading = page.locator("//h2[text()='Register']");
await expect(registerHeading).toBeVisible();
await page.waitForTimeout(500);

console.log("Register page validated");

// First Name
const firstName = page.locator("//input[@placeholder='First Name']");
await firstName.fill(data.FIRSTNAME);
await page.waitForTimeout(500);

console.log("First name entered");

// Last Name
const lastName = page.locator("//input[@placeholder='Last Name']");
await lastName.fill(data.LASTNAME);
await page.waitForTimeout(500);

console.log("Last name entered");

// Address
const address = page.locator("//textarea[@ng-model='Adress']");
await address.fill(data.ADDRESS);
await page.waitForTimeout(500);

console.log("Address entered");

// Email
const email = page.locator("//input[@type='email']");
await email.fill(data.EMAIL);
await page.waitForTimeout(500);

console.log("Email entered");

// Phone
const phone = page.locator("//input[@type='tel']");
await phone.fill(data.PHONE);
await page.waitForTimeout(500);

console.log("Phone entered");

// Gender
const gender = page.locator("//input[@value='FeMale']");
await gender.check();
await page.waitForTimeout(500);

console.log("Gender selected");

// Hobbies
const hobby1 = page.locator("#checkbox1");
const hobby2 = page.locator("#checkbox2");

await hobby1.check();
await hobby2.check();
await page.waitForTimeout(500);

console.log("Hobbies selected");

// Languages
const language = page.locator("#msdd");

await language.click();

await page.locator("//a[text()='English']").click();
await page.waitForTimeout(500);
await page.locator("//a[text()='Hindi']").click();
await page.waitForTimeout(500);

await page.locator("body").click();

console.log("Languages selected");

// Skills Dropdown
const skills = page.locator("#Skills");

await expect(skills).toBeVisible();
await skills.selectOption(data.SKILL);
await page.waitForTimeout(500);

console.log("Skill selected");

// Country skipped
console.log("Country dropdown skipped");

// Date Of Birth
const year = page.locator("#yearbox");
await year.selectOption(data.YEAR);
await page.waitForTimeout(500);

const month = page.locator("//select[@placeholder='Month']");
await month.selectOption(data.MONTH);
await page.waitForTimeout(500);

const day = page.locator("#daybox");
await day.selectOption(data.DAY);
await page.waitForTimeout(500);

console.log("DOB selected");

// Password
const password = page.locator("#firstpassword");
await password.fill(data.PASSWORD);
await page.waitForTimeout(500);

// Confirm Password
const confirmPassword = page.locator("#secondpassword");
await confirmPassword.fill(data.PASSWORD);
await page.waitForTimeout(500);

console.log("Password entered");

// Submit Button
const submit = page.locator("#submitbtn");
await expect(submit).toBeVisible();
await submit.click();
console.log("Submit clicked");

await page.waitForTimeout(2000);

});


// =========================
// After Each
// =========================

test.afterEach(async () => {

console.log("Test Completed Successfully");

});
