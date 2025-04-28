import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const OpportunityBar = ({ name, total, ratio, success }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} height={20}>
    
    <Box minWidth={80}>
      <Typography variant="body2">{name}</Typography>
    </Box>

    <Box flex={1} mx={1}>
      <Box display="flex" height={24} borderRadius={1} overflow="hidden">
        <Box
            width={`${(100 - ratio)}%`}
            bgcolor="#ddd"
            display="block"/>

        <Box
          width={`${ratio}%`}
          bgcolor="#70ad47"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          fontSize={14}
        >
          {total}
        </Box>

        <Box
          width={`${100 - ratio}%`}
          bgcolor="#ddd"
        />
      </Box>
    </Box>

    <Box minWidth={40} textAlign="right">
      {success}%
    </Box>

  </Box>
);

const OpportunityCountCard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard`)
      .then(res => res.json())
      .then(data => {
        const stages = data.pipelineData;
        const suspectStage = stages.find(p => p.label === 'Suspect');
        const wonStage = stages.find(p => p.label === 'Won');

        const processedData = stages.map(stage => {
          const ratio = Math.round((stage.count / suspectStage.count) * 100);
          const success = stage.count ? Math.round((wonStage.count / stage.count) * 100) : 0;
          
          return {
            name: stage.label,
            total: stage.count,
            ratio,
            success,
          };
        });

        const overallSuccess = Math.round((wonStage.count / suspectStage.count) * 100);
        
        setOpportunities(processedData);
        setTotalSuccess(overallSuccess);
      });
  }, []);

  return (
    <Card sx={{ margin: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h6" mb={2}>
          Win Rate by opportunity count: {totalSuccess}%
        </Typography>

        {opportunities.map((item, index) => (
          <OpportunityBar
            key={index}
            name={item.name}
            total={item.total}
            ratio={item.ratio}
            success={item.success}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default OpportunityCountCard;
