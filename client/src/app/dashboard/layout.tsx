import React from 'react';
import styles from "./dashboard.module.scss";
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { dashboardMenuList } from '@/utils/staticData';




function DashboardLayout({children}: React.PropsWithChildren) {
  return (
    <React.Fragment>
      <LayoutWrapper  title='Dashboard' styles={styles} menuList={dashboardMenuList}>{children}</LayoutWrapper>
    </React.Fragment>
  )
}

export default DashboardLayout;