import { test, expect } from '@playwright/test';

test('тест перемещения ингредиента в заказ и создание тестового заказа', async ({ page }) => {
  // har файл с запросом ингредиентов и создания заказа
  await page.routeFromHAR('./e2e/hars/burger-constructor.har', {
    url: '**/api/**',  // только API-запросы из HAR
    update: false,     // читать из файла, не перезаписывать
  });

  await page.goto('/');

  // добавляем в store мок-пользователя, который будет необходим для создания заказа
  // (по чек листу, функционал авторизации не проверяется данным тестом)
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

  // проверяем, что пользователь сохранился в store
  const userState = await page.evaluate(() => {
    const store = (window as unknown).appStore;
    return store.getState().user;
  });
  await expect(userState.user).toEqual(mockUser);

  // получаем ингредиенты на странице и убеждаемся, что выбранный ингредиент появился на странице
  const ingredients = await page.locator('.pw-ingredient-source');
  const first = ingredients.first();
  await expect(first).toBeVisible({ timeout: 10000 });

  // открываем модальное окно состава ингредиента и проверяем, что оно появилось в html
  await first.click();
  const modalIngredient = await page.getByTestId('pw-modal');
  await expect(modalIngredient).toBeVisible({ timeout: 10000 });

  // проверяем наличие строк названия и кол-ва калорий, чтобы убедиться, что данные отобразились
  const modalIngredientName = await page.getByTestId('pw-ingredient-name');
  const modalIngredientNameText = await modalIngredientName.textContent();
  expect(modalIngredientNameText?.length).toBeGreaterThan(0);

  const modalIngredientCalories = await page.getByTestId('pw-ingredient-calories');
  const modalIngredientCaloriesText = await modalIngredientCalories.textContent();
  expect(modalIngredientCaloriesText?.length).toBeGreaterThan(0);

  // закрываем модальное окно состава ингредиента и проверяем, что его нет в html
  const modalIngredientClose = await page.getByTestId('pw-modal-close');
  await modalIngredientClose.click();
  await expect(modalIngredient).toHaveCount(0);

  // проверяем дроп зону, чтобы убедиться, что до перетаскивания там ничего нет
  const orderZone = await page.locator('.pw-drop-zone');
  const orderIngredients = await page.locator('.pw-ingredient-order');
  await expect(orderIngredients).toHaveCount(0);

  // перетаскиваем два ингредиента
  const bun = ingredients.first();
  const content = ingredients.nth(2);

  await bun.dragTo(orderZone);
  await content.dragTo(orderZone);

  // проверяем в дроп зоне наличие трёх ингредиентов, т.к. один из ингредиентов булка, а их в заказе всегда две
  await expect(orderIngredients).toHaveCount(3);

  // проверяем наличие данных заказа в store
  const orderState = await page.evaluate(() => {
    const store = (window as unknown).appStore;
    return store.getState().ingredients.order;
  });
  await expect(orderState.bun).not.toBeNull();
  await expect(Array.isArray(orderState.ingredients)).toBe(true);
  await expect(orderState.ingredients.length).toBeGreaterThan(0);

  // находим кнопку отправки заказа и нажимаем её
  const btn = await page.getByTestId('pw-send-order');
  await expect(btn).toBeVisible({ timeout: 10000 });
  await btn.click();

  // проверяем, что модальное окно заказа появилось в html
  const modalOrder = await page.getByTestId('pw-modal');
  await expect(modalOrder).toBeVisible({ timeout: 10000 });

  // проверяем, что модальное окно заказа содержит номер заказа
  const modalOrderNumber = await page.getByTestId('pw-modal-order-number');
  const modalOrderNumberText = await modalOrderNumber.textContent();
  expect(modalOrderNumberText?.length).toBeGreaterThan(0);

  // закрываем модальное окно заказа и проверяем, что его нет в html
  const modalOrderClose = await page.getByTestId('pw-modal-close');
  await modalOrderClose.click();
  await expect(modalOrder).toHaveCount(0);
});

