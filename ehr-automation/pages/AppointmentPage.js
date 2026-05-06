const { BasePage } = require('./BasePage');

class AppointmentPage extends BasePage {
  constructor(page) {
    super(page);

    this.appointmentsTitle   = page.locator('[data-testid="appointments-title"]');
    this.newAppointmentButton = page.locator('[data-testid="new-appointment-btn"]');
    this.appointmentForm     = page.locator('[data-testid="appointment-form"]');
    this.patientSelect       = page.locator('[data-testid="patient-select"]');
    this.doctorInput         = page.locator('[data-testid="doctor-input"]');
    this.dateInput           = page.locator('[data-testid="appointment-date-input"]');
    this.timeInput           = page.locator('[data-testid="appointment-time-input"]');
    this.typeSelect          = page.locator('[data-testid="appointment-type-select"]');
    this.notesInput          = page.locator('[data-testid="appointment-notes-input"]');
    this.scheduleButton      = page.locator('[data-testid="schedule-btn"]');
    this.appointmentsTable   = page.locator('[data-testid="appointments-table"]');
    this.appointmentRows     = page.locator('[data-testid="appointment-row"]');
    this.successMessage      = page.locator('[data-testid="success-message"]');
    this.errorMessage        = page.locator('[data-testid="error-message"]');

    // Filters
    this.filterAll       = page.locator('[data-testid="filter-all"]');
    this.filterScheduled = page.locator('[data-testid="filter-scheduled"]');
    this.filterCompleted = page.locator('[data-testid="filter-completed"]');
    this.filterCancelled = page.locator('[data-testid="filter-cancelled"]');
  }

  async goToAppointments() {
    await this.navigate('/appointments');
  }

  async scheduleAppointment(appointment) {
    await this.clickElement(this.newAppointmentButton);
    await this.selectDropdown(this.patientSelect, appointment.patientId);
    if (appointment.doctor) await this.fillInput(this.doctorInput, appointment.doctor);
    await this.fillInput(this.dateInput, appointment.date);
    await this.fillInput(this.timeInput, appointment.time);
    await this.selectDropdown(this.typeSelect, appointment.type);
    if (appointment.notes) await this.fillInput(this.notesInput, appointment.notes);
    await this.clickElement(this.scheduleButton);
  }

  async getAppointmentCount() {
    return await this.appointmentRows.count();
  }

  async getSuccessMessage() {
    await this.waitForElement(this.successMessage);
    return await this.getTextContent(this.successMessage);
  }

  async filterByStatus(status) {
    const filterMap = {
      'all': this.filterAll,
      'Scheduled': this.filterScheduled,
      'Completed': this.filterCompleted,
      'Cancelled': this.filterCancelled
    };
    await this.clickElement(filterMap[status]);
  }

  async completeAppointment(index) {
    await this.appointmentRows.nth(index).locator('[data-testid="complete-btn"]').click();
  }

  async cancelAppointment(index) {
    await this.appointmentRows.nth(index).locator('[data-testid="cancel-btn"]').click();
  }
}

module.exports = { AppointmentPage };
