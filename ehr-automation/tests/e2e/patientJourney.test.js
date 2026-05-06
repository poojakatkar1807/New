const { test, expect } = require('../../fixtures/fixtures');
const testData = require('../../test-data/testData.json');
const { generateRandomPhone, generatePatientName, getFutureDate } = require('../../utils/helpers');

test.describe('E2E — Full Patient Journey', () => {

  test('@smoke TC-E2E-001 | Complete patient journey: login → register → vitals → appointment → logout', async ({
    loginPage, dashboardPage, patientRegistrationPage, patientListPage, patientDetailPage, appointmentPage, page
  }) => {
    // Step 1: Login as doctor
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);

    // Step 2: Verify dashboard stats
    expect(await dashboardPage.isVisible(dashboardPage.statPatients)).toBe(true);
    expect(await dashboardPage.isVisible(dashboardPage.statScheduled)).toBe(true);

    // Step 3: Register a new patient
    const name = generatePatientName();
    const newPatient = {
      firstName: name.firstName,
      lastName: name.lastName,
      age: '30',
      gender: 'Female',
      phone: generateRandomPhone(),
      bloodGroup: 'A+'
    };
    await patientRegistrationPage.goToRegister();
    await patientRegistrationPage.registerPatient(newPatient);
    const successMsg = await patientRegistrationPage.getSuccessMessage();
    expect(successMsg).toContain('registered successfully');

    // Extract patient ID from success message
    const patientIdMatch = successMsg.match(/P-\d+/);
    expect(patientIdMatch).not.toBeNull();
    const patientId = patientIdMatch[0];

    // Step 4: View patient details
    await patientDetailPage.goToPatient(patientId);
    const patientName = await patientDetailPage.getPatientName();
    expect(patientName).toContain(newPatient.firstName);

    // Step 5: Record vitals
    await patientDetailPage.recordVitals(testData.newVitals);
    await page.waitForLoadState('networkidle');
    const vitalsCount = await patientDetailPage.getVitalsCount();
    expect(vitalsCount).toBeGreaterThanOrEqual(1);

    // Step 6: Add prescription
    await patientDetailPage.addPrescription(testData.newPrescription);
    await page.waitForLoadState('networkidle');
    const rxCount = await patientDetailPage.getPrescriptionCount();
    expect(rxCount).toBeGreaterThanOrEqual(1);

    // Step 7: Schedule appointment
    await appointmentPage.goToAppointments();
    await appointmentPage.scheduleAppointment({
      patientId: patientId,
      date: getFutureDate(7),
      time: '09:30',
      type: 'Follow-up',
      notes: 'E2E test appointment'
    });
    const apptMsg = await appointmentPage.getSuccessMessage();
    expect(apptMsg).toContain('Appointment scheduled');

    // Step 8: Logout
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('@regression TC-E2E-002 | Dashboard navigation flow', async ({
    loginPage, dashboardPage, patientListPage, appointmentPage, page
  }) => {
    // Login
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);

    // Navigate to patients via navbar
    await dashboardPage.navigateToPatients();
    await expect(page).toHaveURL(/patients/);
    expect(await patientListPage.isVisible(patientListPage.patientsTitle)).toBe(true);

    // Navigate to appointments via navbar
    await dashboardPage.navigateToAppointments();
    await expect(page).toHaveURL(/appointments/);
    expect(await appointmentPage.isVisible(appointmentPage.appointmentsTitle)).toBe(true);

    // Navigate back to dashboard
    await page.locator('[data-testid="nav-dashboard"]').click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@regression TC-E2E-003 | View existing patient details with vitals and prescriptions', async ({
    loginPage, patientDetailPage, page
  }) => {
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);

    // View existing patient P-1001 (Rajesh Kumar)
    await patientDetailPage.goToPatient('P-1001');
    const name = await patientDetailPage.getPatientName();
    expect(name).toContain('Rajesh Kumar');

    // Check vitals exist
    const vitalsCount = await patientDetailPage.getVitalsCount();
    expect(vitalsCount).toBeGreaterThanOrEqual(2);

    // Check prescriptions exist
    const rxCount = await patientDetailPage.getPrescriptionCount();
    expect(rxCount).toBeGreaterThanOrEqual(1);
  });
});
