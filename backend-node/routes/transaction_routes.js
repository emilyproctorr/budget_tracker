// purpose: defines API routes for handling requests related to transactions

import express from 'express';
import month_year_transactions from '../models/transactions.js'; 
import mongoose from 'mongoose';

const router = express.Router();

// post endpoint to add transactions
router.post('/add', async (req, res) => {
    try {
        const { monthYear, transaction } = req.body;

        console.log("transaction", transaction);

        let monthYearTransaction = await month_year_transactions.findOne({ monthYear });

        if (monthYearTransaction) {
            monthYearTransaction.transactions.push(transaction);
            await monthYearTransaction.save();
            console.log(monthYearTransaction.transactions);
            const addedTransaction = monthYearTransaction.transactions.slice(-1)[0];
            console.log(addedTransaction);
            res.status(201).json(addedTransaction);
        } else {
            // If it doesn't exist, create a new document
            const transactionArray = [transaction];
            const newMonthYearTransaction = new month_year_transactions({ monthYear, transactionArray });
            await newMonthYearTransaction.save();
            res.status(201).json(transaction);
        }

        
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: 'Error saving transactions', error: error.message });
    }
});

router.post('/remove', async (req, res) => {
    try {
        const { monthYear, transactionID } = req.body;

        let monthYearTransaction = await month_year_transactions.findOneAndUpdate(
            { monthYear }, 
            { $pull: { transactions: { _id: transactionID } } }, // use $pull to remove the transaction by _id
            { new: true } // return the updated document after removing entry
        );

        if (monthYearTransaction) {
            res.status(200).json(monthYearTransaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }

        
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: 'Error removing transactions', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const transactions = await month_year_transactions.find();
        res.status(200).json(transactions); // send to frontend
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
});

export default router;