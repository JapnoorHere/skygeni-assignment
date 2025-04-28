import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper
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
          const successRate = current.label !== 'Won' ? `${Math.round((wonStage.acv / current.acv) * 100)}%` : '100%';

          processedRows.push({
            name: current.label,
            incoming: current.label === 'Won' ? '' : current.acv ? `$${Math.floor(current.acv).toLocaleString()}` : '',
            lost: lostValue !== null ? `$${Math.floor(lostValue).toLocaleString()}` : '',
            advanced: nextValue !== null ? `$${Math.floor(nextValue).toLocaleString()}` : '',
            successRate,
            isWonStage: current.label === 'Won',
            incomingRaw: current.acv || 0,
            lostRaw: lostValue || 0,
          });
        }

        setTableData(processedRows);
      });
  }, []);

  const totalLost = tableData.reduce((sum, row) => sum + (row.lostRaw || 0), 0);

  return (
    <Paper sx={{ m: 2, p: 2 }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Win Rate by ACV
      </Typography>
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
              <TableRow key={idx}>
                <TableCell>{row.name}</TableCell>
                <TableCell
                  sx={row.isWonStage ? { bgcolor: '#548236', color: 'white' } : {}}
                >
                  {row.isWonStage ? `$${Math.floor(row.incomingRaw).toLocaleString()}` : row.incoming}
                </TableCell>
                <TableCell>{row.lost}</TableCell>
                <TableCell>{row.advanced}</TableCell>
                <TableCell>{row.successRate}</TableCell>
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
