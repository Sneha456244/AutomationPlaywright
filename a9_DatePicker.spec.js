const { test, expect } = require('@playwright/test')

test("Date Picker", async ({ page }) => {

    await page.goto('https://jqueryui.com/datepicker/')

    const year = "2022"
    const month = "March"
    const date = "25"

    // Switch to iframe
    const frame = page.frameLocator('.demo-frame')

    // Open calendar
    await frame.locator('#datepicker').click()

    while (true) {

        const currentYear = await frame.locator('.ui-datepicker-year').textContent()
        const currentMonth = await frame.locator('.ui-datepicker-month').textContent()

        if (currentYear === year && currentMonth === month) {
            break
        }

        // For past dates
        await frame.locator('[title="Prev"]').click()

        // For future dates → use this instead
        // await frame.locator('[title="Next"]').click()
    }
    
    //date selection using loop 
    
    /*for (const dt of dates) 
    { 
    if (await dt.textContent() === date) 
    { 
    await dt.click() 
    break 
    } 
    }*/

    //Date selection WITHOUT loop (EXACT)
    await frame.locator(`//a[@class='ui-state-default' and text()='${date}']`).click()

    await page.waitForTimeout(3000)
})
