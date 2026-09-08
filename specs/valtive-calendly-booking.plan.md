# Valtive Calendly Booking Test Plan

## Application Overview

End-to-end coverage for the Calendly 30 Minute Meeting widget embedded on https://valtive.io/contact-valtive/. The widget is hosted in a Calendly iframe and currently presents an accessible calendar, enabled dates, time buttons, an invitee form with required Name and Email fields, an optional preparation textarea, and a Schedule Event button. Booking tests must use dedicated test identities and be explicitly enabled because they create real external calendar events and send email invitations.

## Test Scenarios

### 1. Calendly Booking Widget

**Seed:** `tests/seed.spec.ts`

#### 1.1. Widget loads and exposes the booking controls

**File:** `tests/calendly-widget.spec.ts`

**Steps:**
  1. Start from a fresh browser context and navigate to https://valtive.io/contact-valtive/.
    - expect: The page loads successfully and has a heading named "Contact Valtive".
    - expect: A Calendly iframe is present.
  2. Locate the iframe whose URL contains calendly.com/valtive-qa/30min and inspect its accessible content.
    - expect: The iframe contains the heading "30 Minute Meeting".
    - expect: The iframe contains "Select a Day" and a visible calendar month.
    - expect: The iframe contains a visible time-zone control.
  3. Inspect calendar day buttons without selecting a day.
    - expect: At least one day button is enabled and exposes an accessible name ending in "Times available".
    - expect: Unavailable days are disabled and expose an accessible name ending in "No times available".

#### 1.2. Required invitee fields reject invalid or incomplete submissions

**File:** `tests/calendly-validation.spec.ts`

**Steps:**
  1. From a fresh context, open the contact page, select the first enabled calendar day, select the first offered time, and click its time-specific Next button.
    - expect: The iframe shows "Enter Details" and a "Schedule Event" button.
    - expect: Required Name and Email fields are visible.
  2. Click "Schedule Event" without entering any invitee information.
    - expect: The booking is not submitted.
    - expect: The required Name and Email fields expose validation or remain invalid.
  3. Enter a valid name and a malformed email address, then click "Schedule Event".
    - expect: The booking is not submitted.
    - expect: The Email field exposes type validation or an equivalent invalid-email message.

#### 1.3. Single booking completes with both required confirmation assertions

**File:** `tests/calendly-single-booking.spec.ts`

**Steps:**
  1. Start from a fresh context and navigate to https://valtive.io/contact-valtive/.
    - expect: The Calendly iframe is visible.
  2. Inside the Calendly iframe, select an enabled date using its accessible name, select an available time, and click the matching Next button.
    - expect: The selected date and time are shown in the details step.
    - expect: The details step contains "Enter Details".
  3. Fill Name with a unique dedicated test name and Email with a unique mailbox controlled by the test team. Leave the optional preparation question empty unless the event configuration requires it.
    - expect: The required fields contain the submitted values.
    - expect: The "Schedule Event" button is enabled.
  4. Click "Schedule Event" and wait for the confirmation view.
    - expect: The confirmation view is displayed.
    - expect: The page contains the exact text "You are scheduled".
    - expect: The page contains the exact text "A calendar invitation has been sent to your email address".
    - expect: The confirmation includes the selected date and time.

#### 1.4. Booking 40 distinct available time slots

**File:** `tests/calendly-40-slots.spec.ts`

**Steps:**
  1. Run this test only with BOOKING_40_SLOTS=true, a dedicated booking mailbox strategy, and an explicit cleanup or cancellation policy. Use a fresh browser context for each booking iteration.
    - expect: The test refuses to submit events when the opt-in flag is absent.
    - expect: The test data source can provide 40 unique invitee email addresses or a provider-supported unique alias for each booking.
  2. For each iteration from 1 through 40, open https://valtive.io/contact-valtive/ and locate the Calendly iframe by URL containing calendly.com/valtive-qa/30min.
    - expect: The widget is available for the iteration.
    - expect: The calendar is rendered with at least one enabled date, or the iteration is recorded as blocked because no availability exists.
  3. Select the first currently enabled date and then the first available time that has not already been booked by this run. If the slot is already unavailable, rediscover availability and continue without counting a duplicate.
    - expect: The chosen date/time is displayed in the details step.
    - expect: Each counted iteration has a unique date/time pair.
  4. Fill the required Name and Email fields with deterministic unique values such as Valtive QA Slot 01 and a dedicated test address, then click "Schedule Event".
    - expect: The booking completes for that iteration.
    - expect: The exact text "You are scheduled" is visible.
    - expect: The exact text "A calendar invitation has been sent to your email address" is visible.
    - expect: The confirmation date/time matches the selected unique slot.
  5. Record the iteration number, event date, event time, invitee email, and confirmation text; then start the next iteration with a new context.
    - expect: Exactly 40 successful booking records are produced.
    - expect: No record has a duplicate date/time pair or duplicate invitee identity.
    - expect: Any failure includes the iteration, selected slot, and visible error state in the test report.

#### 1.5. Unavailable dates and month navigation are handled safely

**File:** `tests/calendly-availability.spec.ts`

**Steps:**
  1. From a fresh context, open the contact page and inspect the calendar inside the Calendly iframe.
    - expect: Unavailable calendar days are disabled and cannot be selected.
    - expect: Available days remain selectable.
  2. Click the enabled "Go to next month" control, then inspect the newly displayed month.
    - expect: The displayed month changes.
    - expect: The calendar remains usable and day buttons expose availability in their accessible names.
  3. Select an unavailable day if one is present, or attempt to activate it through its locator.
    - expect: The date cannot advance to the time-selection step.
    - expect: No booking form is displayed.
  4. Use "Go to previous page" after selecting an available date/time.
    - expect: The widget returns to the prior booking step without losing the ability to choose another available slot.
