'use client';

import { ReactNode } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { DeviceProvider } from '@/context/DeviceContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CssVarsProvider>
          <CssBaseline />
          <DeviceProvider>
            {children}
          </DeviceProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}
