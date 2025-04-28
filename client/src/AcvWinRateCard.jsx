import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import * as d3 from 'd3';

const AcvWinRateCard = () => {
  const [stageData, setStageData] = useState([]);
  const [totalWinRate, setTotalWinRate] = useState(0);
  const rowRefs = useRef({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard`)
      .then(response => response.json())
      .then(data => {
        const stages = data.pipelineData;
        const suspectStage = stages.find(item => item.label === 'Suspect');
        const wonStage = stages.find(item => item.label === 'Won');
        
        setTotalWinRate(data.wonPer);
        
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

        setStageData(formattedStages);
      });
  }, []);

  useEffect(() => {
    if (stageData.length > 0) {
      stageData.forEach((item, idx) => {
        if (rowRefs.current[`row-${idx}`]) {
          renderD3Bar(rowRefs.current[`row-${idx}`], item);
        }
      });
    }
  }, [stageData]);

  const renderD3Bar = (container, data) => {
    d3.select(container).selectAll("*").remove();
    
    const width = container.clientWidth;
    const height = 24;
    
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("preserveAspectRatio", "none");
    
    const conversionWidth = (data.conversion / 100) * width;
    const halfWidth = width / 2;
    const startPosition = halfWidth - (conversionWidth / 2);
    
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#ddd")
      .attr("rx", 4);
    
    svg.append("rect")
      .attr("x", startPosition)
      .attr("width", conversionWidth)
      .attr("height", height)
      .attr("fill", "#70ad47")
      .attr("rx", 4);
    
    svg.append("text")
      .attr("x", startPosition + conversionWidth / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text(`${Math.floor(data.value).toLocaleString()}`);
      
    svg.append("text")
      .attr("x", startPosition - 5)
      .attr("y", height / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .text(`${data.conversion}%`);
  };

  return (
    <Card sx={{ margin: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h6" mb={2}>
          Win Rate by ACV: {totalWinRate}%
        </Typography>

        {stageData.map((item, idx) => (
          <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" mb={1} height={20}>
            <Box width={80}>
              <Typography variant="body2">{item.label}</Typography>
            </Box>
            
            <Box 
              flex={1} 
              mx={1} 
              height={24} 
              ref={el => rowRefs.current[`row-${idx}`] = el}
            />
            
            <Box width={40} textAlign="right">
              <Typography variant="body2">{item.success}%</Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default AcvWinRateCard;
