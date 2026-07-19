import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly modalClose: Locator;
  readonly modalOpen: Locator;

  constructor(page: Page, modalOpen: string) {
    this.page = page;
    this.modal = page.getByTestId('pw-modal');
    this.modalClose = page.getByTestId('pw-modal-close');
    this.modalOpen = page.locator(modalOpen);
  }

  async openModal() {
    const btn = await this.modalOpen.first();
    await expect(btn).toBeVisible({ timeout: 10000 });
    await btn.click();
    await expect(this.modal).toBeVisible({ timeout: 10000 });
  }

  async closeModal() {
    await this.modalClose.click();
    await expect(this.modal).toHaveCount(0);
  }
}
