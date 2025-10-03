'use client';

import { Typography, Sheet, Box, Slider, Card, CardContent, Button } from '@mui/joy';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDevice } from '@/context/DeviceContext';
import { useState } from 'react';

export default function DeviceDetail() {
  const { device, unpair } = useDevice();
  
  // Mock humidity history
  const [data, _setData] = useState(
    Array.from({ length: 10 }).map((_, i) => ({
      time: `${i}m`,
      humidity: 40 + Math.round(Math.random() * 20),
    }))
  );
  
  const [targetHumidity, setTargetHumidity] = useState(50);
  
  if (!device) return null;

  return (
    <Sheet sx={{ p: 2, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography level="h3">{device.name}</Typography>
        <Button size="sm" color="danger" onClick={unpair}>
          Unpair
        </Button>
      </Box>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Temp: {device.temperature}°C · Pressure: {device.pressure} hPa
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="title-md" sx={{ mb: 1 }}>
            Humidity Over Time
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
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
            Desired Humidity: {targetHumidity}%
          </Typography>
          <Slider
            value={targetHumidity}
            onChange={(_, value) => setTargetHumidity(value as number)}
            min={30}
            max={70}
            step={1}
          />
        </CardContent>
      </Card>
    </Sheet>
  );
}
