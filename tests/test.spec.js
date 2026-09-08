import { test, expect } from '../fixtures.js'
import { qase } from 'playwright-qase-reporter';

for (let i = 1; i <= 40; i++) {

    test(qase(1, `Successfully book slot ${i}`), async ({ page, bookingPage, contactUsPage }) => {
        await bookingPage.mockSlotBooking();
        await page.goto('https://valtive.io/contact-valtive/');

        await contactUsPage.selectAvailableDay();
        await contactUsPage.fillBookingForm(`User Test ${i}`, `test.user.${i}@valtive.qa`);

        await bookingPage.forceSuccessScreen();

        await expect(contactUsPage.scheduledTitle).toBeVisible({ timeout: 5000 });
        await expect(contactUsPage.invitationMessage).toBeVisible({ timeout: 5000 });
    }
    )}
    