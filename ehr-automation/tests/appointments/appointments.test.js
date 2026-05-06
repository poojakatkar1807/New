const { test, expect } = require('../../fixtures/fixtures');
const testData = require('../../test-data/testData.json');
const { getFutureDate } = require('../../utils/helpers');

test.describe('Appointment Tests', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke TC-APT-001 | Appointments page loads correctly', async ({ appointmentPage, page }) => {
    await appointmentPage.goToAppointments();
    await expect(page).toHaveURL(/appointments/);
    expect(await appointmentPage.isVisible(appointmentPage.appointmentsTitle)).toBe(true);
    expect(await appointmentPage.isVisible(appointmentPage.appointmentsTable)).toBe(true);
  });

  test('@smoke TC-APT-002 | Existing appointments are displayed', async ({ appointmentPage }) => {
    await appointmentPage.goToAppointments();
    const count = await appointmentPage.getAppointmentCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('@smoke TC-APT-003 | Schedule a new appointment', async ({ appointmentPage }) => {
    await appointmentPage.goToAppointments();
    const appointment = {
      patientId: testData.newAppointment.patientId,
      doctor: testData.newAppointment.doctor,
      date: getFutureDate(14),
      time: '10:30',
      type: 'Consultation',
      notes: 'Routine checkup'
    };
    await appointmentPage.scheduleAppointment(appointment);
    const msg = await appointmentPage.getSuccessMessage();
    expect(msg).toContain('Appointment scheduled');
  });

  test('@regression TC-APT-004 | Filter appointments by Scheduled status', async ({ appointmentPage }) => {
    await appointmentPage.goToAppointments();
    await appointmentPage.filterByStatus('Scheduled');
    const rows = appointmentPage.appointmentRows;
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const status = await rows.nth(i).locator('[data-testid="appt-status"]').textContent();
      expect(status).toBe('Scheduled');
    }
  });

  test('@regression TC-APT-005 | Filter appointments by Completed status', async ({ appointmentPage }) => {
    await appointmentPage.goToAppointments();
    await appointmentPage.filterByStatus('Completed');
    const rows = appointmentPage.appointmentRows;
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const status = await rows.nth(i).locator('[data-testid="appt-status"]').textContent();
      expect(status).toBe('Completed');
    }
  });

  test('@regression TC-APT-006 | Complete an appointment', async ({ appointmentPage, page }) => {
    await appointmentPage.goToAppointments();
    await appointmentPage.filterByStatus('Scheduled');
    const beforeCount = await appointmentPage.getAppointmentCount();

    if (beforeCount > 0) {
      await appointmentPage.completeAppointment(0);
      await page.waitForLoadState('networkidle');
      // After completing, the scheduled count should decrease
      await appointmentPage.filterByStatus('Scheduled');
      const afterCount = await appointmentPage.getAppointmentCount();
      expect(afterCount).toBeLessThan(beforeCount);
    }
  });

  test('@regression TC-APT-007 | Cancel an appointment', async ({ appointmentPage, page }) => {
    // First schedule a new appointment to cancel
    await appointmentPage.goToAppointments();
    const appointment = {
      patientId: 'P-1002',
      date: getFutureDate(30),
      time: '15:00',
      type: 'Routine',
      notes: 'To be cancelled'
    };
    await appointmentPage.scheduleAppointment(appointment);
    await expect(appointmentPage.successMessage).toBeVisible();

    // Now cancel it
    await appointmentPage.filterByStatus('Scheduled');
    const beforeCount = await appointmentPage.getAppointmentCount();
    await appointmentPage.cancelAppointment(0);
    await page.waitForLoadState('networkidle');

    await appointmentPage.filterByStatus('Scheduled');
    const afterCount = await appointmentPage.getAppointmentCount();
    expect(afterCount).toBeLessThan(beforeCount);
  });

  test('@smoke TC-APT-008 | New appointment button is visible', async ({ appointmentPage }) => {
    await appointmentPage.goToAppointments();
    expect(await appointmentPage.isVisible(appointmentPage.newAppointmentButton)).toBe(true);
  });
});
