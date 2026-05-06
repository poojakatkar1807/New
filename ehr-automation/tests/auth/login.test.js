const { test, expect } = require('../../fixtures/fixtures');
const testData = require('../../test-data/testData.json');

test.describe('Authentication — Login Tests', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
  });

  test('@smoke TC-AUTH-001 | Valid login with doctor credentials', async ({ loginPage, page }) => {
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke TC-AUTH-002 | Valid login with nurse credentials', async ({ loginPage, page }) => {
    await loginPage.login(testData.nurseUser.username, testData.nurseUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke TC-AUTH-003 | Valid login with admin credentials', async ({ loginPage, page }) => {
    await loginPage.login(testData.adminUser.username, testData.adminUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@regression TC-AUTH-004 | Invalid login with wrong password', async ({ loginPage }) => {
    await loginPage.login(testData.doctorUser.username, 'WrongPass123');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Invalid username or password');
  });

  test('@regression TC-AUTH-005 | Invalid login with wrong username', async ({ loginPage }) => {
    await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Invalid username or password');
  });

  test('@regression TC-AUTH-006 | Login with empty credentials', async ({ loginPage }) => {
    await loginPage.login('', '');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Please enter both username and password');
  });

  test('@regression TC-AUTH-007 | Login with empty password', async ({ loginPage, page }) => {
    await loginPage.login(testData.doctorUser.username, '');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
  });

  test('@smoke TC-AUTH-008 | Login page elements are visible', async ({ loginPage }) => {
    expect(await loginPage.isVisible(loginPage.loginTitle)).toBe(true);
    expect(await loginPage.isVisible(loginPage.usernameInput)).toBe(true);
    expect(await loginPage.isVisible(loginPage.passwordInput)).toBe(true);
    expect(await loginPage.isVisible(loginPage.loginButton)).toBe(true);
  });

  test('@smoke TC-AUTH-009 | Logout redirects to login page', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(testData.doctorUser.username, testData.doctorUser.password);
    await expect(page).toHaveURL(/dashboard/);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('@regression TC-AUTH-010 | Unauthenticated user redirected to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });
});
