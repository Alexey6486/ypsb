import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from '@components/app-layout/app-layout';
import { ModalIngredients } from '@components/ingredient-details/modal-ingredients';
import { ModalOrder } from '@components/order/modal-order';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { ErrorPage } from '@pages/error/error';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';
import { ProfileOrdersPage } from '@pages/profile-orders/profile-orders';
import { ProfileSettingsPage } from '@pages/profile-settings/profile-settings';
import { ProfilePage } from '@pages/profile/profile';
import { RegisterPage } from '@pages/register/register';
import { ProtectedReset } from '@pages/reset-password/protected-reset';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { fetchIngredientsThunk } from '@services/slices/ingredients-slice';
import { checkUserAuthThunk } from '@services/slices/user-slice';
import { useAppDispatch } from '@services/store';

import type { JSX } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/login',
        element: <ProtectedRoute onlyUnAuth={true} />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        path: '/register',
        element: <ProtectedRoute onlyUnAuth={true} />,
        children: [{ index: true, element: <RegisterPage /> }],
      },
      {
        path: '/forgot-password',
        element: <ProtectedRoute onlyUnAuth={true} />,
        children: [{ index: true, element: <ForgotPasswordPage /> }],
      },
      {
        path: '/reset-password',
        element: <ProtectedRoute onlyUnAuth={true} />,
        children: [
          {
            path: '/reset-password',
            element: <ProtectedReset />,
            children: [{ index: true, element: <ResetPasswordPage /> }],
          },
        ],
      },
      {
        path: '/',
        element: <HomePage />,
        children: [{ path: 'ingredients/:id', element: <ModalIngredients /> }],
      },
      {
        path: '/feed',
        element: <FeedPage />,
        children: [{ path: ':id', element: <ModalOrder /> }],
      },
      {
        path: '/profile',
        element: <ProtectedRoute onlyUnAuth={false} />,
        children: [
          {
            element: <ProfilePage />,
            children: [
              { index: true, element: <ProfileSettingsPage /> },
              {
                path: 'orders',
                element: <ProfileOrdersPage />,
                children: [{ path: ':id', element: <ModalOrder /> }],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <ErrorPage code="404" text="Страница не найдена" />,
      },
    ],
  },
]);

export const App = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(checkUserAuthThunk());
    void dispatch(fetchIngredientsThunk());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
