'use client';

import * as React from 'react';
import { useDevice } from '@/context/DeviceContext';
import DeviceList from '@/components/DeviceList';
import DeviceDetail from '@/components/DeviceDetail';

export default function HomePage() {
  const { device } = useDevice();
  return device ? <DeviceDetail /> : <DeviceList />;
}
