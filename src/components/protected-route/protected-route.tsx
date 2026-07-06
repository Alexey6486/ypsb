import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/slices/user-slice';
import { useSelector } from '@services/store';

type TLocationState = {
  from?: { pathname: string };
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: {
  onlyUnAuth: boolean;
}): JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation<TLocationState>();
  console.log({ isAuthChecked, user, location });
  if (!isAuthChecked) return <></>;

  if (onlyUnAuth && user) {
    const from = (location.state as TLocationState)?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
