const { test: base } = require('@playwright/test');
const { LoginPage }               = require('../pages/LoginPage');
const { DashboardPage }           = require('../pages/DashboardPage');
const { PatientListPage }         = require('../pages/PatientListPage');
const { PatientRegistrationPage } = require('../pages/PatientRegistrationPage');
const { PatientDetailPage }       = require('../pages/PatientDetailPage');
const { AppointmentPage }         = require('../pages/AppointmentPage');

const test = base.extend({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  patientListPage: async ({ page }, use) => {
    await use(new PatientListPage(page));
  },

  patientRegistrationPage: async ({ page }, use) => {
    await use(new PatientRegistrationPage(page));
  },

  patientDetailPage: async ({ page }, use) => {
    await use(new PatientDetailPage(page));
  },

  appointmentPage: async ({ page }, use) => {
    await use(new AppointmentPage(page));
  },

  // Pre-authenticated fixture — logs in as doctor before test
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.login(
      process.env.DOCTOR_USERNAME || 'doctor',
      process.env.DOCTOR_PASSWORD || 'Doctor@123'
    );
    await use(page);
  }
});

const { expect } = require('@playwright/test');
module.exports = { test, expect };
