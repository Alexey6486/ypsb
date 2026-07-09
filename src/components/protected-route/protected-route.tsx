import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import {
  checkUserAuthThunk,
  selectIsAuthChecked,
  selectUser,
} from '@services/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { TLocationState } from '@utils/types';
import type { JSX } from 'react';

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: {
  onlyUnAuth: boolean;
}): JSX.Element => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthChecked) {
      void dispatch(checkUserAuthThunk());
    }
  }, []);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location as TLocationState).state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
