import React from 'react';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import styles from './admin.module.scss';
import { adminMenuList } from '@/utils/staticData';




function AdminLayout({children}: React.PropsWithChildren) {
  return (
    <React.Fragment>
      <LayoutWrapper title='Admin Panel' styles={styles} menuList={adminMenuList} >
        {children}
      </LayoutWrapper>
    </React.Fragment>
  )
}

export default AdminLayout;