import { useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { profileWsSlice } from '@services/slices/profile-ws-slice';
import { logoutThunk } from '@services/slices/user-slice';
import { useAppDispatch } from '@services/store';
import { BASE_WS_URL } from '@utils/api';
import { TOKEN } from '@utils/constants';

import type { JSX } from 'react';

import styles from './profile.module.css';

export const ProfilePage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    void (async (): Promise<void> => {
      try {
        await dispatch(logoutThunk());
      } catch (error: unknown) {
        console.log({ error });
      }
    })();
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN.ACCESS);

    if (token) {
      const rawToken = token.replace('Bearer ', '');
      void dispatch(profileWsSlice.actions.connect(`${BASE_WS_URL}?token=${rawToken}`));
    }

    return (): void => {
      void dispatch(profileWsSlice.actions.disconnect());
    };
  }, []);

  return (
    <div className={`${styles.profile} container`}>
      <nav className={`${styles.navigation} mr-15`}>
        <ul className="text text_type_main-medium mb-20">
          <li>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) => (isActive ? '' : 'text_color_inactive')}
            >
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) => (isActive ? '' : 'text_color_inactive')}
            >
              История заказов
            </NavLink>
          </li>
          <li>
            <Link to="/login" className="text_color_inactive" onClick={handleLogout}>
              Выход
            </Link>
          </li>
        </ul>
        <div className={`${styles.note} text text_type_main-default`}>
          В этом разделе вы можете изменить свои персональные данные
        </div>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
