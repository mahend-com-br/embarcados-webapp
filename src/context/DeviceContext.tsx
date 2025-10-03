'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type DeviceInfo = {
  id: string;
  name: string;
  temperature: number;
  pressure: number;
};

type DeviceContextType = {
  device: BluetoothDevice | null;
  deviceInfo: DeviceInfo;
  pair: (device: BluetoothDevice) => void;
  unpair: () => void;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);

  const pair = (dev: BluetoothDevice) => setDevice(dev);
  const unpair = () => setDevice(null);

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    id: '',
    name: '',
    temperature: 23.15,
    pressure: 1012.5,
  });

  return (
    <DeviceContext.Provider value={{ device, pair, unpair, deviceInfo }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) throw new Error('useDevice must be used inside DeviceProvider');
  return context;
}
