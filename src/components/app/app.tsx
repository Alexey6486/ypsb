import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from '@components/app-layout/app-layout';
import { ModalOrderDetails } from '@components/order-details/modal-order-details';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { checkUserAuthThunk } from '@services/slices/user-slice';
import { useDispatch } from '@services/store';

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
        children: [{ index: true, element: <ResetPasswordPage /> }],
      },
      {
        path: '/',
        element: <HomePage />,
        children: [
          { index: true, element: <></> },
          { path: 'ingredients/:id', element: <ModalOrderDetails /> },
        ],
      },
      // {
      //   path: 'profile',
      //   element: <ProtectedRoute />,
      //   children: [
      //     { index: true, element: <ProfilePage /> },
      //     { path: 'orders', element: <ProfileOrdersPage /> },
      //     { path: 'settings', element: <ProfileSettingsPage /> },
      //   ],
      // },
    ],
  },
]);

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(checkUserAuthThunk());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
