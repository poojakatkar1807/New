const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.loginTitle     = page.locator('[data-testid="login-title"]');
    this.usernameInput  = page.locator('[data-testid="username-input"]');
    this.passwordInput  = page.locator('[data-testid="password-input"]');
    this.loginButton    = page.locator('[data-testid="login-btn"]');
    this.errorMessage   = page.locator('[data-testid="error-message"]');
    this.loginForm      = page.locator('[data-testid="login-form"]');
  }

  async goToLoginPage() {
    await this.navigate('/login');
  }

  async login(username, password) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getTextContent(this.errorMessage);
  }

  async isLoginPageVisible() {
    return await this.isVisible(this.loginButton);
  }
}

module.exports = { LoginPage };
