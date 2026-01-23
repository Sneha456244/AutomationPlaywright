const { test, expect } = require('@playwright/test')

test('Built-inLocators Demo', async ({ page }) => {

await page.goto('https://www.saucedemo.com/')

// getByPlaceholder()
await page.getByPlaceholder('Username').fill('standard_user')
await page.getByPlaceholder('Password').fill('secret_sauce')

// getByRole()
await page.getByRole('button', { name: 'Login' }).click()

// Verify successful login using text
await expect(await page.getByText('Products')).toBeVisible()

})
