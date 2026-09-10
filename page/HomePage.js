export class HomePage {

    constructor(page) {
        this.page = page
        this.contactUsButton = page.locator('#menu-main-menu a[href="https://valtive.io/contact-valtive/"]')
        this.title = page.getByRole('heading', { name: '+167 years of combined' }).first();
    }

    async goToContactUsPage() {
        await this.contactUsButton.click()
    }
}