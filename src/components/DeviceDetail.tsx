'use client';

import { Typography, Sheet, Box, Slider, Card, CardContent, Button, CircularProgress } from '@mui/joy';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDevice } from '@/context/DeviceContext';
import { useEffect, useState, useRef } from 'react';

const HUMIDITY_SENSOR_SERVICE_UUID = '000000ff-0000-1000-8000-00805f9b34fb';
const HUMIDITY_SENSOR_CHARACTERISTIC_UUID = '0000ff03-0000-1000-8000-00805f9b34fb';
const TARGET_HUMIDITY_CHARACTERISTIC_UUID = '0000ff01-0000-1000-8000-00805f9b34fb';


interface HumidityPoint {
  time: string;
  humidity: number;
}

export default function DeviceDetail() {
  const { device, unpair } = useDevice();

  const [pressure, setPressure] = useState<number>();
  const [temperature, setTemperature] = useState<number>();
  const [humidityData, setHumidityData] = useState<HumidityPoint[]>([]);
  const [targetHumidity, setTargetHumidity] = useState<number>(70);

  const sensorCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const targetHumidityCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (!device) return;

    let gattServer: BluetoothRemoteGATTServer | null = null;

    const writeTarget = async (valueToWrite: number = targetHumidity) => {
      if (!targetHumidityCharRef.current) return; 
      try {
        const payload = new Uint8Array([Math.round(valueToWrite)]);
        await targetHumidityCharRef.current.writeValue(payload);
      } catch (err) {
        console.error('Failed to write target humidity:', err);
      }
    };

    const handleSensorData = (value: DataView) => {
      if (!value) return;

      const temperature = value.getFloat32(0, true);
      const humidity = value.getFloat32(4, true);
      const pressure = value.getFloat32(8, true);
      setPressure(pressure);
      setTemperature(temperature);

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHumidityData((prev) => {
        const updated = [...prev, { time: now, humidity: Math.round(100 * humidity) / 100 }];
        return updated.slice(-30);
      });
    };

    const connectGatt = async () => {
      try {
        gattServer = await device.gatt!.connect();
        const service = await gattServer.getPrimaryService(HUMIDITY_SENSOR_SERVICE_UUID);

        sensorCharRef.current = await service.getCharacteristic(HUMIDITY_SENSOR_CHARACTERISTIC_UUID);
        targetHumidityCharRef.current = await service.getCharacteristic(TARGET_HUMIDITY_CHARACTERISTIC_UUID);

        // write current target once the characteristic is available
        await writeTarget();

        const handlePolling = async () => {
          try {
            if (sensorCharRef.current) {
              const value = await sensorCharRef.current.readValue();
              handleSensorData(value);
            }
          } catch (pollError) {
            console.error('Polling failed:', pollError);
          }
        };

        // initial read and periodic polling
        await handlePolling();
        pollIntervalRef.current = setInterval(handlePolling, 20000);
      } catch (err) {
        console.error('Failed to connect GATT:', err);
      }
    };

    connectGatt();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      try {
        if (gattServer && gattServer.connected) gattServer.disconnect();
      } catch (err) {
        console.warn('Error while disconnecting GATT server:', err);
      }
      sensorCharRef.current = null;
      targetHumidityCharRef.current = null;
    };
  }, [device]);

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
            Temperatura: {Math.round(temperature * 100) / 100}°C · Pressão: {Math.round(pressure * 100) / 100} hPa
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
                onChangeCommitted={(_, value) => {
                  if (!targetHumidityCharRef.current) return;
                  const write = async () => {
                    try {
                      const payload = new Uint8Array([Math.round(value as number)]);
                      await targetHumidityCharRef.current!.writeValue(payload);
                    } catch (err) {
                      console.error('Failed to write target humidity on change:', err);
                    }
                  };
                  write();
                }}
                min={0}
                max={100}
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