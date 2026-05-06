const { test, expect } = require('../../fixtures/fixtures');
const testData = require('../../test-data/testData.json');

test.describe('Vitals Recording Tests', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goToLoginPage();
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke TC-VIT-001 | Vitals table is displayed on patient detail page', async ({ patientDetailPage }) => {
    await patientDetailPage.goToPatient('P-1001');
    expect(await patientDetailPage.isVisible(patientDetailPage.vitalsTable)).toBe(true);
  });

  test('@smoke TC-VIT-002 | Existing vitals are displayed for patient', async ({ patientDetailPage }) => {
    await patientDetailPage.goToPatient('P-1001');
    const count = await patientDetailPage.getVitalsCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('@smoke TC-VIT-003 | Record new vitals for a patient', async ({ patientDetailPage, page }) => {
    await patientDetailPage.goToPatient('P-1001');
    const beforeCount = await patientDetailPage.getVitalsCount();

    await patientDetailPage.recordVitals(testData.newVitals);
    await page.waitForLoadState('networkidle');

    const afterCount = await patientDetailPage.getVitalsCount();
    expect(afterCount).toBe(beforeCount + 1);
  });

  test('@regression TC-VIT-004 | Add vitals button is visible', async ({ patientDetailPage }) => {
    await patientDetailPage.goToPatient('P-1001');
    expect(await patientDetailPage.isVisible(patientDetailPage.addVitalsButton)).toBe(true);
  });

  test('@regression TC-VIT-005 | Patient info is displayed correctly', async ({ patientDetailPage }) => {
    await patientDetailPage.goToPatient('P-1001');
    const name = await patientDetailPage.getPatientName();
    expect(name).toContain('Rajesh');
    expect(name).toContain('Kumar');

    const patientId = await patientDetailPage.getTextContent(patientDetailPage.patientId);
    expect(patientId).toBe('P-1001');

    const gender = await patientDetailPage.getTextContent(patientDetailPage.patientGender);
    expect(gender).toBe('Male');
  });

  test('@regression TC-VIT-006 | Vitals recorded for different patient', async ({ patientDetailPage, page }) => {
    await patientDetailPage.goToPatient('P-1002');
    const beforeCount = await patientDetailPage.getVitalsCount();

    await patientDetailPage.recordVitals({
      bp: '115/75',
      heartRate: '68',
      temp: '98.4',
      weight: '56',
      spo2: '99',
      notes: 'All normal'
    });
    await page.waitForLoadState('networkidle');

    const afterCount = await patientDetailPage.getVitalsCount();
    expect(afterCount).toBe(beforeCount + 1);
  });
});
