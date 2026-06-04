const {test,expect}=require('@playwright/test');
const { type } = require('node:os');

test.skip('Alert Okay button',async({page})=> {

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts?utm_source=chatgpt.com");
    await page.waitForTimeout(500);

    page.on('dialog', async dialog=>{
        expect(dialog.type()).toContain("Alert");
        expect(dialog.message()).toContain("I am a JS Alert");

        await dialog.accept();
    })
})

test.skip('Alert Okay and Confirm button',async({page})=> {

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts?utm_source=chatgpt.com");
    await page.waitForTimeout(500);

    page.on('dialog', async dialog=>{
        expect(dialog.type()).toContain("Confirm");
        expect(dialog.message()).toContain("I am a JS Confirm");

        //await dialog.accept();
        await dialog.dismiss();
    })
})

test('Promt Dialog',async({page})=> {

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts?utm_source=chatgpt.com");
    await page.waitForTimeout(500);

    page.on('dialog', async dialog=>{
        expect(dialog.type()).toContain("Prompt");
        expect(dialog.message()).toContain("I am a JS prompt");

        await dialog.accept("test");
    })
})
