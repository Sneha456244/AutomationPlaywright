//Hard Assertion -> it will terminate the execution whenever it got failed
const { test, expect } = require('@playwright/test')

test('AssertionTest', async ({ page }) => {

    // Open app URL
    await page.goto('https://demo.nopcommerce.com/register')

    // 1) expect(page).toHaveURL() -> page has URL
    await expect(page).toHaveURL('https://demo.nopcommerce.com/register')

    // 2) expect(page).toHaveTitle() -> page has Title
    await expect(page).toHaveTitle('nopCommerce demo store. Register')

    // 3) expect(locator).toBeVisible() -> Element is visible
    const LogoElement = page.locator('.header-logo')
    await expect(LogoElement).toBeVisible()

    // 4) expect(locator).toBeEnabled() -> control is enabled
    const searchStoreBox = page.locator('#small-searchterms')
    await expect(searchStoreBox).toBeEnabled()

    // 5) expect(locator).toBeChecked() -> Radio/checkbox is checked

    // Radio button
    const maleRadioButton = page.locator('#gender-male')
    await maleRadioButton.click()
    await expect(maleRadioButton).toBeChecked()

    // Defult Newsletter checkbox checked
    const newsletterCheckbox = page.locator('#NewsLetterSubscriptions_0__IsActive')
    await expect(newsletterCheckbox).toBeChecked()

    // 6) expect(locator).toHaveAttribute()   ->Element has attribute
    const regButton=page.locator('#register-button')
    await expect(regButton).toHaveAttribute('type','submit')

    // 7) expect(locator).toHaveText()    ->Element matches text
    await expect(await page.locator('.page-title h1')).toHaveText('Register')  //full text

    // 8) expect(locator).toContainText()    ->Element contains Text
    await expect(await page.locator('.page-title h1')).toContainText('Reg')      //partial text

    // 9) expect(locator).toHaveValue(value)   ->Input has a value
    const emailInput=await page.locator('#Email')
    await emailInput.fill('test123@gmail.com')
    await expect(emailInput).toHaveValue('test123@gmail.com')

    // 10) expect(locator).toHaveCount()          ->List of element has given length
    const options=await page.locator('select[name="customerCurrency"] option')
    await expect(options).toHaveCount(2)


});
