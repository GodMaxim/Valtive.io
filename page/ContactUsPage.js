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
    // 1. Обязательно ждем появления первого доступного дня при открытии календаря
    try {
        await this.availableDays.first().waitFor({ state: 'visible', timeout: 15000 });
    } catch (e) {
        // Если в текущем месяце дни не появились, пробуем переключить на следующий
        if (await this.nextMonthBtn.isVisible().catch(() => false)) {
            await this.nextMonthBtn.click();
            await this.availableDays.first().waitFor({ state: 'visible', timeout: 15000 });
        } else {
            throw new Error('Calendar failed to load or no available days found.');
        }
    }

    let availableDaysCount = await this.availableDays.count();
    
    if (availableDaysCount > 0) {
        const indexToClick = targetIndex < availableDaysCount ? targetIndex : 0;
        await this.availableDays.nth(indexToClick).click();
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
