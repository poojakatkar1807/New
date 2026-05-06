const { BasePage } = require('./BasePage');

class PatientListPage extends BasePage {
  constructor(page) {
    super(page);

    this.patientsTitle     = page.locator('[data-testid="patients-title"]');
    this.registerButton    = page.locator('[data-testid="register-patient-btn"]');
    this.searchInput       = page.locator('[data-testid="search-input"]');
    this.searchButton      = page.locator('[data-testid="search-btn"]');
    this.patientsTable     = page.locator('[data-testid="patients-table"]');
    this.patientRows       = page.locator('[data-testid="patient-row"]');
    this.noPatients        = page.locator('[data-testid="no-patients"]');
  }

  async goToPatients() {
    await this.navigate('/patients');
  }

  async searchPatient(query) {
    await this.fillInput(this.searchInput, query);
    await this.clickElement(this.searchButton);
  }

  async getPatientCount() {
    return await this.patientRows.count();
  }

  async getPatientNameByIndex(index) {
    return await this.patientRows.nth(index).locator('[data-testid="patient-name"]').textContent();
  }

  async getPatientIdByIndex(index) {
    return await this.patientRows.nth(index).locator('[data-testid="patient-id"]').textContent();
  }

  async viewPatient(index) {
    await this.patientRows.nth(index).locator('[data-testid="view-patient-btn"]').click();
  }

  async clickRegisterPatient() {
    await this.clickElement(this.registerButton);
  }
}

module.exports = { PatientListPage };
