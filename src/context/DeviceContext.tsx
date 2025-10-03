'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type Device = {
  id: string;
  name: string;
  temperature: number;
  pressure: number;
};

type DeviceContextType = {
  device: Device | null;
  pair: (device: Device) => void;
  unpair: () => void;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<Device | null>(null);

  const pair = (dev: Device) => setDevice(dev);
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
