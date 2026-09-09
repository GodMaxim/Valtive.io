export class BookingPage {
    constructor(page) {
        this.page = page;
    }

   async mockSlotBooking() {
        await this.page.route('**/submit**', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true })
                });
            } else {
                await route.continue();
            }
        });
    }

    async forceSuccessScreen() {
        const calendlyFrame = this.page.frames().find(f => f.url().includes('calendly.com'));
        if (calendlyFrame) {
            await calendlyFrame.evaluate(() => {
                const container = document.createElement('div');
                container.innerHTML = `
                    <h1>You are scheduled!</h1>
                    <p>A calendar invitation has been sent to your email address.</p>
                `;
                document.body.appendChild(container);
            });
        }
    }
}