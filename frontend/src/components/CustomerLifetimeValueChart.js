import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CustomerLifetimeValueChart = () => {
    const [lifetimeValueData, setLifetimeValueData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/customer-lifetime-value')
            .then(response => {
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    const data = response.data;
                    const labels = data.map(item => `${item._id.year}-${item._id.month}`);
                    const lifetimeValues = data.map(item => item.cohort_value);

                    setLifetimeValueData({
                        labels: labels,
                        datasets: [{
                            label: 'Customer Lifetime Value by Cohorts',
                            data: lifetimeValues,
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            tension: 0.1
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching lifetime value data:', error.response ? error.response.data : error.message);
            });
    }, []);

    if (!lifetimeValueData) return <p>Loading...</p>;

    return (
        <div>
            <h2>Customer Lifetime Value by Cohorts</h2>
            <Line data={lifetimeValueData} />
        </div>
    );
};

export default CustomerLifetimeValueChart;
