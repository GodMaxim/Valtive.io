import { test, expect } from '../fixtures.js'
import { qase } from 'playwright-qase-reporter'
import { bookingScenarios } from '../utils/bookingData.js'

bookingScenarios.forEach((scenario) => {

    test(qase(scenario.qaseId, `Booking test scenario #${scenario.id}`), async ({ page, bookingPage, contactUsPage }) => {
       const delay = 2000 + Math.random() * 3000;
        await new Promise(r => setTimeout(r, delay));
        await bookingPage.mockSlotBooking();
        await page.goto('https://valtive.io/contact-valtive/', { waitUntil: 'domcontentloaded' });
       
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
