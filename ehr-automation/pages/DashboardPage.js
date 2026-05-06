const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    this.dashboardTitle     = page.locator('[data-testid="dashboard-title"]');
    this.welcomeName        = page.locator('[data-testid="welcome-name"]');
    this.userName           = page.locator('[data-testid="user-name"]');
    this.userRole           = page.locator('[data-testid="user-role"]');
    this.logoutButton       = page.locator('[data-testid="logout-btn"]');
    this.navDashboard       = page.locator('[data-testid="nav-dashboard"]');
    this.navPatients        = page.locator('[data-testid="nav-patients"]');
    this.navAppointments    = page.locator('[data-testid="nav-appointments"]');
    this.statPatients       = page.locator('[data-testid="stat-patients"]');
    this.statScheduled      = page.locator('[data-testid="stat-scheduled"]');
    this.statCompleted      = page.locator('[data-testid="stat-completed"]');
    this.statPrescriptions  = page.locator('[data-testid="stat-prescriptions"]');
    this.recentPatientsTable      = page.locator('[data-testid="recent-patients-table"]');
    this.upcomingAppointmentsTable = page.locator('[data-testid="upcoming-appointments-table"]');
  }

  async goToDashboard() {
    await this.navigate('/dashboard');
  }

  async getWelcomeName() {
    return await this.getTextContent(this.welcomeName);
  }

  async getStatValue(statLocator) {
    const number = statLocator.locator('.stat-number');
    return await this.getTextContent(number);
  }

  async logout() {
    await this.clickElement(this.logoutButton);
  }

  async navigateToPatients() {
    await this.clickElement(this.navPatients);
  }

  async navigateToAppointments() {
    await this.clickElement(this.navAppointments);
  }
}

module.exports = { DashboardPage };
