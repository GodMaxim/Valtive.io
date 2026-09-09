import { test, expect } from '../fixtures.js'
import { qase } from 'playwright-qase-reporter'
import { bookingScenarios } from '../utils/bookingData.js'

bookingScenarios.forEach((scenario) => {

    test(qase(scenario.qaseId, `Booking test scenario #${scenario.id}`), async ({ page, bookingPage, contactUsPage }) => {
        await new Promise(r => setTimeout(r, 1500));
        await bookingPage.mockSlotBooking();
        await page.goto('https://valtive.io/contact-valtive/', { 
            waitUntil: 'domcontentloaded', 
            timeout: 60000 
        });
        await page.waitForLoadState('networkidle').catch(() => {});
       
        await contactUsPage.selectAvailableDay()
        await expect(contactUsPage.nextBtn).toBeEnabled()
        await contactUsPage.clickNextBtn()
        await contactUsPage.waitForForm()
        await contactUsPage.fillBookingForm(scenario.name, scenario.email)

        await bookingPage.forceSuccessScreen()

        await expect(contactUsPage.scheduledTitle).toBeVisible({ timeout: 5000 });
        await expect(contactUsPage.invitationMessage).toBeVisible({ timeout: 5000 });
    }
    )}
)
    