import { test as base } from '@playwright/test'
import { HomePage } from './page/HomePage.js'
import { ContactUsPage } from './page/ContactUsPage.js'
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import { BookingPage } from './page/BookingPage.js'


chromium.use(stealthPlugin())
export const test = base.extend({
    browser: [async ({}, use) => {
        const browser = await chromium.launch({
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--start-maximized',
                '--no-sandbox',
                "--disable-translate",
                "--disable-features=Translate",
                "--no-default-browser-check",
                "--lang=en-US",
                '--single-process'
            ]
        })
        await use(browser);
        await browser.close();
    }, { scope: 'worker' }],
        context: async ({ browser }, use) => {
            const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            viewport: { width: 1366, height: 768 }
        })

        await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
});

        await context.route('**/translate.googleapis.com/**', route => route.abort())
        await context.route('**/translate.google.com/**', route => route.abort())
        await context.route('**/*translate_a*', route => route.abort())

        await use(context);
        await context.close();
        },
    
    homePage: async ({ page }, use) => {
        await use(new HomePage(page))
    },

    contactUsPage: async ({ page }, use) => {
        await use(new ContactUsPage(page))
    },

    bookingPage: async ({ page }, use) => {
        await use(new BookingPage(page))
    }
});

export { expect } from '@playwright/test'


