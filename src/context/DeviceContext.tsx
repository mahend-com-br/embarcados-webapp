'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type DeviceContextType = {
  device: BluetoothDevice | null;
  pair: (device: BluetoothDevice) => void;
  unpair: () => void;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);

  const pair = (dev: BluetoothDevice) => setDevice(dev);
  const unpair = () => setDevice(null);

  return (
    <DeviceContext.Provider value={{ device, pair, unpair }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) throw new Error('useDevice must be used inside DeviceProvider');
  return context;
}
