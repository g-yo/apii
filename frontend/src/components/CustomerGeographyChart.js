import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CustomerGeographyChart = () => {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/customer-geography')
            .then(response => {
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    const data = response.data;
                    const labels = data.map(item => item._id);
                    const counts = data.map(item => item.count);

                    setGeoData({
                        labels: labels,
                        datasets: [{
                            label: 'Geographical Distribution of Customers',
                            data: counts,
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching geographical data:', error.response ? error.response.data : error.message);
            });
    }, []);

    if (!geoData) return <p>Loading...</p>;

    return (
        <div>
            <h2>Geographical Distribution of Customers</h2>
            <Bar data={geoData} />
        </div>
    );
};

export default CustomerGeographyChart;
