const { BasePage } = require('./BasePage');

class PatientRegistrationPage extends BasePage {
  constructor(page) {
    super(page);

    this.registerTitle       = page.locator('[data-testid="register-title"]');
    this.firstNameInput      = page.locator('[data-testid="first-name-input"]');
    this.lastNameInput       = page.locator('[data-testid="last-name-input"]');
    this.ageInput            = page.locator('[data-testid="age-input"]');
    this.genderSelect        = page.locator('[data-testid="gender-select"]');
    this.dobInput            = page.locator('[data-testid="dob-input"]');
    this.phoneInput          = page.locator('[data-testid="phone-input"]');
    this.emailInput          = page.locator('[data-testid="email-input"]');
    this.bloodGroupSelect    = page.locator('[data-testid="blood-group-select"]');
    this.addressInput        = page.locator('[data-testid="address-input"]');
    this.emergencyInput      = page.locator('[data-testid="emergency-contact-input"]');
    this.submitButton        = page.locator('[data-testid="submit-btn"]');
    this.errorMessage        = page.locator('[data-testid="error-message"]');
    this.successMessage      = page.locator('[data-testid="success-message"]');
  }

  async goToRegister() {
    await this.navigate('/patients/register');
  }

  async registerPatient(patient) {
    await this.fillInput(this.firstNameInput, patient.firstName);
    await this.fillInput(this.lastNameInput, patient.lastName);
    if (patient.age) await this.fillInput(this.ageInput, patient.age);
    await this.selectDropdown(this.genderSelect, patient.gender);
    if (patient.dob) await this.fillInput(this.dobInput, patient.dob);
    await this.fillInput(this.phoneInput, patient.phone);
    if (patient.email) await this.fillInput(this.emailInput, patient.email);
    if (patient.bloodGroup) await this.selectDropdown(this.bloodGroupSelect, patient.bloodGroup);
    if (patient.address) await this.fillInput(this.addressInput, patient.address);
    if (patient.emergencyContact) await this.fillInput(this.emergencyInput, patient.emergencyContact);
    await this.clickElement(this.submitButton);
  }

  async getSuccessMessage() {
    await this.waitForElement(this.successMessage);
    return await this.getTextContent(this.successMessage);
  }

  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getTextContent(this.errorMessage);
  }
}

module.exports = { PatientRegistrationPage };
