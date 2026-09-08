export class HomePage {

    constructor(page) {
        this.page = page
        this.contactUsButton = page.locator('#menu-main-menu a[href="https://valtive.io/contact-valtive/"]')
    }

    async goToContactUsPage() {
        await this.page.goto('https://valtive.io/contact-valtive/');
        await this.contactUsButton.click()
    }
}