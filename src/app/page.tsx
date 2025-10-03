'use client';

import * as React from 'react';
import { Box, Button, Typography, Sheet } from '@mui/joy';

export default function HomePage() {
  return (
    <Sheet
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Typography level="h1" sx={{ fontSize: '2rem', mb: 2, textAlign: 'center' }}>
        🚀 Welcome to Joy UI + Next.js
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="solid">Get Started</Button>
        <Button variant="outlined">Learn More</Button>
      </Box>
    </Sheet>
  );
}
