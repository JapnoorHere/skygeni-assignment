import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper
} from '@mui/material';

const DashboardTable = () => {
  
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard-data`)
      .then(res => res.json())
      .then(data => {

        const pipeline = data.pipelineData;
        const won = pipeline.find(stage => stage.label === 'Won');
        const tableRows = [];

        for (let i = 0; i < pipeline.length; i++) {
          const current = pipeline[i];
          const next = pipeline[i + 1];
           
          const movedToNext = next ? next.count : null;
          const lost = movedToNext !== null ? current.count - movedToNext : null;
          const winRate = (current.label !== 'Won')
            ? `${Math.round((won.count / current.count) * 100)}%`
            : '100%';

          tableRows.push({
            stage: current.label,
            came: current.count,
            lost: lost !== null ? lost : '',
            moved: movedToNext !== null ? movedToNext : '',
            winRate,
            isWon: current.label === 'Won'
          });
        }

        setRows(tableRows);
      });
  },[]);


  const totalLost = rows.reduce((sum, row) => sum + (parseInt(row.lost) || 0), 0);

  return (
    <Paper sx={{ m: 2, p: 2 }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Win Rate Table
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Stage</strong></TableCell>
              <TableCell><strong>Came to Stage</strong></TableCell>
              <TableCell sx={{ bgcolor: '#f57c00', color: '#fff' }}>
                <strong>Lost / Disqualified from Stage</strong>
              </TableCell>
              <TableCell sx={{ bgcolor: '#43a047', color: '#fff' }}>
                <strong>Moved to next stage</strong>
              </TableCell>
              <TableCell><strong>Win Rate %</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.stage}</TableCell>
                <TableCell sx={row.isWon ? { bgcolor: '#43a047', color: 'white' } : {}}>
                  {row.came}
                </TableCell>
                <TableCell>{row.lost}</TableCell>
                <TableCell>{row.moved}</TableCell>
                <TableCell>{row.winRate}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell><strong>{totalLost}</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DashboardTable;
