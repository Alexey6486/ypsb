import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import type { JSX } from 'react';

import styles from './app-layout.module.css';

export const AppLayout = (): JSX.Element => {
  return (
    <div className={styles.app_layout}>
      <AppHeader />
      <Outlet />
    </div>
  );
};
