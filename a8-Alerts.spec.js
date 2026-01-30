const { test, expect } = require('@playwright/test');

test.skip('Alert with OK', async ({ page }) => {

  await page.goto('https://demo.automationtesting.in/Alerts.html');

  // Enabling dialog window handler
  page.on('dialog', async dialog => {

    expect(dialog.type()).toContain('alert');
    expect(dialog.message()).toContain('I am an alert box!');

    await dialog.accept();
  });

  await page.click('button:has-text("click the button to display an alert box:")');
  await page.waitForTimeout(5000);
});


test.skip('Confirmation Dialog - Alert with OK and Cancel', async ({ page }) => {

  await page.goto('https://demo.automationtesting.in/Alerts.html');

  // Click Confirm Alert tab
  await page.click('a[href="#CancelTab"]');

  // Enabling dialog window handler
  page.on('dialog', async dialog => {

    expect(dialog.type()).toContain('confirm');
    expect(dialog.message()).toContain('Press a Button !');

    await dialog.accept();   // OK
    // await dialog.dismiss(); // Cancel
  });

  await page.click('button:has-text("click the button to display a confirm box")');
  await page.waitForTimeout(5000);
});


test('Prompt Dialog', async ({ page }) => {

  await page.goto('https://demo.automationtesting.in/Alerts.html');

  // Click Prompt Alert tab
  await page.click('a[href="#Textbox"]');

  // Enabling dialog window handler
  page.on('dialog', async dialog => {

    expect(dialog.type()).toContain('prompt');
    expect(dialog.message()).toContain('Please enter your name');

    await dialog.accept('Sney');
  });

  await page.click('button:has-text("click the button to demonstrate the prompt box")');

  await page.waitForTimeout(5000);
});
