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
  const [devices, setDevices] = useState<
    { id: string; name: string; temperature: number; pressure: number }[]
  >([]);

  const fetchDevices = () => {
    setLoading(true);
    setTimeout(() => {
      setDevices([
        { id: '1', name: 'Humidifier Living Room', temperature: 23, pressure: 1012 },
        { id: '2', name: 'Humidifier Bedroom', temperature: 21, pressure: 1010 },
      ]);
      setLoading(false);
    }, 1000);
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
