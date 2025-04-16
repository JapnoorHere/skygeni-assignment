import React from 'react'
import DashboardCardOC from './DashboardCardOC';
import DashboardCardACV from './DashboardCardACV';
import DashboardTable from './DashboardTable';
import DashboardTableACV from './DashboardTableACV';
import './index.css';
const App = () => {
  return (
    <div className='container'>
      <DashboardCardOC className='item'/>
      <DashboardCardACV className='item'/>
      <DashboardTable className='item'/>
      <DashboardTableACV className='item'/>
    </div>
  )
}

export default App
