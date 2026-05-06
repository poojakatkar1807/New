const { BasePage } = require('./BasePage');

class PatientDetailPage extends BasePage {
  constructor(page) {
    super(page);

    this.patientDetailTitle = page.locator('[data-testid="patient-detail-title"]');
    this.patientInfo        = page.locator('[data-testid="patient-info"]');
    this.patientId          = page.locator('[data-testid="detail-patient-id"]');
    this.patientAge         = page.locator('[data-testid="detail-age"]');
    this.patientGender      = page.locator('[data-testid="detail-gender"]');
    this.patientPhone       = page.locator('[data-testid="detail-phone"]');
    this.patientEmail       = page.locator('[data-testid="detail-email"]');
    this.patientBloodGroup  = page.locator('[data-testid="detail-blood-group"]');
    this.patientStatus      = page.locator('[data-testid="detail-status"]');

    // Vitals
    this.addVitalsButton    = page.locator('[data-testid="add-vitals-btn"]');
    this.vitalsForm         = page.locator('[data-testid="vitals-form"]');
    this.bpInput            = page.locator('[data-testid="bp-input"]');
    this.heartRateInput     = page.locator('[data-testid="heart-rate-input"]');
    this.tempInput          = page.locator('[data-testid="temp-input"]');
    this.weightInput        = page.locator('[data-testid="weight-input"]');
    this.heightInput        = page.locator('[data-testid="height-input"]');
    this.spo2Input          = page.locator('[data-testid="spo2-input"]');
    this.vitalsNotesInput   = page.locator('[data-testid="vitals-notes-input"]');
    this.saveVitalsButton   = page.locator('[data-testid="save-vitals-btn"]');
    this.vitalsTable        = page.locator('[data-testid="vitals-table"]');
    this.vitalsRows         = page.locator('[data-testid="vitals-row"]');

    // Prescriptions
    this.addPrescriptionButton  = page.locator('[data-testid="add-prescription-btn"]');
    this.medNameInput           = page.locator('[data-testid="med-name-input"]');
    this.dosageInput            = page.locator('[data-testid="dosage-input"]');
    this.frequencyInput         = page.locator('[data-testid="frequency-input"]');
    this.durationInput          = page.locator('[data-testid="duration-input"]');
    this.prescriptionNotesInput = page.locator('[data-testid="prescription-notes-input"]');
    this.savePrescriptionButton = page.locator('[data-testid="save-prescription-btn"]');
    this.prescriptionCards      = page.locator('[data-testid="prescription-card"]');
  }

  async goToPatient(patientId) {
    await this.navigate(`/patients/${patientId}`);
  }

  async getPatientName() {
    return await this.getTextContent(this.patientDetailTitle);
  }

  async recordVitals(vitals) {
    await this.clickElement(this.addVitalsButton);
    await this.fillInput(this.bpInput, vitals.bp);
    await this.fillInput(this.heartRateInput, vitals.heartRate);
    if (vitals.temp) await this.fillInput(this.tempInput, vitals.temp);
    if (vitals.weight) await this.fillInput(this.weightInput, vitals.weight);
    if (vitals.height) await this.fillInput(this.heightInput, vitals.height);
    if (vitals.spo2) await this.fillInput(this.spo2Input, vitals.spo2);
    if (vitals.notes) await this.fillInput(this.vitalsNotesInput, vitals.notes);
    await this.clickElement(this.saveVitalsButton);
  }

  async getVitalsCount() {
    return await this.vitalsRows.count();
  }

  async addPrescription(prescription) {
    await this.clickElement(this.addPrescriptionButton);
    await this.fillInput(this.medNameInput, prescription.medName);
    await this.fillInput(this.dosageInput, prescription.dosage);
    if (prescription.frequency) await this.fillInput(this.frequencyInput, prescription.frequency);
    if (prescription.duration) await this.fillInput(this.durationInput, prescription.duration);
    if (prescription.notes) await this.fillInput(this.prescriptionNotesInput, prescription.notes);
    await this.clickElement(this.savePrescriptionButton);
  }

  async getPrescriptionCount() {
    return await this.prescriptionCards.count();
  }
}

module.exports = { PatientDetailPage };
