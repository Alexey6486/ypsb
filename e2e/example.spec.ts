import { test, expect } from '@playwright/test';

test('тест заголовка главной страницы', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('main-title')).toHaveText('Соберите бургер');
});

test('тест ингредиентов в меню', async ({ page }) => {
  await page.goto('/');

  const ingredients = await page.locator('.ingredient-source');
  await expect(ingredients).toHaveCount(15);
});

test('тест ингредиентов в заказе', async ({ page }) => {
  await page.goto('/');

  const order = await page.locator('.ingredient-order');
  await expect(order).toHaveCount(0);
});

test('тест перемещения ингредиента в заказ', async ({ page }) => {
  await page.goto('/');

  // убеждаемся, что ингредиенты пришли с сервера
  const response = await page.waitForResponse(r =>
    r.url().includes('ingredients') && r.status() === 200
  );

  const data = await response.json();
  expect(data.data.length).toBeGreaterThan(0);

  // убеждаемся, что ингредиенты появились на странице
  const ingredients = await page.locator('.ingredient-source');
  await expect(ingredients.first()).toBeVisible({ timeout: 10000 });

  // проверяем, что в заказе ничего нет
  const orderZone = await page.locator('.drop-zone');

  const orderIngredients = await page.locator('.ingredient-order');
  await expect(orderIngredients).toHaveCount(0);

  // перетаскиваем два элемента
  const bun = ingredients.first();
  const content = ingredients.nth(2);

  await bun.dragTo(orderZone);
  await content.dragTo(orderZone);

  // т.к. добавили булку, то их появится в заказе две + 1 ингредиент
  await expect(orderIngredients).toHaveCount(3);

  const btn = await page.getByTestId('pw-send-order');
  await expect(btn).toBeVisible({ timeout: 10000 });

  await btn.click();

  // пользователь не авторизован, происходит редирект
  await expect(page).toHaveURL(/\/login$/);
});

