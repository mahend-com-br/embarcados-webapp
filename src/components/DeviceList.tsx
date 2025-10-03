'use client';

import {
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Sheet,
  CircularProgress,
} from '@mui/joy';
import { useDevice } from '@/context/DeviceContext';
import { useEffect, useState } from 'react';

export default function DeviceList() {
  const { pair } = useDevice();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);

  const fetchDevices = () => {
    setLoading(true);

    if (!navigator.bluetooth) {
      console.error('Web Bluetooth API is not available in this browser.');
      setLoading(false);
      return;
    }

    navigator.bluetooth.requestDevice(
      // {
      // filters: [{ services: ['battery_service'] }],
      // optionalServices: ['device_information'],
      // }
    ).then((device) => {
      setDevices((prev) => {
        // Prevent duplicates
        if (prev.find((d) => d.id === device.id)) return prev;
        return [...prev, device];
      });
    }).catch((err) => console.error(err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Sheet sx={{ p: 2, minHeight: '100vh' }}>
      <Typography level="h2" sx={{ mb: 2, textAlign: 'center' }}>
        Available Devices
      </Typography>

      <Button onClick={fetchDevices} fullWidth variant="solid" sx={{ mb: 2 }}>
        {loading ? <CircularProgress size="sm" /> : 'Refresh'}
      </Button>

      <List>
        {devices.map((device) => (
          <ListItem key={device.id}>
            <ListItemButton onClick={() => pair(device)}>
              {device.name}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Sheet>
  );
}
