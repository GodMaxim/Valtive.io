import { test, expect } from '../fixtures.js'
import { qase } from 'playwright-qase-reporter'
import { bookingScenarios } from '../utils/bookingData.js'


bookingScenarios.forEach((scenario) => {

    test(qase(scenario.qaseId, `Booking test scenario #${scenario.id}`), async ({ page, bookingPage, contactUsPage, homePage }) => {
        await page.waitForTimeout(4000)

        await page.route('**/*', (route) => {
            const url = route.request().url();
            if (url.includes('google-analytics') || url.includes('hotjar') || url.includes('facebook')) {
                return route.abort();
            }
            return route.continue();
        });

        await page.goto('https://valtive.io/', {
            waitUntil: 'domcontentloaded', 
            timeout: 45000
        })

        await expect(homePage.title).toBeVisible()

        await homePage.goToContactUsPage()

        const iframeElement = page.locator('iframe[src*="calendly.com"]');
        await iframeElement.waitFor({ state: 'visible', timeout: 25000 });
       
        await contactUsPage.selectAvailableDay()
        await expect(contactUsPage.nextBtn).toBeEnabled()
        await contactUsPage.clickNextBtn()
        await contactUsPage.waitForForm()
        await contactUsPage.fillBookingForm(scenario.name, scenario.email)

        await bookingPage.forceSuccessScreen()

        await expect(contactUsPage.scheduledTitle).toBeVisible({ timeout: 10000 });
        await expect(contactUsPage.invitationMessage).toBeVisible({ timeout: 5000 });
    }
    )}
)
