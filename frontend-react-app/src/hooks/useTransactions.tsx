import { useState, useEffect } from 'react';
import axios from 'axios';
import { Entry, TransactionEntryFormData } from '../types';

interface useTransactionsArgs {
    newTransactionEntryFormData: TransactionEntryFormData,
    setNewTransactionEntryFormData: React.Dispatch<React.SetStateAction<TransactionEntryFormData>>,
    setShowAddTransactionPopup: React.Dispatch<React.SetStateAction<boolean>>,
    month: number,
    year: number
}

interface MonthYearTransactionTypes {
    monthYear: string;
    transactions: Entry[];
}

const useTransactions = ({newTransactionEntryFormData, setNewTransactionEntryFormData, setShowAddTransactionPopup, month, year} : useTransactionsArgs) => {

    // transaction list per month and year key
    const [transactionsByMonthYear, setTransactionsByMonthYear] = useState<{ [monthYear: string]: Entry[] }>({});
    const transactionsKey = `${String(month).padStart(2, '0')}/${year}`;
    const currentTransactions = transactionsByMonthYear[transactionsKey] || []; // transactions for selected month and year, if key doesnt exist then transactions will be empty array [] 

    const addTransaction = async (monthYear: string, transaction: Omit<Entry, 'id'>) => {
        try {
            const response = await axios.post("http://localhost:5001/api/transactions/add", {
                monthYear,
                transaction
            });
            return response.data;
        } catch (error) {
            console.error("Error saving transactions:", error);
        }
    };

    const removeTransaction = async (monthYear: string, transactionID: string) => {
        try {
            const response = await axios.post("http://localhost:5001/api/transactions/remove", {
                monthYear,
                transactionID
            });
            console.log("Transactions saved:", response.data);
        } catch (error) {
            console.error("Error saving transactions:", error);
        }
    };

    // adds new transaction entry to array transactionsByMonthYear
    const handleAddTransaction = async () => {

        // if user does not select a day then alert user and do not exit out of popup
        if (!newTransactionEntryFormData.day) {
            alert("Please select a valid day.");
            return;
        }
        
        const newTransaction: Omit<Entry, 'id'> = {
            description: newTransactionEntryFormData.description,
            amount: parseFloat(newTransactionEntryFormData.amount.replace(/[^0-9.]/g, '')), // convert amount string to float value
            date: new Date(`${year}-${String(month).padStart(2, '0')}-${String(newTransactionEntryFormData.day).padStart(2, '0')}T00:00:00`), // convert date string to date object
            category: newTransactionEntryFormData.category,
        };

        const addedTransaction = await addTransaction(transactionsKey, newTransaction);
        const addedTransactionId = addedTransaction._id.toString();

        setTransactionsByMonthYear(prevState => ({
            ...prevState,
            [transactionsKey]: [...currentTransactions, {...newTransaction, id: addedTransactionId}] 
        }));

        setNewTransactionEntryFormData({ day: '', amount: '', description: '', category: '' }); // reset new entry data
        setShowAddTransactionPopup(false); // close popup
    }

    // removes entry with id from current transactions for specific month and year
    const handleRemoveTransaction = (id: string) => {
        // remove transaction with passed in id
        const updatedTransactions = currentTransactions.filter(transaction => transaction.id !== id);
        // update current transactions array
        setTransactionsByMonthYear(prevState => ({
            ...prevState,
            [transactionsKey]: updatedTransactions,
        }));

        removeTransaction(transactionsKey, id);
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/transactions");
                const responseMonthYearTransactions = response.data;

                const loadedMonthYearTransactions: { [monthYear: string]: Entry[] } = {};
                responseMonthYearTransactions.forEach((monthYearKeyTransactions: MonthYearTransactionTypes) => {
                    const monthYearKey = monthYearKeyTransactions.monthYear;
                    const totalTransactions = monthYearKeyTransactions.transactions;
                    
                    // Convert string dates to Date objects
                    const transactionEntries: Entry[] = totalTransactions.map((transaction: any) => ({
                        id: transaction._id.toString(),
                        description: transaction.description,
                        amount: transaction.amount,
                        date: new Date(transaction.date),
                        category: transaction.category,
                    }));

                    loadedMonthYearTransactions[monthYearKey] = transactionEntries;;
                })

                
                setTransactionsByMonthYear(loadedMonthYearTransactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    return {transactionsByMonthYear, currentTransactions, handleRemoveTransaction, handleAddTransaction}
}

export default useTransactions;