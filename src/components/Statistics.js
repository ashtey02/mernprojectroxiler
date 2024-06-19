// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        axios.get(`/api/statistics?month=${month}`)
            .then(response => {
                setStatistics(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the statistics!', error);
            });
    }, [month]);

    if (!statistics) return <p>Loading...</p>;

    return (
        <div>
            <h2>Statistics for {month}</h2>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Sold Items: {statistics.soldItems}</p>
            <p>Not Sold Items: {statistics.notSoldItems}</p>
        </div>
    );
};

export default Statistics;
