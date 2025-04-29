import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

const OpportunityCountTable = () => {
  const [tableData, setTableData] = useState([]);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard`)
      .then(res => res.json())
      .then(data => {
        const stages = data.pipelineData;
        const wonStage = stages.find(stage => stage.label === 'Won');
        const processedRows = [];

        for (let i = 0; i < stages.length; i++) {
          const current = stages[i];
          const next = stages[i + 1];
           
          const nextStageCount = next ? next.count : null;
          const lostCount = nextStageCount !== null ? current.count - nextStageCount : null;
          
          const successRate = (current.label !== 'Won')
            ? `${Math.round((wonStage.count / current.count) * 100)}%`
            : '100%';

          processedRows.push({
            name: current.label,
            incoming: current.count,
            lost: lostCount !== null ? lostCount : '',
            advanced: nextStageCount !== null ? nextStageCount : '',
            successRate,
            isWonStage: current.label === 'Won'
          });
        }

        setTableData(processedRows);
      });
  },[]);

  const totalLostCount = tableData.reduce((sum, row) => sum + (parseInt(row.lost) || 0), 0);

  return (
    <Paper sx={{ m: 2, p: 2 }} variant="outlined">
      <h2>
        Win Rate Table
      </h2>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Stage</strong></TableCell>
              <TableCell><strong>Came to Stage</strong></TableCell>
              <TableCell sx={{ bgcolor: '#c65911', color: '#fff' }}>
                <strong>Lost / Disqualified from Stage</strong>
              </TableCell>
              <TableCell sx={{ bgcolor: '#70ad47', color: '#fff' }}>
                <strong>Moved to next stage</strong>
              </TableCell>
              <TableCell><strong>Win Rate %</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.name}</TableCell>
                <TableCell sx={row.isWonStage ? { bgcolor: '#548236', color: 'white' } : {}}>
                  {row.incoming}
                </TableCell>
                <TableCell>{row.lost}</TableCell>
                <TableCell>{row.advanced}</TableCell>
                <TableCell>{row.successRate}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell><strong>{totalLostCount}</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OpportunityCountTable;
