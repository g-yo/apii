import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const NumberOfRepeatCustomersChart = () => {
    const [repeatData, setRepeatData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/repeat-customers')
            .then(response => {
                console.log('API Response:', response.data);
                const data = response.data;

                if (data.length > 0) {
                    const labels = ['Repeat Customers'];
                    const counts = [data[0].repeat_customers]; // Assuming the response contains only the total number of repeat customers

                    setRepeatData({
                        labels: labels,
                        datasets: [{
                            label: 'Number of Repeat Customers',
                            data: counts,
                            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                            borderColor: ['rgba(54, 162, 235, 1)'],
                            borderWidth: 1
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching repeat customer data:', error.response ? error.response.data : error.message);
            });
    }, []);

    if (!repeatData) return <p>Loading...</p>;
    return (
        <div>
            <Doughnut data={repeatData} />
        </div>
    );
};

export default NumberOfRepeatCustomersChart;
