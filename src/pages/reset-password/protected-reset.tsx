import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { TLocationState } from '@utils/types';
import type { JSX } from 'react';

export const ProtectedReset = (): JSX.Element => {
  const location = useLocation<TLocationState>();

  if ((location.state as TLocationState)?.from?.pathname !== '/forgot-password') {
    return <Navigate to="/forgot-password" replace />;
  }

  return <Outlet />;
};
