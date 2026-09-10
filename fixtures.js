import { test as base, chromium } from '@playwright/test'
import { HomePage } from './page/HomePage.js'
import { ContactUsPage } from './page/ContactUsPage.js'
import { BookingPage } from './page/BookingPage.js'


export const test = base.extend({
    browser: async ({}, use) => {
        const browser = await chromium.launch({
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ]
        });
        await use(browser);
        await browser.close();
    },

    context: async ({ browser }, use) => {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            viewport: { width: 1366, height: 768 }
        });

        await context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        await use(context);
        await context.close();
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    contactUsPage: async ({ page }, use) => {
        await use(new ContactUsPage(page));
    },

    bookingPage: async ({ page }, use) => {
        await use(new BookingPage(page));
    }
});

export { expect } from '@playwright/test';
