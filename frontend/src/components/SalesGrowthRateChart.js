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

const SalesGrowthRateChart = () => {
    const [growthRateData, setGrowthRateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales-growth-rate')
            .then(response => {
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    const data = response.data;
                    const labels = data.map(item => `${item._id.year}-${item._id.month}`);
                    const growthRates = data.map(item => item.growth_rate || 0);

                    setGrowthRateData({
                        labels: labels,
                        datasets: [{
                            label: 'Sales Growth Rate Over Time',
                            data: growthRates,
                            fill: false,
                            backgroundColor: 'rgba(153,102,255,0.4)',
                            borderColor: 'rgba(153,102,255,1)',
                            tension: 0.1
                        }]
                    });
                    setLoading(false);
                } else {
                    console.error('Unexpected data format:', response.data);
                    setError('Unexpected data format');
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching growth rate data:', error);
                setError(`Error fetching growth rate data: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Sales Growth Rate Over Time</h2>
            <Line data={growthRateData} />
        </div>
    );
};

export default SalesGrowthRateChart;
