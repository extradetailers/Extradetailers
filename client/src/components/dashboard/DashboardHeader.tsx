'use client'

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMessage } from '@/lib/ToastProvider';
import LocalStorage from '@/utils/LocalStorage';

function DashboardHeader() {
  const searchParams = useSearchParams();
  const { setMessage } = useMessage();

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    if (redirectStatus === 'succeeded') {
      setMessage({ 
        error: false, 
        text: 'If data is not showing properly try reloading in a minute!' 
      });
      LocalStorage.clearBookings();
    }
  }, [searchParams, setMessage]);

  return (
    <div>DashboardHeader</div>
  )
}

export default DashboardHeader;