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

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const NewCustomersChart = () => {
    const [customersData, setCustomersData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/new-customers')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const data = response.data;
                    const labels = data.map(item => `${item._id.month}/${item._id.day}/${item._id.year}`);
                    const newCustomers = data.map(item => item.new_customers);

                    setCustomersData({
                        labels: labels,
                        datasets: [{
                            label: 'New Customers Added Over Time',
                            data: newCustomers,
                            fill: false,
                            backgroundColor: 'rgba(255,159,64,1)',
                            borderColor: 'rgba(255,159,64,1)',
                        }]
                    });
                }
            })
            .catch(error => console.error('Error fetching new customers data:', error));

    }, []);

    if (!customersData) return <p>Loading...</p>;

    return (
        <div>
            <Line data={customersData} />
        </div>
    );
};

export default NewCustomersChart;
