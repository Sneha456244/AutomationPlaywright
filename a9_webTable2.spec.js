const { test, expect } = require('@playwright/test')

test('handling DataTables ajax table', async ({ page }) => {

    await page.goto('https://datatables.net/examples/data_sources/ajax.html')

    // Wait for table data to load
    await page.waitForSelector('#example tbody tr')

    const table = page.locator('#example')

    // 1) total number of columns
    const columns = table.locator('thead tr th')
    console.log('Number of columns:', await columns.count())
    expect(await columns.count()).toBe(6)

    // 2) total number of rows (current page only)
    const rows = table.locator('tbody tr')
    console.log('Number of rows:', await rows.count())
    expect(await rows.count()).toBeGreaterThan(0)

    // 3) select a row using reusable function
    // await selectEmployee(rows, page, 'Airi Satou')
    // await selectEmployee(rows, page, 'Bruno Nash')

    // 4) print all row data (current page)
    for (let i = 0; i < await rows.count(); i++) {
        const row = rows.nth(i)
        const tds = row.locator('td')

        for (let j = 0; j < await tds.count(); j++) {
            console.log(await tds.nth(j).textContent())
        }
        
    }

    // 5) read data from all pages
    const pages = page.locator('#example_paginate span a')
    console.log('Number of pages:', await pages.count())

    for (let p = 0; p < await pages.count(); p++) {
        await pages.nth(p).click()
        await page.waitForTimeout(1000)

        const pageRows = table.locator('tbody tr')

        for (let i = 0; i < await pageRows.count(); i++) {
            const row = pageRows.nth(i)
            const tds = row.locator('td')

            for (let j = 0; j < await tds.count(); j++) {
                console.log(await tds.nth(j).textContent())
            }
            
        }
    }
})


// reusable function
async function selectEmployee(rows, page, name) {

    const matchedRow = rows.filter({
        has: page.locator('td'),
        hasText: name
    })

    await matchedRow.click()
}
