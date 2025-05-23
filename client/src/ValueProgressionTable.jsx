import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

const ValueProgressionTable = () => {
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

          const nextValue = next ? next.acv : null;
          const lostValue = nextValue !== null ? current.acv - nextValue : null;
          
          const successRate = Math.round((wonStage.acv / current.acv) * 100);

          processedRows.push({
            label: current.label,
            incoming: Math.floor(current.acv),
            lost: lostValue !== null ? Math.floor(lostValue) : null,
            advanced: nextValue !== null ? Math.floor(nextValue) : null,
            successRate,
            isWonStage: current.label === 'Won',
            incomingRaw: current.acv,
            lostRaw: lostValue,
          });
        }
        setTableData(processedRows);
      });
  }, []);

  const totalLost = tableData.reduce((sum, row) => sum + (row.lostRaw), 0);

  return (
    <Paper sx={{ m: 2, p: 2 }} variant="outlined">
      <h2>
        Win Rate by ACV
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
            {tableData.map((row, idx) => (
              <TableRow key={idx} sx={idx%2!== 0 ? { bgcolor: '#f5f5f5' } : {}}>
                <TableCell>{row.label}</TableCell>
                <TableCell
                  sx={row.isWonStage ? { bgcolor: '#548236', color: 'white' } : {}}
                >
                  {row.isWonStage ? `$${Math.floor(row.incomingRaw).toLocaleString()}` : row.incoming}
                </TableCell>
                <TableCell>{row.lost}</TableCell>
                <TableCell>{row.advanced}</TableCell>
                <TableCell>{row.successRate}%</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell><strong>${Math.floor(totalLost).toLocaleString()}</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ValueProgressionTable;
