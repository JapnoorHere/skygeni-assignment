const express = require('express');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config()
const path = require('path')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*'
}));



app.get('/api/dashboard', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, rawData) => {
    if (err) {
      
      return res.status(500).send('Failed to load data');
    }

    const stages = JSON.parse(rawData);
    
    const suspectStage = stages.find(stage => stage.label === 'Suspect');
    
    
    const qualifyStage = stages.find(stage => stage.label === 'Qualify');
    const wonStage = stages.find(stage => stage.label === 'Won');

    const qualifyRate = Math.round((qualifyStage.acv / suspectStage.acv) * 100);
    const winRate = Math.round((wonStage.acv / suspectStage.acv) * 100);

    const responseData = {
        pipelineData: stages,
        suspectValue: suspectStage.acv,
        qualifyValue: qualifyStage.acv,
        wonValue: wonStage.acv,
        qualifyPer: qualifyRate,
        wonPer: winRate,
    };
    res.json(responseData); 
  });
});

app.listen(PORT, () => {
  
});
