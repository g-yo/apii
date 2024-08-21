import React from 'react';
import TotalSalesChart from './TotalSalesChart';
import SalesGrowthRateChart from './SalesGrowthRateChart';
import NewCustomersChart from './NewCustomersChart';
import RepeatCustomersChart from './RepeatCustomersChart';
import CustomerGeographyChart from './CustomerGeographyChart';
import CustomerLifetimeValueChart from './CustomerLifetimeValueChart';

const Dashboard = () => {
    return (
        <div>
            <h1>E-Commerce Dashboard</h1>
            <TotalSalesChart />
            <SalesGrowthRateChart />
            <NewCustomersChart />
            <RepeatCustomersChart />
            <CustomerGeographyChart />
            <CustomerLifetimeValueChart />
        </div>
    );
};

export default Dashboard;
