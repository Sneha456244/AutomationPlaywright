//npx playwright test ./Fora/ForTripImage.spec.js --project=chromium --headed 
const { test, expect } = require('@playwright/test');
test.setTimeout(90_000); // 90 seconds

// ==================================================
// Before Each Hook — Login & Navigate to Create Trip
// ==================================================
test.beforeEach(async ({ page }) => {

  // ===============================
  // 1) Login Section
  // ===============================

  // Open Fora Advisor Portal
  await page.goto('https://advisor.forastaging.net/');

  // Click "Sign in here" link
  await page.locator("a:has-text('Sign in here')").click();

  // Wait for Login form to load
  await page.waitForSelector('#username', { timeout: 20000 });

  // Enter Username
  await page.locator('#username').fill('mythili+030226@qaoncloud.com');

  // Enter Password
  await page.locator('#password').fill('Qaoncloud@01');

  // Click Sign In button
  await page.locator("button[type='submit']:has-text('Sign in')").click();

  // ===============================
  // 2) Home Page Validation Section
  // ===============================

  // Wait for Home page to load
  await page.waitForSelector("//h2[normalize-space()='Home']", { timeout: 20000 });

  // Verify Home heading is visible
  await expect(page.locator("//h2[normalize-space()='Home']")).toBeVisible();

  // wait
  await page.waitForTimeout(2000);

  // ===============================
  // 3) Click on Search
  // ===============================
  await page.locator('[data-testid="nav_bar_search"]').click();

  // ===============================
  // 4) Search "trips" and click Trips
  // ===============================

  // Wait for search input to appear
  await page.waitForSelector("input[type='search'], input[placeholder*='Search']", { timeout: 20000 });

  // Type "trips" in search
  await page.locator("input[type='search'], input[placeholder*='Search']").fill('trips');

  // Wait for Trips result
  await page.waitForSelector("text=Trips", { timeout: 10000 });

  // Click on Trips
  await page.waitForSelector('#page-2', { timeout: 20000 });
  await page.locator('#page-2').click();

  // ===============================
  // 5) Click on Create Trip button
  // ===============================
  await expect(page.locator("//span[normalize-space()='Create trip']")).toBeVisible();
  await page.locator("//span[normalize-space()='Create trip']").click();

  // wait for Create Trip page to fully load
  await page.waitForTimeout(3000);
});

