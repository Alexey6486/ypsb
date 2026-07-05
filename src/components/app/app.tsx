import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from '@components/app-layout/app-layout';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';
import { RegisterPage } from '@pages/register/register';
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
        path: '/',
        element: <HomePage />,
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
