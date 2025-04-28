import React from 'react'
import OpportunityCountCard from './OpportunityCountCard';
import AcvWinRateCard from './AcvWinRateCard';
import OpportunityCountTable from './OpportunityCountTable';
import ValueProgressionTable from './ValueProgressionTable';
import './index.css';
const App = () => {
  return (
    <div className='container'>
      <OpportunityCountCard />
      <AcvWinRateCard/>
      <OpportunityCountTable />
      <ValueProgressionTable />
    </div>
  )
}

export default App
