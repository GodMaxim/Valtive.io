export class HomePage {

    constructor(page) {
        this.page = page
        this.contactUsButton = page.locator('#menu-main-menu a[href="https://valtive.io/contact-valtive/"]')
    }

    async goToContactUsPage() {
        await this.page.goto('https://valtive.io/contact-valtive/', { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });
        await this.contactUsButton.waitFor({ state: 'visible', timeout: 15000 })
    }
}