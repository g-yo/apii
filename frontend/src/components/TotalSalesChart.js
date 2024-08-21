import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registering necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const TotalSalesChart = () => {
    const [salesData, setSalesData] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        axios.get('http://localhost:5000/api/total-sales')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const data = response.data;
                    const labels = data.map(item => `${item._id.month}/${item._id.day}/${item._id.year}`);
                    const sales = data.map(item => item.total_sales);

                    setSalesData({
                        labels: labels,
                        datasets: [{
                            label: 'Total Sales Over Time',
                            data: sales,
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,1)',
                            borderColor: 'rgba(75,192,192,1)',
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching sales data:', error.response ? error.response.data : error.message);
            });
    }, []);

    // Chart.js options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Total Sales Over Time',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
                type: 'category',
                labels: salesData ? salesData.labels : [],
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Sales',
                },
                beginAtZero: true,
            },
        },
    };

    // Render loading message if data is not yet available
    if (!salesData) return <p>Loading...</p>;

    // Render the chart
    return (
        <div>
            <Line data={salesData} options={options} />
        </div>
    );
};

export default TotalSalesChart;
