export class ContactUsPage{

    constructor(page) {
        this.page = page
        this.calendly = page.frameLocator('iframe[src*="calendly.com"]');
        this.calendarTable = this.calendly.locator('[data-testid="calendar-table"]');
        this.availableDays = page.frameLocator('iframe[src*="calendly.com"]').locator('[data-testid="calendar-table"] button[aria-label*="Times available"]');
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

   async selectAvailableDay(targetIndex = 0) {
    await this.page.locator('iframe[src*="calendly.com"]').waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(3000)
    
    try {
        await this.availableDays.first().waitFor({ state: 'visible', timeout: 20000 });
    } catch (e) {
        if (await this.nextMonthBtn.isVisible().catch(() => false)) {
            await this.nextMonthBtn.click();
            await this.availableDays.first().waitFor({ state: 'visible', timeout: 15000 });
        } else {
            await this.page.waitForLoadState('networkidle');
            try {
                await this.availableDays.first().waitFor({ state: 'visible', timeout: 10000 });
            } catch (innerError) {
                throw new Error('Calendar failed to load or no available days found after retry.');
            }
        }
    }

    let availableDaysCount = await this.availableDays.count();
    
    if (availableDaysCount > 0) {
        const indexToClick = targetIndex < availableDaysCount ? targetIndex : 0;
       const targetDay = this.availableDays.nth(indexToClick);
        await targetDay.scrollIntoViewIfNeeded();
        await targetDay.click({ force: true });
    } else {
        throw new Error('No available days found in the calendar even after switching month.');
    }

    const timeSlot = this.spotList.locator('button, [data-container="time-slot"]').first();
    await timeSlot.waitFor({ state: 'visible', timeout: 10000 });
    await timeSlot.click();
}

    async waitForForm() {
        const anyInput = this.calendly.locator('input').first();
        await anyInput.waitFor({ state: 'visible', timeout: 20000 });
        await this.nameInput.waitFor({ state: 'visible', timeout: 30000 });
    }

    async clickNextBtn() {
        await this.nextBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.nextBtn.click()

    }

    async fillBookingForm(name, email) {
        await this.nameInput.waitFor({ state: 'visible' });
        await this.nameInput.fill(name)
        await this.lastNameInput.fill(name)
        await this.emailInput.fill(email)
        await this.scheduleSubmitBtn.click()
    }
}
