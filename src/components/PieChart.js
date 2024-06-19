// src/components/PieChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ month }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/piechart?month=${month}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the pie chart data!', error);
            });
    }, [month]);

    if (!data) return <p>Loading...</p>;

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Number of Items',
                data: Object.values(data),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }
        ]
    };

    return (
        <div>
            <h2>Pie Chart for {month}</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default PieChart;
