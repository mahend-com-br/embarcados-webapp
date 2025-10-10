'use client';

import {
  Button,
  Typography,
  Sheet,
  CircularProgress,
} from '@mui/joy';
import { useDevice } from '@/context/DeviceContext';
import { useState } from 'react';

export default function DeviceList() {
  const { pair } = useDevice();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDevices = () => {
    setLoading(true);

    if (!navigator.bluetooth) {
      console.error('Web Bluetooth API indisponível.');
      setError('Web Bluetooth API indisponível.')
      setLoading(false);
      return;
    }

    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      // filters: [{ name: 'ESP_GATTS_DEMO' }], // TODO Add service-based filtering
    }
    ).then((device) => {
      console.log(device);
      pair(device);
    }).catch((err) => {
      setError(String(err));
      console.error(err);
    })
      .finally(() => setLoading(false));
  };

  return (
    <Sheet sx={{ p: 2, minHeight: '100vh' }}>
      <Typography level="h2" sx={{ mb: 2, textAlign: 'center' }}>
        Dispositivos Disponíveis
      </Typography>

      <Button onClick={fetchDevices} fullWidth variant="solid" sx={{ mb: 2 }}>
        {loading ? <CircularProgress size="sm" /> : 'Selecionar Dispositivo'}
      </Button>

      {
        error && <Typography level="body-md" sx={{ mb: 2, textAlign: 'center' }}>
        Ocorreu um erro: { error }
      </Typography>
      }
    </Sheet>
  );
}
