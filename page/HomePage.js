export class HomePage {

    constructor(page) {
        this.page = page
        this.contactUsButton = page.locator('#menu-main-menu a[href="https://valtive.io/contact-valtive/"]')
    }

    async goToContactUsPage() {
        await this.page.route('**/*', (route) => {
            const url = route.request().url();
            if (url.includes('google-analytics') || url.includes('hotjar') || url.includes('facebook')) {
                return route.abort();
            }
            return route.continue();
        });

        await this.page.waitForTimeout(3000);
        await this.page.goto('https://valtive.io/contact-valtive/', { 
            waitUntil: 'domcontentloaded',
            timeout: 45000 
        });
        await this.contactUsButton.waitFor({ state: 'visible', timeout: 15000 })
    }
}