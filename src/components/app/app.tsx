import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from '@components/app-layout/app-layout';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';
import { RegisterPage } from '@pages/register/register';

import type { JSX } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
]);

export const App = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
