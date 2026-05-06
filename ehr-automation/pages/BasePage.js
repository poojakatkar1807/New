class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  async waitForElement(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async waitForURL(url) {
    await this.page.waitForURL(url, { timeout: 15000 });
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickElement(locator) {
    await this.waitForElement(locator);
    await locator.click();
  }

  async fillInput(locator, value) {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(value);
  }

  async selectDropdown(locator, value) {
    await locator.selectOption(value);
  }

  async getTextContent(locator) {
    return await locator.textContent();
  }

  async isVisible(locator) {
    return await locator.isVisible();
  }

  async isEnabled(locator) {
    return await locator.isEnabled();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `reports/screenshots/${name}.png`,
      fullPage: true
    });
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }
}

module.exports = { BasePage };
