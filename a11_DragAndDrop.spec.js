const { test, expect } = require('@playwright/test');

test("Drag and Drop", async ({ page }) => {

  await page.goto('https://www.globalsqa.com/demo-site/draganddrop/', {
    timeout: 60000
  });

  //Simple Approach
  /* // Pick the FIRST iframe explicitly
  const frame = page.frameLocator('iframe.demo-frame').first();

  // Source and Target
  const draggable = frame.locator('#gallery li').first();
  const trash = frame.locator('#trash');

  // Drag and Drop
  await draggable.dragTo(trash);*/

  const frame = page.frameLocator('iframe.demo-frame').first();
  const trash = frame.locator('#trash');

  // Approach 1 -> drag one image
  await frame.locator('#gallery li').first().dragTo(trash);
  await page.waitForTimeout(1000);

  // Approach 2 -> drag 2 image
  const images = frame.locator('#gallery li');
  for (let i = 0; i < 2; i++) {
    await images.first().dragTo(trash);
    await page.waitForTimeout(1000);
  }

  // Approach 3 ->drag image using MouseHover Action
  const source = frame.locator('#gallery li').first();

  const sourceBox = await source.boundingBox();
  const targetBox = await trash.boundingBox();

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );
  await page.mouse.down();

  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 15 }
  );
  await page.mouse.up();

  // Assertion 
  const trashCount = await trash.locator('li').count();
  expect(trashCount).toBeGreaterThan(0);

  await page.waitForTimeout(3000);
});
