import { test, expect } from '../fixtures.js'
import { qase } from 'playwright-qase-reporter'
import { bookingScenarios } from '../utils/bookingData.js'


bookingScenarios.forEach((scenario) => {

    test(qase(scenario.qaseId, `Booking test scenario #${scenario.id}`), async ({ page, bookingPage, contactUsPage }) => {
        await page.waitForTimeout(2000)

        await page.goto('https://valtive.io/contact-valtive/', { 
            waitUntil: 'domcontentloaded', 
            timeout: 60000 
        });

        const iframeElement = page.locator('iframe[src*="calendly.com"]');
        await iframeElement.waitFor({ state: 'attached', timeout: 30000 });
        await iframeElement.waitFor({ state: 'visible', timeout: 15000 });
       
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
