// src/components/CombinedData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Statistics from './Statistics';
import BarChart from './BarChart';
import PieChart from './PieChart';

const CombinedData = ({ month }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/combined?month=${month}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the combined data!', error);
            });
    }, [month]);

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <Statistics month={month} />
            <BarChart month={month} />
            <PieChart month={month} />
        </div>
    );
};

export default CombinedData;
