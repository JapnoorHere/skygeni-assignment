import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper
} from '@mui/material';

const formatACV = (value) =>
  value ? value.toLocaleString('en-US', { minimumFractionDigits: 0 }) : '';

const DashboardTableACV = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/dashboard-data`)
      .then(res => res.json())
      .then(data => {

        const pipeline = data.pipelineData;
        const won = pipeline.find(stage => stage.label === 'Won');
        const tableData = [];

        for (let i = 0; i < pipeline.length; i++) {
          const current = pipeline[i];
          const next = pipeline[i + 1];



          const moved = next ? next.acv : null;
          const lost = moved !== null ? current.acv - moved : null;
          const winRate = current.label !== 'Won' ? `${Math.round((won.acv / current.acv) * 100)}%` : '100%';

          tableData.push({
            stage: current.label,
            came: current.label === 'Won' ? '' : formatACV(current.acv),
            lost: lost !== null ? formatACV(lost) : '',
            moved: moved !== null ? formatACV(moved) : '',
            winRate,
            isWon: current.label === 'Won',
            cameValue: current.acv || 0,
            lostValue: lost || 0,
          });
        }

        setRows(tableData);
      });
  }, []);

  const totalLost = rows.reduce((sum, row) => sum + (row.lostValue || 0), 0);

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
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.stage}</TableCell>
                <TableCell
                  sx={row.isWon ? { bgcolor: '#43a047', color: 'white' } : {}}
                >
                  {row.isWon ? formatACV(row.cameValue) : row.came}
                </TableCell>
                <TableCell>{row.lost}</TableCell>
                <TableCell>{row.moved}</TableCell>
                <TableCell>{row.winRate}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell><strong>{formatACV(totalLost)}</strong></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DashboardTableACV;
