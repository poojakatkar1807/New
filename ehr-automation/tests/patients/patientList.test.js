const { test, expect } = require('../../fixtures/fixtures');
const testData = require('../../test-data/testData.json');

test.describe('Patient List Tests', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke TC-PAT-001 | Patient list page loads correctly', async ({ patientListPage, page }) => {
    await patientListPage.goToPatients();
    await expect(page).toHaveURL(/patients/);
    expect(await patientListPage.isVisible(patientListPage.patientsTitle)).toBe(true);
    expect(await patientListPage.isVisible(patientListPage.patientsTable)).toBe(true);
  });

  test('@smoke TC-PAT-002 | Patients are displayed in the table', async ({ patientListPage }) => {
    await patientListPage.goToPatients();
    const count = await patientListPage.getPatientCount();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('@regression TC-PAT-003 | Search patient by name', async ({ patientListPage }) => {
    await patientListPage.goToPatients();
    await patientListPage.searchPatient('Rajesh');
    const count = await patientListPage.getPatientCount();
    expect(count).toBe(1);
    const name = await patientListPage.getPatientNameByIndex(0);
    expect(name).toContain('Rajesh');
  });

  test('@regression TC-PAT-004 | Search patient by ID', async ({ patientListPage }) => {
    await patientListPage.goToPatients();
    await patientListPage.searchPatient('P-1001');
    const count = await patientListPage.getPatientCount();
    expect(count).toBe(1);
    const id = await patientListPage.getPatientIdByIndex(0);
    expect(id).toBe('P-1001');
  });

  test('@regression TC-PAT-005 | Search with no results', async ({ patientListPage }) => {
    await patientListPage.goToPatients();
    await patientListPage.searchPatient('NonExistentPatient');
    expect(await patientListPage.isVisible(patientListPage.noPatients)).toBe(true);
  });

  test('@smoke TC-PAT-006 | Navigate to patient details', async ({ patientListPage, page }) => {
    await patientListPage.goToPatients();
    await patientListPage.viewPatient(0);
    await expect(page).toHaveURL(/patients\/P-/);
  });

  test('@smoke TC-PAT-007 | Register patient button is visible', async ({ patientListPage }) => {
    await patientListPage.goToPatients();
    expect(await patientListPage.isVisible(patientListPage.registerButton)).toBe(true);
  });
});
