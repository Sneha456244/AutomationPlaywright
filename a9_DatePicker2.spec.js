const { test, expect } = require('@playwright/test');

test("Date Picker", async ({ page }) => {

    await page.goto('https://demoqa.com/date-picker', { timeout: 60000 });

    const year = "2027";
    const month = "April";
    const date = "24";

    // Open calendar
    const dateInput = page.locator('#datePickerMonthYearInput');
    await dateInput.click();

    // Wait for calendar
    await page.locator('.react-datepicker').waitFor({ state: 'visible' });

    const nextButton = page.locator('.react-datepicker__navigation--next');

    // Navigate to month/year
    while (true) {
        const currentMonthYear = await page.locator('.react-datepicker__current-month').textContent();

        if (currentMonthYear.includes(month) && currentMonthYear.includes(year)) {
            break;
        }

        await nextButton.click();
        await page.waitForTimeout(150); 
    }

    // Select date
    await page.click(
        `.react-datepicker__day:not(.react-datepicker__day--outside-month):has-text("${date}")`
    );

    // Validate selected date
    const selectedDate = await dateInput.inputValue();
    console.log("Selected Date:", selectedDate);

    expect(selectedDate).toBe('04/24/2027');

    await page.waitForTimeout(3000);
});
