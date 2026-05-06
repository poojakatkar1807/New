const { test, expect } = require('../../fixtures/fixtures');
const testData = require('../../test-data/testData.json');
const { generateRandomPhone, generatePatientName } = require('../../utils/helpers');

test.describe('Patient Registration Tests', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke TC-REG-001 | Register a new patient with all fields', async ({ patientRegistrationPage }) => {
    await patientRegistrationPage.goToRegister();
    await patientRegistrationPage.registerPatient(testData.newPatient);
    const msg = await patientRegistrationPage.getSuccessMessage();
    expect(msg).toContain('registered successfully');
    expect(msg).toContain(testData.newPatient.firstName);
  });

  test('@regression TC-REG-002 | Register patient with only required fields', async ({ patientRegistrationPage }) => {
    const patient = {
      firstName: generatePatientName().firstName,
      lastName: generatePatientName().lastName,
      gender: 'Male',
      phone: generateRandomPhone()
    };
    await patientRegistrationPage.goToRegister();
    await patientRegistrationPage.registerPatient(patient);
    const msg = await patientRegistrationPage.getSuccessMessage();
    expect(msg).toContain('registered successfully');
  });

  test('@regression TC-REG-003 | Registration form elements are visible', async ({ patientRegistrationPage }) => {
    await patientRegistrationPage.goToRegister();
    expect(await patientRegistrationPage.isVisible(patientRegistrationPage.firstNameInput)).toBe(true);
    expect(await patientRegistrationPage.isVisible(patientRegistrationPage.lastNameInput)).toBe(true);
    expect(await patientRegistrationPage.isVisible(patientRegistrationPage.genderSelect)).toBe(true);
    expect(await patientRegistrationPage.isVisible(patientRegistrationPage.phoneInput)).toBe(true);
    expect(await patientRegistrationPage.isVisible(patientRegistrationPage.submitButton)).toBe(true);
  });

  test('@regression TC-REG-004 | Verify newly registered patient appears in list', async ({ patientRegistrationPage, patientListPage }) => {
    const name = generatePatientName();
    const patient = { ...name, gender: 'Female', phone: generateRandomPhone() };

    await patientRegistrationPage.goToRegister();
    await patientRegistrationPage.registerPatient(patient);
    const msg = await patientRegistrationPage.getSuccessMessage();
    expect(msg).toContain('registered successfully');

    await patientListPage.goToPatients();
    await patientListPage.searchPatient(patient.firstName);
    const count = await patientListPage.getPatientCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
