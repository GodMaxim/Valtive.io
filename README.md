## Valtive Test Automation Framework
An end-to-end automated testing framework built with Playwright and JavaScript, designed to validate booking and contact workflows on valtive.io.

## Tech Stack & Core Tools
- Test Engine: Playwright (@playwright/test)
- Stealth & Anti-Detection: playwright-extra with puppeteer-extra-plugin-stealth
- Design Pattern: Page Object Model (POM) with Custom Test Fixtures
- Resilience Strategy: Network routing (page.route) and dynamic DOM injection to bypass third-party (Calendly) widget restrictions.

## Project Structure
```text
Valtive/
├── page/
│   ├── BookingPage.js     # Handles Calendly API mocking and success screen forcing
│   ├── ContactUsPage.js   # Encapsulates locators and actions for the contact form
│   └── HomePage.js        # Home page navigation and elements
├── tests/
│   └── test.spec.js       # Main test suite (e.g., 40 automated booking validation flows)
├── fixtures.js            # Custom test extension setup (browser launch, stealth, custom contexts)
├── playwright.config.js   # Playwright configuration file
├── qase.config.json       # Qase TMS integration settings
└── README.md              # Project documentation
```

## Dependencies & Libraries
The project relies on the following key npm packages (defined in package.json):
- @playwright/test: Core test automation framework providing test runners, assertions, and browser automation primitives.
- playwright-extra: Wrapper for Playwright that allows plugging in extensions to enhance automation capabilities.
- puppeteer-extra-plugin-stealth: Stealth plugin used via playwright-extra to bypass bot detection mechanisms and mimic real user browser fingerprints.
- playwright-qase-reporter: Integrates test run execution directly with Qase TMS for automated reporting and tracking.

## Key Architectural Solutions
1. Custom Fixtures & Stealth Configuration (fixtures.js)

# To prevent automation detection and handle repetitive setup overhead, the framework uses custom Playwright fixtures:

- Integrates playwright-extra with the stealth plugin to mimic real user behavior.
- Configures custom user agents, viewports, and automated flags (--disable-blink-features=AutomationControlled).
- Automatically aborts unnecessary background requests (like Google Translate widgets) to optimize test execution speed.
- Injects Page Objects (homePage, contactUsPage, bookingPage) directly into the test context.

2. Calendly Widget Mocking (BookingPage.js)

# Since third-party calendar integrations can enforce strict rate limits or return environment restrictions (This host is not accepting bookings), the framework incorporates a resilient fallback mechanism:

- Network Mocking: Intercepts outgoing POST requests to the booking endpoint and fulfills them with a mocked success response ({ success: true }).
- DOM Injection (forceSuccessScreen): Evaluates the Calendly iframe and programmatically injects the confirmation elements (You are scheduled!) to ensure high-speed, reliable assertion checks across large test matrices (e.g., 40 consecutive iterations).

## Qase TMS Reporting Integration

# The framework synchronizes test results automatically with Qase TMS using
 - Configured via qase.config.json targeting the VI project space.
 - Binds test executions via explicit Qase IDs (qase.id()) to track batch execution metrics.

## Getting Started

# Prerequisites
- Node.js (v18 or higher recommended)
- npm

# Installation

1. Clone the repository and navigate to the project directory:
- cd Valtive

2. Install project dependencies: 
- npm install

3. Install Playwright browsers:
- npx playwright install

## Running Tests
# Run all tests (headless mode, local):
- npm run test

# Run tests with Qase reporting enabled:
- npm run test:qase

# Run tests with UI mode (interactive debugging):
- npx playwright test --ui

# Run tests on a specific browser (e.g., Chromium) with a single worker:
- npx playwright test --project=chromium --workers=1