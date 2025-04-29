import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Box } from '@mui/material';
import * as d3 from 'd3';

const OpportunityCountCard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const barRefs = useRef([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard`)
      .then(res => res.json())
      .then(data => {
        setTotalSuccess(data.successPer);
        
        const stages = data.pipelineData;
        const suspectStage = stages.find(p => p.label === 'Suspect');
        const wonStage = stages.find(p => p.label === 'Won');

        const processedData = stages.map(stage => {
          const ratio = Math.round((stage.count / suspectStage.count) * 100);
          const success = Math.round((wonStage.count / stage.count) * 100);
          
          return {
            name: stage.label,
            total: stage.count,
            ratio,
            success,
          };
        });

        barRefs.current = Array(processedData.length).fill(null);
        
        setOpportunities(processedData);
      });
  }, []);

  useEffect(() => {
      opportunities.forEach((item, idx) => {
        if (barRefs.current[idx]) {
          renderD3Bar(barRefs.current[idx], item);
        }
      });
  }, [opportunities]);

  const renderD3Bar = (container, data) => {
    d3.select(container).selectAll("*").remove();


    const width = container.clientWidth;
    const height = 24;
    
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
    
    const ratioWidth = (data.ratio / 100) * width;
    const halfWidth = width / 2;
    const startPosition = halfWidth - (ratioWidth / 2);
    
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#ddd")
      .attr("rx", 4);
    
    svg.append("rect")
      .attr("x", startPosition)
      .attr("width", ratioWidth)
      .attr("height", height)
      .attr("fill", "#70ad47")
      .attr("rx", 4);
    
    svg.append("text")
      .attr("x", startPosition + ratioWidth / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text(data.total);
      
    svg.append("text")
      .attr("x", startPosition - 5)
      .attr("y", height / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .text(`${data.ratio}%`);
  };

  return (
    <Card sx={{ margin: 2 }} variant="outlined">
      <CardContent>
        <h2>
          Win Rate by opportunity count: {totalSuccess}%
        </h2>

        {opportunities.map((item, index) => (
            console.log(item, index),
          <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1} height={20}>
            <Box minWidth={80}>
              <h5>{item.name}</h5>
            </Box>
            
            <Box 
              flex={1} 
              mx={1} 
              height={24}
              ref={el => barRefs.current[index] = el}
            />
            
            <Box minWidth={40} textAlign="right">
              <p>{item.success}%</p>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default OpportunityCountCard;
