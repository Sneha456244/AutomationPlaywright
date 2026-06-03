const {test,expect} = require('@playwright/test');

test('Book checkoutflow', async({page})=> {

    test.setTimeout(60000);

    await page.goto("https://demowebshop.tricentis.com/");
    await page.waitForTimeout(500);

    await expect(page).toHaveURL("https://demowebshop.tricentis.com/");
    await page.waitForTimeout(500);

    const Booktab=await page.locator("//ul[@class='top-menu']//a[normalize-space()='Books']")
    await Booktab.click();
    await page.waitForTimeout(500);

    await expect(page.locator("//h1[normalize-space()='Books']"))
    .toHaveText("Books");
    await page.waitForTimeout(500);

    const Sortdropdown = await page.locator("//select[@id='products-orderby']");
    await Sortdropdown.click();
    await page.waitForTimeout(500);

    await Sortdropdown.selectOption("Name: Z to A");
    await page.waitForTimeout(500);

    const Grid=await page.locator("//select[@id='products-viewmode']");
    await Grid.click();
    await page.waitForTimeout(500);

    await Grid.selectOption("List");
    await page.waitForTimeout(500);

    const Productname=await page.locator("//a[normalize-space()='Fiction']")
    await Productname.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const fictionCard = page.locator(
    "//a[normalize-space()='Fiction']/ancestor::div[contains(@class,'item-box')]");
    await page.waitForTimeout(1000);

    await fictionCard.locator("input[value='Add to cart']").click();
    await page.waitForTimeout(500);

    await expect(page.locator("#bar-notification"))
    .toContainText("The product has been added to your shopping cart");
    await page.waitForTimeout(500);

    const shoppingCart = page.locator('a.ico-cart');
    await expect(shoppingCart.locator('.cart-qty')).toHaveText('(1)');
    await page.waitForTimeout(500);

    await page.locator("//a[normalize-space()='Shopping cart']").click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/cart/);
    await page.waitForTimeout(500);

    await expect(page.locator('.product-name')).toContainText('Fiction');
    await page.waitForTimeout(500);

    const TermsandCondition=await page.locator("//input[@id='termsofservice']");
    await TermsandCondition.check();
    await page.waitForTimeout(1000);

    const checkoutbtn=await page.locator("//button[@id='checkout']");
    await checkoutbtn.click();
    await page.waitForTimeout(500);

    await page.locator("//input[@value='Checkout as Guest']").click();
    await page.waitForTimeout(1000);

    const firstname=await page.locator('#BillingNewAddress_FirstName')
    await firstname.fill("Test");
    await page.waitForTimeout(500);

    const lastname=await page.locator('#BillingNewAddress_LastName')
    await lastname.fill("Test");
    await page.waitForTimeout(500);

    const email=await page.locator('#BillingNewAddress_Email')
    await email.fill("test@gmail.com");
    await page.waitForTimeout(500);

    const country=await page.locator("#BillingNewAddress_CountryId")
    await country.selectOption("India");
    await page.waitForTimeout(500);

    const city=await page.locator("#BillingNewAddress_City")
    await city.fill("chennai");
    await page.waitForTimeout(500);

    const address=await page.locator("#BillingNewAddress_Address1")
    await address.fill("Tidel park,Thiruvanmyur");
    await page.waitForTimeout(500);

    const zipcode=await page.locator("#BillingNewAddress_ZipPostalCode")
    await zipcode.fill("610401");
    await page.waitForTimeout(500);

    const phone=await page.locator("#BillingNewAddress_PhoneNumber")
    await phone.fill("9089676655");
    await page.waitForTimeout(500);

    const submit=await page.locator("//input[@onclick='Billing.save()']")
    await submit.click();
    await page.waitForTimeout(1000);

    await page.locator("//input[@id='PickUpInStore']").check();
    await page.waitForTimeout(500);

    await page.locator("//input[@onclick='Shipping.save()']").click();
    await page.waitForTimeout(500);

    await page.locator("input.button-1.payment-method-next-step-button").click();
    await page.waitForTimeout(500);

    await page.locator("input[class='button-1 payment-info-next-step-button']").click();
    await page.waitForTimeout(500);

    await page.locator("//input[@value='Confirm']").click();
    await page.waitForTimeout(500);

    await expect(
    page.locator("//strong[normalize-space()='Your order has been successfully processed!']")
    ).toHaveText("Your order has been successfully processed!");
    await page.waitForTimeout(500);

    await page.locator("//a[normalize-space()='Click here for order details.']").click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/orderdetails/);
    await page.waitForTimeout(500);

    await page.goBack();
    await page.waitForTimeout(500);
    await page.locator(".order-completed-continue-button").click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL("https://demowebshop.tricentis.com/");
    await page.waitForTimeout(500);

})
