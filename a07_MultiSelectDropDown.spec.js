const { test, expect } = require('@playwright/test');

test("Handle MultiSelect dropdowns", async ({ page }) => {

  await page.goto('https://demoqa.com/select-menu');


  const multiSelectInput = page.locator("(//div[contains(@class,'css-1hwfws3')])[3]");

  await multiSelectInput.scrollIntoViewIfNeeded();
  await multiSelectInput.click();

  // React multi-select -> type text + Enter (NOT click with text)
  await page.keyboard.type('Green');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Blue');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Black');
  await page.keyboard.press('Enter');

  await page.keyboard.type('Red');
  await page.keyboard.press('Enter');

  // Assertions 

  // 1) check number of options in the dropdown
  /*const selectedValues = page.locator("(//div[contains(@class,'css-12jo7m5')])");
  await expect(selectedValues).toHaveCount(4);*/

  // 2) check number of options in the dropdown using JS array
  const option=await page.$$("(//div[contains(@class,'css-12jo7m5')])");
  await expect(option.length).toBe(4);

  // 3) check presence of value in the dropdown
  /*const Content = page.locator("(//div[contains(@class,'css-1hwfws3')])[3]").textContent();
  //await expect(Content.includes('Black')).toBeTruthy();
  await expect(Content).toContain('Black');*/

  await page.waitForTimeout(5000);


});
