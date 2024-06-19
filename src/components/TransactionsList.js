// src/components/TransactionsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsList = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    useEffect(() => {
        axios.get(`/api/transactions?page=${page}&perPage=${perPage}&search=${search}`)
            .then(response => {
                setTransactions(response.data.transactions);
            })
            .catch(error => {
                console.error('There was an error fetching the transactions!', error);
            });
    }, [page, perPage, search]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        <h2>{transaction.title}</h2>
                        <p>{transaction.description}</p>
                        <p>Price: ${transaction.price}</p>
                        <p>Sold: {transaction.sold ? 'Yes' : 'No'}</p>
                        <p>Date of Sale: {new Date(transaction.dateOfSale).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
            <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default TransactionsList;
