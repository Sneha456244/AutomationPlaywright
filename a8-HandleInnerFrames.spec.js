const { test, expect } = require('@playwright/test');

// 1) Select first checkbox in inner frame

test('Inner frames - select first checkbox', async ({ page }) => {

  await page.goto('https://ui.vision/demo/webtest/frames/');

  await page
    .frameLocator("frame[src='frame_3.html']")
    .frameLocator('iframe')
    .locator("div[role='checkbox']")
    .first()
    .click();

  await page.waitForTimeout(3000);
});


// 2) Select second checkbox in inner frame

test('Inner frames - select second checkbox', async ({ page }) => {

  await page.goto('https://ui.vision/demo/webtest/frames/');

  await page
    .frameLocator("frame[src='frame_3.html']")
    .frameLocator('iframe')
    .locator("div[role='checkbox']")
    .nth(1)
    .click();

  await page.waitForTimeout(3000);
});


// 3) Validate checkbox is selected

test('Inner frames - validate checkbox selected', async ({ page }) => {

  await page.goto('https://ui.vision/demo/webtest/frames/');

  const checkbox = page
    .frameLocator("frame[src='frame_3.html']")
    .frameLocator('iframe')
    .locator("div[role='checkbox']")
    .first();

  await checkbox.click();
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');

  await page.waitForTimeout(3000);
});


// 4) Fill text inside Frame 3 input

test('Frame 3 - fill input box', async ({ page }) => {

  await page.goto('https://ui.vision/demo/webtest/frames/');

  await page
    .frameLocator("frame[src='frame_3.html']")
    .locator("input[name='mytext3']")
    .fill('Hello Playwright');

  await page.waitForTimeout(3000);
});


// 5) Count total frames on page

test('Frames - count total frames', async ({ page }) => {

  await page.goto('https://ui.vision/demo/webtest/frames/');

  const frames = page.frames();
  console.log('Total number of frames:', frames.length);

  expect(frames.length).toBeGreaterThan(1);
});