// ==================================================
// Test Case - ADD TRIP IMAGE
// ==================================================
test('TC-01: ADD TRIP IMAGE', async ({ page }) => {

  // a) Enter Trip Name
  const tripName = 'Thanjavur';
  await page.fill("input[placeholder='Enter name']", tripName);
  await expect(page.locator("//div[contains(@class,'text-subheader')]")).toHaveText(tripName);
  await page.waitForTimeout(1000);

  // b) Add Travelers
  /*await page.locator("div.cursor-pointer.w-full.text-text-primary.text-left.border.border-border-primary.rounded-xl").click();
  await page.locator("//input[@type='checkbox']").first().check(); // pick the first traveler
  const travelerSummary = page.locator("//div[@class='pb-1 font-normal']");
  await expect(travelerSummary).toContainText('Mythili V');*/
  await page.waitForTimeout(1000);

  // c) Select Trip Reason
  const tripReasonBtn = page.locator("button[data-testid='select-trip-reason']");
  await tripReasonBtn.click();
  await page.waitForTimeout(500); // wait for dropdown
  await page.locator("//div[contains(text(),'Family trip')]").click();
  await page.waitForTimeout(500);

  const summaryCard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(summaryCard).toContainText('Family trip');
  await page.waitForTimeout(500);

  // d) Select Estimated Date
  await page.locator("//button[normalize-space()='Estimated']").click();
  await page.waitForTimeout(500);
  await page.locator("[data-testid='select-select-estimated-travel-month']").click();
  const febOption = page.locator("text=February 2026");
  await febOption.waitFor({ state: 'visible', timeout: 5000 });
  await febOption.click();
  await page.waitForTimeout(500);

  const summarycard = page.locator("//div[@class='flex flex-wrap gap-x-2 text-text-secondary font-normal']");
  await expect(summarycard).toContainText('February 2026');
  await page.waitForTimeout(500);

// ==================================================
// e) Add Trip Image
// ==================================================
  
  const uploadSection = page.locator("//button[normalize-space()='+ Upload an image']");
  await expect(uploadSection).toBeVisible({ timeout: 10000 });
  await uploadSection.click();
  await page.waitForTimeout(500);

  const bookingPlatform = page.locator("//button[normalize-space()='Booking platform']");
  await expect(uploadSection).toBeVisible({ timeout: 10000 });
  await bookingPlatform.click();
  await page.waitForTimeout(500);

  const searchInput = page.locator("input[placeholder='Search'][data-dd-privacy='allow']");
  await searchInput.fill("Thanjavur");
  await page.waitForTimeout(500);

  const searchBtn = page.locator("//button[normalize-space()='Search']");
  await expect(searchBtn).toBeVisible({ timeout: 10000 });
  await searchBtn.click();

  // Wait for results to load
  const firstResult = page.locator("[data-testid='supplier-card']").first();

  await expect(firstResult).toBeVisible({ timeout: 10000 });
  await firstResult.click();
  await page.waitForTimeout(500);

  // Wait for images to load
  await page.waitForSelector("[data-testid='selection-card']", { timeout: 10000 });

  // Click on second image (index 1)
  const secondImage = page.locator("[data-testid='selection-card']").nth(1);

  await expect(secondImage).toBeVisible();
  await secondImage.click();
  await page.waitForTimeout(500);

  await page.locator("//button[normalize-space()='Add 1 image']").click();

  // Wait for Crop Image icon to appear
  const cropImageBtn = page.locator("[data-testid='crop-image']");

  await expect(cropImageBtn).toBeVisible({ timeout: 10000 });

  // Click Crop icon
  await cropImageBtn.click();
  // Wait for Rotate Left button to be visible
 const rotateLeftBtn = page.locator("[data-testid='image-cropper-rotate-left-btn']");

 await expect(rotateLeftBtn).toBeVisible({ timeout: 10000 });

 // Click rotate button 2 times
 await rotateLeftBtn.click();
 await page.waitForTimeout(500);  // small wait for rotation animation
 await rotateLeftBtn.click();
 await page.waitForTimeout(500);

 // Wait for Crop button
 const cropConfirmBtn = page.locator("//button[normalize-space()='Crop']");

 await expect(cropConfirmBtn).toBeVisible({ timeout: 10000 });

 // Click Crop
 await cropConfirmBtn.click();
 await page.waitForTimeout(500);

 // Wait for Save button to be visible & enabled
const saveImageBtn = page.locator("[data-testid='image-manager-save-btn']");

await expect(saveImageBtn).toBeVisible({ timeout: 10000 });
await expect(saveImageBtn).toBeEnabled();

// Click Save
await saveImageBtn.click();

//Validation (img)
await expect(page.locator("img[alt='Trip preview image']")).toBeVisible();

await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();
await page.locator("//span[normalize-space()='Create trip']").click();
await page.waitForTimeout(4000);

});

// ==================================================
// After Each Hook — Validate Trip Image
// ==================================================
test.afterEach(async ({ page }) => {

  // Optional: wait for trip details to load
  await page.waitForTimeout(2000);
  await page.locator("//button[contains(@class,'shadow-md') and contains(@class,'rounded-[10px]')]").click();
  await page.waitForTimeout(500);

await page.locator("//button[normalize-space()='Unsplash']").click();
await page.waitForTimeout(500);

// Fill search field
await page.locator("input[data-dd-privacy='allow']").fill("Thanjavur temple");

// Click Search
await page.locator("//button[normalize-space()='Search']").click();

await page.waitForTimeout(500);

await page.waitForSelector("[data-testid='selection-card']", { timeout: 10000 });

const images = page.locator("[data-testid='selection-card']");
await images.nth(3).click();

await page.locator("//button[normalize-space()='Add 1 image']").click();
await page.waitForTimeout(500);

await page.locator("//button[normalize-space()='Replace image']").click();
await page.waitForTimeout(3000);

})
