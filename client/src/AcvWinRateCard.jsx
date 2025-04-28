import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AcvWinRateCard = () => {
  const [stageData, setStageData] = useState([]);
  const [totalWinRate, setTotalWinRate] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard`)
      .then(response => response.json())
      .then(data => {
        const stages = data.pipelineData;
        const suspectStage = stages.find(item => item.label === 'Suspect');
        const wonStage = stages.find(item => item.label === 'Won');

        const formattedStages = stages.map(stage => {
          const conversion = Math.round((stage.acv / suspectStage.acv) * 100);
          const success = stage.acv ? Math.round((wonStage.acv / stage.acv) * 100) : 0;

          return {
            label: stage.label,
            value: stage.acv,
            conversion,
            success,
          };
        });

        const overallRate = Math.round((wonStage.acv / suspectStage.acv) * 100);

        setStageData(formattedStages);
        setTotalWinRate(overallRate);
      });
  }, []);

  return (
    <Card sx={{ margin: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h6" mb={2}>
          Win Rate by ACV: {totalWinRate}%
        </Typography>

        {stageData.map((item, idx) => (
          <OpportunityRow
            key={idx}
            label={item.label}
            value={item.value}
            conversion={item.conversion}
            success={item.success}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AcvWinRateCard;


const OpportunityRow = ({ label, value, conversion, success }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} height={20}>
      <Box width={80}>
        <Typography variant="body2">{label}</Typography>
      </Box>
  
      <Box flex={1} mx={1}>
        <Box display="flex" height={24} borderRadius={1} overflow="hidden">
          <Box
            width={`${(100 - conversion)}%`}
            bgcolor="#ddd"
            display="block"
          />
          <Box
            width={`${conversion}%`}
            bgcolor="#70ad47"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize={14}
            zIndex={1}
          >
            ${Math.floor(value).toLocaleString()}
          </Box>
          <Box
            width={`${100 - conversion}%`}
            bgcolor="#ddd"
            display="block"
          />
        </Box>
      </Box>
  
      <Box width={40} textAlign="right">
        <Typography variant="body2">{success}%</Typography>
      </Box>
    </Box>
  );
  