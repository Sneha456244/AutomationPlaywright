const {test , expect}=require('@playwright/test')

test ('Mouse Hover', async ({page})=>{

    await page.goto('https://demo.automationtesting.in/Register.html')

    const switchToo=await page.locator("//a[normalize-space()='SwitchTo']")
    const Framess = await page.locator("//a[normalize-space()='Frames']")

    //MouseHover
    await switchToo.hover()
    await Framess.hover()

    await page.waitForTimeout(5000)

})
