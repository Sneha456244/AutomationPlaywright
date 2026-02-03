const {test,expect}=require('@playwright/test')

test ('Mouse Right Click ',async({page})=>{

    await page.goto('http://swisnl.github.io/jQuery-contextMenu/demo.html')

    const button=await page.locator("//span[@class='context-menu-one btn btn-neutral']")

    //Right click action
    await button.click({button:'right'});

    await page.waitForTimeout(4000)
})
