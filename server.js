const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mernChallenge', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const ProductTransaction = require('./models/ProductTransaction');

app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await ProductTransaction.deleteMany({});
        await ProductTransaction.insertMany(transactions);

        res.send({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch data from the third-party API' });
    }
});
app.get('/api/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const query = search ? {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    } : {};

    try {
        const transactions = await ProductTransaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const total = await ProductTransaction.countDocuments(query);

        res.send({ transactions, total, page, perPage });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch transactions' });
    }
});
app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const transactions = await ProductTransaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) }
        });

        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const soldItems = transactions.filter(transaction => transaction.sold).length;
        const notSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.send({ totalSaleAmount, soldItems, notSoldItems });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch statistics' });
    }
});
app.get('/api/barchart', async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const transactions = await ProductTransaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) }
        });

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };

        transactions.forEach(transaction => {
            if (transaction.price <= 100) priceRanges['0-100']++;
            else if (transaction.price <= 200) priceRanges['101-200']++;
            else if (transaction.price <= 300) priceRanges['201-300']++;
            else if (transaction.price <= 400) priceRanges['301-400']++;
            else if (transaction.price <= 500) priceRanges['401-500']++;
            else if (transaction.price <= 600) priceRanges['501-600']++;
            else if (transaction.price <= 700) priceRanges['601-700']++;
            else if (transaction.price <= 800) priceRanges['701-800']++;
            else if (transaction.price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.send(priceRanges);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch bar chart data' });
    }
});
app.get('/api/piechart', async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const transactions = await ProductTransaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) }
        });

        const categories = {};

        transactions.forEach(transaction => {
            if (!categories[transaction.category]) {
                categories[transaction.category] = 0;
            }
            categories[transaction.category]++;
        });

        res.send(categories);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch pie chart data' });
    }
});
app.get('/api/combined', async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000`).getMonth();

    try {
        const statisticsPromise = ProductTransaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) }
        }).then(transactions => {
            const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
            const soldItems = transactions.filter(transaction => transaction.sold).length;
            const notSoldItems = transactions.filter(transaction => !transaction.sold).length;

            return { totalSaleAmount, soldItems, notSoldItems };
        });

        const barChartPromise = ProductTransaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) }
        }).then(transactions => {
            const priceRanges = {
                '0-100': 0,
                '101-200': 0,
                '201-300': 0,
                '301-400': 0,
                '401-500': 0,
                '501-600': 0,
                '601-700': 0,
                '701-800': 0,
                '801-900': 0,
                '901-above': 0
            };

            transactions.forEach(transaction => {
                if (transaction.price <= 100) priceRanges['0-100']++;
                else if (transaction.price <= 200) priceRanges['101-200']++;
                else if (transaction.price <= 300) priceRanges['201-300']++;
                else if (transaction.price <= 400) priceRanges['301-400']++;
                else if (transaction.price <= 500) priceRanges['401-500']++;
                else if (transaction.price <= 600) priceRanges['501-600']++;
                else if (transaction.price <= 700) priceRanges['601-700']++;
                else if (transaction.price <= 800) priceRanges['701-800']++;
                else if (transaction.price <= 900) priceRanges['801-900']++;
                else priceRanges['901-above']++;
            });

            return priceRanges;
        });

        const pieChartPromise = ProductTransaction.find({
            dateOfSale: { $gte: new Date(2000, monthNumber, 1), $lt: new Date(2000, monthNumber + 1, 1) }
        }).then(transactions => {
            const categories = {};

            transactions.forEach(transaction => {
                if (!categories[transaction.category]) {
                    categories[transaction.category] = 0;
                }
                categories[transaction.category]++;
            });

            return categories;
        });

        const [statistics, barChart, pieChart] = await Promise.all([statisticsPromise, barChartPromise, pieChartPromise]);

        res.send({ statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch combined data' });
    }
});
