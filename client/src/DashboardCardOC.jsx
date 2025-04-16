import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';


const BarRow = ({ label, count, conversionRate, winRate }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} height ={20}>
    
    <Box minWidth={80}>
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
        >
          {count}
        </Box>

        <Box
          width={`${100 - conversionRate}%`}
          bgcolor="#ddd"
        />
      </Box>
    </Box>

    <Box minWidth={40} textAlign="right">
      {winRate}%
    </Box>

  </Box>
);

const DashboardCardOC = () => {

  const [stages, setStages] = useState([]);
  const [winRateByCount, setWinRateByCount] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard-data`)
      .then(res => res.json())
      .then(data => {
        
        const pipeline = data.pipelineData;
        const suspect = pipeline.find(p => p.label === 'Suspect');
        const won = pipeline.find(p => p.label === 'Won');

        const transformed = pipeline.map(stage => {
          const conversionRate = Math.round((stage.count / suspect.count) * 100);
          const winRate = stage.count ? Math.round((won.count / stage.count) * 100) : 0;
          
          return {
            label: stage.label,
            count: stage.count,
            conversionRate,
            winRate,
          };
        });

        const overallWinRate = Math.round((won.count / suspect.count) * 100);
        
        setStages(transformed);
        setWinRateByCount(overallWinRate);

      });
  }, []);

  return (
    <Card sx={{ margin: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h6" mb={2}>
          Win Rate by opportunity count: {winRateByCount}%
        </Typography>

        {stages.map((stage, index) => (
          <BarRow
            key={index}
            label={stage.label}
            count={stage.count}
            conversionRate={stage.conversionRate}
            winRate={stage.winRate}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardCardOC;
