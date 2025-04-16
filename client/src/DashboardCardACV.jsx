import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US',{
     style: 'currency', currency: 'USD', maximumFractionDigits: 0 
    }).format(value);

const BarRow = ({ label, acv, conversionRate, winRate }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} height={20}>
    
    <Box width={80}>
      <Typography variant="body2">{label}</Typography>
    </Box>

    <Box flex={1} mx={1}>
      <Box display="flex" height={24} borderRadius={1} overflow="hidden">
        <Box
          width={`${(100 - conversionRate)}%`}
          bgcolor="#ddd"
          display="block"/>

        <Box
          width={`${conversionRate}%`}
          bgcolor="green"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          fontSize={14}
          zIndex={1}
        >
          {formatCurrency(acv)}
        </Box>
        <Box
          width={`${100 - conversionRate}%`}
          bgcolor="#ddd"
          display="block"/>
      </Box>
    </Box>

    <Box width={40} textAlign="right">
      <Typography variant="body2">{winRate}%</Typography>
    </Box>
  </Box>
);

const DashboardCardACV = () => {
  const [stages, setStages] = useState([]);
  const [winRateByACV, setWinRateByACV] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard-data`)
      .then(res => res.json())
      .then(data => {

        
        const pipeline = data.pipelineData;
        const suspect = pipeline.find(p => p.label === 'Suspect');
        const won = pipeline.find(p => p.label === 'Won');

        const transformed = pipeline.map(stage => {
          const conversionRate = Math.round((stage.acv / suspect.acv) * 100);
          const winRate = stage.acv ? Math.round((won.acv / stage.acv) * 100) : 0;

          return {
            label: stage.label,
            acv: stage.acv,
            conversionRate,
            winRate,
          };
        });

        const overallWinRate = Math.round((won.acv / suspect.acv) * 100);

        setStages(transformed);
        setWinRateByACV(overallWinRate);
      });
  },[]);

  return (
    <Card sx={{ margin: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h6" mb={2}>
          Win Rate by ACV: {winRateByACV}%
        </Typography>

        {stages.map((stage, index) => (
          <BarRow
            key={index}
            label={stage.label}
            acv={stage.acv}
            conversionRate={stage.conversionRate}
            winRate={stage.winRate}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardCardACV;
