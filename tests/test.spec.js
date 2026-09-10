import { test, expect } from '../fixtures.js'
import { qase } from 'playwright-qase-reporter'
import { bookingScenarios } from '../utils/bookingData.js'

bookingScenarios.forEach((scenario) => {

    test(qase(scenario.qaseId, `Booking test scenario #${scenario.id}`), async ({ page, bookingPage, contactUsPage }) => {
       if (page.isClosed()) {
            throw new Error('Page was closed unexpectedly before test start.');
        }
        await page.goto('https://valtive.io/contact-valtive/', { waitUntil: 'domcontentloaded' })

        const iframeElement = page.locator('iframe[src*="calendly.com"]');
        await iframeElement.waitFor({ state: 'visible', timeout: 20000 });
       
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
