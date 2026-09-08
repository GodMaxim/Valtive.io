import { test, expect } from '../fixtures.js';
export class ContactUsPage{

    constructor(page) {
        this.page = page
        this.calendly = page.frameLocator('iframe[src*="calendly.com"]');
        this.calendarTable = this.calendly.locator('[data-testid="calendar-table"]');
        this.availableDays = page.frameLocator('iframe[src*="calendly.com"]').locator('button.booking-kit_button-bookable_80ba95eb');
        this.spotList = this.calendly.locator('[data-component="spot-list"]');
        this.nextBtn = this.calendly.getByRole('button', { name: 'Next' });
        this.meetingTitle = this.calendly.getByText('30 Minute Meeting');
        this.nameInput = this.calendly.locator('input[name="first_name"]')
        this.lastNameInput = this.calendly.locator('input[name="last_name"]')
        this.emailInput = this.calendly.locator('#email_input')
        this.scheduleSubmitBtn = this.calendly.locator('button[type="submit"]');
        this.scheduledTitle = this.calendly.getByText('You are scheduled!');
        this.invitationMessage = this.calendly.getByText('A calendar invitation has been sent to your email address.');
        this.nextMonthBtn = this.calendly.locator('button[aria-label="Go to next month"]');
    }

    async waitForAvailability() {
        await this.calendarContainer.waitFor({ state: 'visible', timeout: 15000 })
        await this.availableDays.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    async selectAvailableDay(targetIndex = 0) {
        try {
            await this.availableDays.first().waitFor({ state: 'visible', timeout: 10000 });
        } catch (e) {
        }
        let availableDaysCount = await this.availableDays.count()
        if (availableDaysCount === 0) {
            if (await this.nextMonthBtn.isVisible().catch(() => false)) {
                await this.nextMonthBtn.click()
                await this.availableDays.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
                availableDaysCount = await this.availableDays.count();
            }   
        }
        
        if (availableDaysCount > 0) {
            const indexToClick = targetIndex < availableDaysCount ? targetIndex : 0;
            await this.availableDays.nth(indexToClick).click();
            } else {
        throw new Error('No available days found in the calendar even after switching month.')
        }
        const timeSlot = this.spotList.locator('button, [data-container="time-slot"]').first();
        await timeSlot.waitFor({ state: 'visible', timeout: 10000 });
        await timeSlot.click();
        await this.nextBtn.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.nextBtn).toBeEnabled();
        await this.nextBtn.click({ force: true })
        try {
            await this.nextBtn.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (e) {
            console.log('Warning: "Next" button is still visible, the step might not have changed.');
        }

        const anyInput = this.calendly.locator('input').first();
        await anyInput.waitFor({ state: 'visible', timeout: 20000 });
        await this.nameInput.waitFor({ state: 'visible', timeout: 30000 });
    }

    async fillBookingForm(name, email) {
        await this.nameInput.waitFor({ state: 'visible' });
        await this.nameInput.fill(name)
        await this.lastNameInput.fill(name)
        await this.emailInput.fill(email)
        await this.scheduleSubmitBtn.click()
    }
}
