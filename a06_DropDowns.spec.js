const {test,expect}=require('@playwright/test')

test('Handle Dropdowns',async({page})=>{

    await page.goto('https://testing.qaautomationlabs.com/dropdown.php');

    //Multiple ways to select option from the Dropdown

    /*await page.locator('#fruitDropdown').selectOption({label:'Apple'});  //->label/Visible text
    await page.locator('#fruitDropdown').selectOption('Apple');   //->Visible text
    await page.locator('#fruitDropdown').selectOption({value:'Apple'});  //->by using value
    await page.selectOption('#fruitDropdown','Apple');*/

    //Assertions
    
    // 1) Check number of options in dropdown -- Approach1
    /*const options=await page.locator('#fruitDropdown option')
    await expect(options).toHaveCount(5);*/

    // 2) Check number of options in Dropdown -- Approach2
    /*const options=await page.$$('#fruitDropdown option')
    console.log("Number of Options:",options.length)
    await expect(options.length).toBe(5);*/

    // 3) Check presence of value in the Dropdown -- Approach1
    /*const Content=await page.locator('#fruitDropdown').textContent()
    await expect(Content.includes('Apple')).toBeTruthy();*/

    // 4) Check presence of value in the Dropdown using 'Looping statement' -- Approach2
      /* const options = await page.$$('#fruitDropdown option')
       let status = false;
       for (const option of options) 
        {
            //console.log(await option.textContent())
            let value = await option.textContent();
            if(value.includes('Apple')) 
                {   
                    status = true;
                     break;
                 }
        }
        
        expect(status).toBeTruthy();*/


        //Get the Text-Content 
        /*const options = await page.$$('#fruitDropdown option')
        for (const option of options) 
        {
            console.log(await option.textContent())
        }*/
        
    // 5) Select option from the Dropdown using Loop
    const options = await page.$$('#fruitDropdown option')
    for (const option of options) 
        {
            let value = await option.textContent();
            if(value.includes('Apple')) 
                {   
                    await page.selectOption('#fruitDropdown','Apple');
                    break;
                 }
        }
    
        
        await page.waitForTimeout(3000);
})
