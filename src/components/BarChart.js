// src/components/BarChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/barchart?month=${month}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the bar chart data!', error);
            });
    }, [month]);

    if (!data) return <p>Loading...</p>;

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Number of Items',
                data: Object.values(data),
                backgroundColor: 'rgba(75,192,192,0.6)'
            }
        ]
    };

    return (
        <div>
            <h2>Bar Chart for {month}</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
