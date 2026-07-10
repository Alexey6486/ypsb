import { Link, NavLink, Outlet } from 'react-router-dom';

import { logoutThunk } from '@services/slices/user-slice';
import { useAppDispatch } from '@services/store';

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
