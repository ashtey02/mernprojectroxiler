// src/App.js
import React, { useState } from 'react';
import TransactionsList from './components/TransactionsList';
import CombinedData from './components/CombinedData';

const App = () => {
    const [month, setMonth] = useState('January');

    return (
        <div className="App">
            <h1>Project
            </h1>
            <select value={month} onChange={e => setMonth(e.target.value)}>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>
            <TransactionsList />
            <CombinedData month={month} />
        </div>
    );
};

export default App;

