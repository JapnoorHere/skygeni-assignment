const express = require('express');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/dashboard', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, rawData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to load data');
    }

    const stages = JSON.parse(rawData);
    
    const suspectStage = stages.find(stage => stage.label === 'Suspect');
    
    
    const qualifyStage = stages.find(stage => stage.label === 'Qualify');
    const wonStage = stages.find(stage => stage.label === 'Won');

    const qualifyRate = Math.round((qualifyStage.acv / suspectStage.acv) * 100);
    const winRate = Math.round((wonStage.acv / suspectStage.acv) * 100);
    console.log('-=====');
    
    console.log({
        suspectStage, qualifyStage, wonStage
    });

    console.log("qualifyRate", qualifyRate);
    console.log("winRate", winRate);
    
    

    const responseData = {
        pipelineData: stages,
        suspectValue: suspectStage.acv,
        qualifyValue: qualifyStage.acv,
        wonValue: wonStage.acv,
        qualifyPer: qualifyRate,
        wonPer: winRate,
    };

    console.log(';;;;;;;;;;;;;;;;;;;');
    console.log(responseData);
    
    

    res.json(responseData); 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
