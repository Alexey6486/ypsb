import { test, expect } from '@playwright/test';
import { TOKEN } from '@utils/constants';

test('тест заголовка главной страницы', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('pw-title')).toHaveText('Соберите бургер');
});

test('тест ингредиентов в меню', async ({ page }) => {
  await page.goto('/');

  const ingredients = await page.locator('.pw-ingredient-source');
  await expect(ingredients).toHaveCount(15);
});

test('тест ингредиентов в заказе', async ({ page }) => {
  await page.goto('/');

  const order = await page.locator('.pw-ingredient-order');
  await expect(order).toHaveCount(0);
});

// test('тест перемещения ингредиента в заказ и переход на страницу авторизации', async ({ page }) => {
//   await page.goto('/');
//
//   // убеждаемся, что ингредиенты пришли с сервера
//   const response = await page.waitForResponse(r =>
//     r.url().includes('ingredients') && r.status() === 200
//   );
//
//   const data = await response.json();
//   expect(data.data.length).toBeGreaterThan(0);
//
//   // убеждаемся, что ингредиенты появились на странице
//   const ingredients = await page.locator('.ingredient-source');
//   await expect(ingredients.first()).toBeVisible({ timeout: 10000 });
//
//   // проверяем, что в заказе ничего нет
//   const orderZone = await page.locator('.drop-zone');
//
//   const orderIngredients = await page.locator('.ingredient-order');
//   await expect(orderIngredients).toHaveCount(0);
//
//   // перетаскиваем два элемента
//   const bun = ingredients.first();
//   const content = ingredients.nth(2);
//
//   await bun.dragTo(orderZone);
//   await content.dragTo(orderZone);
//
//   // получаем три ингредиента, т.к. булки будет две
//   await expect(orderIngredients).toHaveCount(3);
//
//   const btn = await page.getByTestId('pw-send-order');
//   await expect(btn).toBeVisible({ timeout: 10000 });
//
//   await btn.click();
//
//   // пользователь не авторизован, происходит редирект
//   await expect(page).toHaveURL(/\/login$/);
// });

// test('тест перемещения ингредиента в заказ создание заказа (реальный токен пользователя)', async ({ page }) => {
//   await page.goto('/');
//
//   // убеждаемся, что ингредиенты пришли с сервера
//   const response = await page.waitForResponse(r =>
//     r.url().includes('ingredients') && r.status() === 200
//   );
//
//   const data = await response.json();
//   expect(data.data.length).toBeGreaterThan(0);
//
//   // убеждаемся, что ингредиенты появились на странице
//   const ingredients = await page.locator('.pw-ingredient-source');
//   await expect(ingredients.first()).toBeVisible({ timeout: 10000 });
//
//   // проверяем, что в заказе ничего нет
//   const orderZone = await page.locator('.pw-drop-zone');
//
//   const orderIngredients = await page.locator('.pw-ingredient-order');
//   await expect(orderIngredients).toHaveCount(0);
//
//   // перетаскиваем два элемента
//   const bun = ingredients.first();
//   const content = ingredients.nth(2);
//
//   await bun.dragTo(orderZone);
//   await content.dragTo(orderZone);
//
//   // получаем три ингредиента, т.к. булки будет две
//   await expect(orderIngredients).toHaveCount(3);
//
//   const btn = await page.getByTestId('pw-send-order');
//   await expect(btn).toBeVisible({ timeout: 10000 });
//
//   await btn.click();
//
//   await expect(page).toHaveURL(/\/login$/);
//
//   await page.fill('input[name="email"]', 'alexey6486@yandex.ru');
//   await page.fill('input[name="password"]', 'SombraViento2');
//   await page.click('button[type="submit"]');
//
//   await expect(page).toHaveURL(/\/$/);
//
//   const btn2 = await page.getByTestId('pw-send-order');
//
//   await expect(btn2).toBeVisible({ timeout: 10000 });
//
//   await btn2.click();
//
//   const modal = await page.getByTestId('pw-modal');
//
//   await expect(modal).toBeVisible({ timeout: 10000 });
// });

test('тест перемещения ингредиента в заказ и создание тестового заказа (мок токен)', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(TOKEN.ACCESS, 'test');
    localStorage.setItem(TOKEN.REFRESH, 'test');
  });

  await page.routeFromHAR('./e2e/hars/example.har', {
    url: '**/api/**',  // только API-запросы из HAR
    update: false,     // читать из файла, не перезаписывать
  });

  await page.goto('/');

  const mockUser = {
    email: 'user@test.ru',
    name: 'user-name',
  };

  await page.evaluate((user) => {
    const store = (window as unknown).appStore;
    const actions = (window as unknown).testActions;

    if (!actions || !actions.setUserAuth) {
      throw new Error('Test actions not found. Check window.testActions');
    }

    store.dispatch(actions.setUserAuth(user));
  }, mockUser);

  // убеждаемся, что ингредиенты пришли с сервера
  // const response = await page.waitForResponse(r =>
  //   r.url().includes('ingredients') && r.status() === 200
  // );
  //
  // const data = await response.json();
  // expect(data.data.length).toBeGreaterThan(0);

  // убеждаемся, что ингредиенты появились на странице
  const ingredients = await page.locator('.pw-ingredient-source');
  const first = ingredients.first();
  await expect(first).toBeVisible({ timeout: 10000 });

  await first.click();

  const modalIngredient = await page.getByTestId('pw-modal');

  await expect(modalIngredient).toBeVisible({ timeout: 10000 });

  const modalIngredientHtml = await modalIngredient.evaluate((el) => el.outerHTML)
  console.log({ modalIngredientHtml });

  const modalIngredientName = await page.getByTestId('pw-ingredient-name');
  const modalIngredientNameText = await modalIngredientName.textContent();
  expect(modalIngredientNameText?.length).toBeGreaterThan(0);

  const modalIngredientCalories = await page.getByTestId('pw-ingredient-calories');
  const modalIngredientCaloriesText = await modalIngredientCalories.textContent();
  expect(modalIngredientCaloriesText?.length).toBeGreaterThan(0);

  const modalIngredientClose = await page.getByTestId('pw-modal-close');
  await modalIngredientClose.click();

  await expect(modalIngredient).toHaveCount(0);

  // проверяем, что в заказе ничего нет
  const orderZone = await page.locator('.pw-drop-zone');

  const orderIngredients = await page.locator('.pw-ingredient-order');
  await expect(orderIngredients).toHaveCount(0);

  // перетаскиваем два ингредиента
  const bun = ingredients.first();
  const content = ingredients.nth(2);

  await bun.dragTo(orderZone);
  await content.dragTo(orderZone);

  // получаем три ингредиента, т.к. булки будет две
  await expect(orderIngredients).toHaveCount(3);

  const btn = await page.getByTestId('pw-send-order');

  await expect(btn).toBeVisible({ timeout: 10000 });

  await btn.click();

  const modalOrder = await page.getByTestId('pw-modal');

  await expect(modalOrder).toBeVisible({ timeout: 10000 });

  const modalOrderHtml = await modalOrder.evaluate((el) => el.outerHTML)
  console.log({ modalOrderHtml });

  const modalOrderNumber = await page.getByTestId('pw-modal-order-number');
  const modalOrderNumberText = await modalOrderNumber.textContent();
  expect(modalOrderNumberText?.length).toBeGreaterThan(0);

  const modalOrderClose = await page.getByTestId('pw-modal-close');
  await modalOrderClose.click();

  await expect(modalOrder).toHaveCount(0);
});

