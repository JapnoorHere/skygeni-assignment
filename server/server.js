const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/dashboard-data', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/data.json'), 'utf8', (err, jsonData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to load data');
    }

    const rawData = JSON.parse(jsonData);

    const suspect = rawData.find(item => item.label === 'Suspect');
    const qualify = rawData.find(item => item.label === 'Qualify');
    const won = rawData.find(item => item.label === 'Won');

    const qualifyPercentage = Number(((qualify.acv / suspect.acv) * 100).toFixed(2));
    const wonPercentage = Math.round((won.acv / suspect.acv) * 100);

    const response = {
      pipelineData: rawData,
      summary: {
        suspectValue: suspect.acv,
        qualifyValue: qualify.acv,
        wonValue: won.acv,
        qualifyPercentage,
        wonPercentage,
      }
    };

    res.json(response); 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
