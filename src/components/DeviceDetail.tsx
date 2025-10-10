'use client';

import { Typography, Sheet, Box, Slider, Card, CardContent, Button, CircularProgress } from '@mui/joy';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDevice } from '@/context/DeviceContext';
import { useEffect, useState } from 'react';

interface HumidityPoint {
  time: string;
  humidity: number;
}

export default function DeviceDetail() {
  const { device, unpair } = useDevice();

  const [pressure, setPressure] = useState<number>();
  const [temperature, setTemperature] = useState<number>();
  const [humidityData, setHumidityData] = useState<HumidityPoint[]>([]);
  const [targetHumidity, setTargetHumidity] = useState<number>(0);

  useEffect(() => {
    if (!device) return;

    setTargetHumidity(45); // Mock initial targetHumidity reading
  }, [device])

  useEffect(() => {
    if (!device) return;

    const readSensors = () => {
      // Mock next readings based on previous readings
      setPressure((previousPressure) => Math.round(100 * (previousPressure || 1000) * (1 + ((Math.random() - 0.5) * 0.1))) / 100);
      setTemperature((previousTemperature) => Math.round(100 * (previousTemperature || 20) * (1 + ((Math.random() - 0.5) * 0.1))) / 100);

      const newHumidity = 40 + Math.round(Math.random() * 20);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', });

      setHumidityData((prev) => {
        const updated = [...prev, { time: now, humidity: newHumidity }];
        return updated;
      });
    };

    readSensors(); // immediately do first reading
    const interval = setInterval(readSensors, 60 * 1000); // read every minute

    return () => clearInterval(interval);
  }, [device]);

  if (!device) return null;

  const hasData = pressure && temperature;

  return <Sheet sx={{ p: 2, minHeight: '100vh' }} >
    {
      hasData
        ? <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography level="h3">{device.name}</Typography>
            <Button size="sm" color="danger" onClick={unpair}>
              Desconectar
            </Button>
          </Box>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            Temperatura: {temperature}°C · Pressão: {pressure} hPa
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography level="title-md" sx={{ mb: 1 }}>
                Umidade (%)
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={humidityData}>
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="humidity" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography level="title-md" sx={{ mb: 1 }}>
                Umidade Desejada: {targetHumidity}%
              </Typography>
              <Slider
                value={targetHumidity}
                onChange={(_, value) => setTargetHumidity(value as number)}
                min={30}
                max={70}
                step={1}
                defaultValue={0}
              />
              <Typography level="body-sm" sx={{ mb: 1 }}>
                Lembre-se, a umidade alcançada se manterá próxima à desejada, mas pode não ser exatamente igual.
              </Typography>
            </CardContent>
          </Card>
        </>
        : <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress size="lg" />
        </Box>
    }
  </Sheet >
}
