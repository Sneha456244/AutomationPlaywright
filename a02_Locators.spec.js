//const {test , expect}=require('@playwright/test')
import {test , expect} from '@playwright/test'

test ('Locators', async ({page})=>{

    await page.goto("https://www.demoblaze.com/index.html");

//Click on login button property
    //await page.locator('id=login2').click
    await page.click('id=login2')

//provide Username Css
    //await page.locator('#loginusername').fill("pavanol")
    //await page.type('#loginusername','pavanol')
    await page.fill('#loginusername','pavanol')

//provide Password Css
    await page.fill("input[id='loginpassword']",'test@123')

//Click on Login button
    await page.click("//button[normalize-space()='Log in']")

//Verify Logout link is present
    const logoutlink= await page.locator("//a[normalize-space()='Log out']")
    await expect(logoutlink).toBeVisible();

    await page.close()
   
})
