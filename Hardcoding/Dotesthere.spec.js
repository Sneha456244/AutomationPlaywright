module.exports = {

URL: "https://dotesthere.com/#",

}
// npx playwright test ./Hardcoding/Dotesthere.spec.js --project=chromium --headed

const { test, expect } = require('@playwright/test');
const data = require('./testdata07');


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

test("Automation DO TEST HERE APP Flow", async ({ page }) => { 

    // Add/Remove Elements section 
    const AddElement = page.locator("//button[normalize-space()='Add Element']")
    await AddElement.click();
    await page.waitForTimeout(1000);

    const DelElement = page.locator("//button[@class='delete-btn']")
    await DelElement.click();
    await page.waitForTimeout(1000);

    // click on Basic Auth (admin/admin) button & validate the message
    const AuthElement = page.locator("//button[normalize-space()='Test Basic Auth']")
    await AuthElement.click();
    await page.waitForTimeout(1000);

    // Validate Message
    const successMsg = page.locator("//p[contains(text(),'Congratulations! You must have the proper credenti')]");
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText("Congratulations!");
    console.log("Basic Auth message validated successfully");
    await page.waitForTimeout(1000);

    // In Challenging DOM section click on Edit
    await page.locator("button.btn-edit").nth(0).click(); // 1st row
    await page.waitForTimeout(1000);
    
    // Input appears globally (NOT inside row)
    const inputField = page.locator("input[type='text']").first();

    // Wait for input to be visible
    await inputField.waitFor({ state: "visible" });

    // Clear existing value
    await inputField.clear();

    // Fill new value
    await inputField.fill("Adipisci001");
    await page.waitForTimeout(1000);
    await page.locator("button.btn-save").nth(0).click();
    await page.waitForTimeout(1000);

    // Click on the Checkbox
    const checkbox = page.locator("#checkbox1");
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await page.waitForTimeout(1000);

    // Right click action
    await page.locator("//div[@id='hot-spot']").click({ button: 'right' });
    console.log("Right click performed successfully");
    await page.waitForTimeout(1000);

    // Alert Appears After Right Click
    page.on('dialog', async dialog => 
        {
            const message = dialog.message();
            console.log(message);
            if (message.includes("You selected a context menu")) 
                {
                    console.log("Alert validated");
                }
                await dialog.accept(); 
        });
        await page.waitForTimeout(1000);

    // click on Drag & Drop function
    const DragandDrop = page.locator("//button[normalize-space()='Test Drag & Drop']")
    await DragandDrop.click();

    // Validate Message
    const successMsg02 = page.locator("(//p[@id='drag-status'])[1]");
    await expect(successMsg02).toBeVisible();
    await expect(successMsg02).toContainText("Status: Test swap completed - try dragging now!");
    console.log("dragging message validated successfully");
    await page.waitForTimeout(1000);

});
