//npx playwright test ./Fora/EditTripFlow.spec.js --project=chromium --headed 
const { test, expect } = require('@playwright/test');

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
// Test Case 01 Create trip with required field only
// ==================================================
test('TC-01: Create trip with required field only', async ({ page }) => {

  await expect(
    page.getByTestId('create-trip-container')
        .getByRole('heading', { name: 'Create a trip' })
  ).toBeVisible();

  const tripName = 'UAE Trip';
  await page.fill("input[placeholder='Enter name']", tripName);

  await expect(
    page.locator("//div[contains(@class,'text-subheader')]")
  ).toHaveText(tripName);

  await expect(page.locator("button:has-text('Create Trip')")).toBeEnabled();
  await page.locator("//span[normalize-space()='Create trip']").click();
  await page.waitForTimeout(4000);

  //  Wait for trip details to load
  const tripNameDetail = page.locator("//span[@class='break-words overflow-hidden']");
  
  //  Validate trip name is correct for TC02
  await expect(tripNameDetail).toBeVisible();
  await expect(tripNameDetail).toHaveText('UAE Trip');

  // Optional: small wait for stability
  await page.waitForTimeout(1000); 

// ==================================================
// EDIT EXISTING TRIP NAME -TODAY TASK
// ==================================================
    
  //1) Click on Edit icon
  const editIcon = page.locator("//div[@class='hidden tablet:inline-block']");
  await expect(editIcon).toBeVisible();
  await editIcon.click();

  // 2) Wait for Edit Trip input to appear
  await page.waitForTimeout(2000);
  const editTripNameInput = page.locator("input[placeholder='Enter name']");

  await expect(editTripNameInput).toBeVisible();

  // 3) Clear existing value & enter new trip name
  await editTripNameInput.fill(''); 
  await editTripNameInput.fill('UAE FAM TRIP');

  // Optional wait for UI stability
  await page.waitForTimeout(1000); 

  // 4) Wait for Save button to be enabled and click
  const saveButton = page.locator(
    "//footer[@class='w-full flex p-4 border-t border-border-primary justify-between']//button[@type='button'][normalize-space()='Save']"
  );

  await saveButton.waitFor({ state: 'visible', timeout: 10000 });
  await saveButton.click();

  //wait for footer to disappear (modal close)
  await page.waitForSelector(
    "//footer[@class='w-full flex p-4 border-t border-border-primary justify-between']",
    { state: 'detached', timeout: 15000 }
  );

  // 7) Validate updated trip name
  const updatedTripName = page.locator(
    "//span[@class='break-words overflow-hidden']"
  );

  await expect(updatedTripName).toBeVisible();
  await expect(updatedTripName).toHaveText('UAE FAM TRIP');
});

// ===============================
// After Each Hook — Back and Validate Another Page
// ===============================
test.afterEach(async ({ page }) => {

  await page.waitForTimeout(3000);

  // 1) Click Back Arrow to go to Trips page
  const backArrow = page.locator("//a[@aria-label='Back']//*[name()='svg']");
  
  if (await backArrow.isVisible()) 
    {
    await backArrow.click();
    }

  // 2) Locate trip name (first match)
  const tripNameLocator = page
    .locator("//span[contains(@class,'w-0 grow text-wrap tablet:truncate font-semibold')]")
    .first();

  await tripNameLocator.waitFor({ state: 'visible', timeout: 10000 });

  await expect(tripNameLocator).toContainText('UAE FAM TRIP');

  console.log('Trip name "UAE FAM TRIP" successfully validated on Trips page');
});

