import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Expenses.css';
import { TransactionEntryFormData } from '../types';
import ListEntries from './ListEntries';
import SummaryEntries from './SummaryEntries';
import AddTransactionPopup from './AddTransactionPopup';
import useTransactions from '../hooks/useTransactions';
import usePlannedAmountPerCategory from '../hooks/usePlannedAmountPerCategory';

function Expenses() {

    const [showAddTransactionPopup, setShowAddTransactionPopup] = useState(false); // toggle add transaction popup
    const [selectedMonthYear, setSelectedMonthYear] = useState<[number, number]>([10, 2024]); // current user selected month and year, initialized to 10/2024
    const [month, year] = selectedMonthYear; // array of current user selected month and year
    const transactionsKey = `${String(month).padStart(2, '0')}/${year}`; // key to access transactions array for current month and year in form month/year

    // form information to enter new transaction, initialized to all emtpy states
    const [newTransactionEntryFormData, setNewTransactionEntryFormData] = useState<TransactionEntryFormData>({ 
        day: '',
        amount: '',
        description: '',
        category: '',
    });

    const {plannedAmountPerCategory, updatePlannedAmountForCategory, setPlannedAmountPerCategory} = usePlannedAmountPerCategory({transactionsKey}); // custom hook to update planned amount per category array
    const {transactionsByMonthYear, currentTransactions, handleRemoveTransaction, handleAddTransaction} = useTransactions( {newTransactionEntryFormData, setNewTransactionEntryFormData, setShowAddTransactionPopup, month, year} ); // custom hook to update transactions array
    
    // change current month and year selection from dropdown selection
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [newMonth, newYear] = event.target.value.split('/').map(Number); // split month/year and change to numbers rather than strings
        setSelectedMonthYear([newMonth, newYear]);
    };

    // get all keys and sort based on both month and year
    // sort() takes comparison function, parameters are two objects being compared in array (month-year keys here)
    // this is used for the month selection dropdown so that it is in chronological order
    const totalMonthYearKeysSorted = Object.keys(transactionsByMonthYear).sort((keyA, keyB) => {
        const [monthA, yearA] = keyA.split('/').map(Number) // grab specific month and year for this key and convert to numerical values
        const [monthB, yearB] = keyB.split('/').map(Number)

        // if we are within same year
        if (yearA === yearB) {
            // compare and sort the months within that year
            return monthA - monthB;
        // if we are on different years
        } else {
            // compare and sort based on year not month
            return yearA - yearB;
        }
    })

    // toggle popup to add transaction
    const toggleAddTransactionPopup = () => {
        setShowAddTransactionPopup(!showAddTransactionPopup);
    };


    return (
        <div className='expenses-page-container'>

            <div className='title-container'>

                <div className='expenses-title'>Expenses</div>

                {/* choose month/year */}
                <select 
                    className='month-dropdown' 
                    value={`${String(month).padStart(2, '0')}/${year}`} 
                    onChange={handleMonthYearChange}>
                    {totalMonthYearKeysSorted.map((monthYearKey) => (
                        <option key={monthYearKey} value={monthYearKey}>
                        {monthYearKey}
                        </option>
                    ))}
                </select>

            </div>

            <div className='transactions-summary-container'> 

                <div className='transactions-container'>

                    <div className='transactions-title-button-container'>
                        <div className='transactions-title'>Transactions</div>
                        <button className='add-entry-button' onClick={toggleAddTransactionPopup}>
                            +
                        </button>
                    </div>
                    
                    <div className='list-entries-container'>
                        {/* lists all current transaction entries for current month/year and option to remove transaction entry */}
                        <ListEntries entries={currentTransactions} removeEntry={handleRemoveTransaction}/>
                    </div>
                </div>

                <div className='summary-container'>

                    <div className='summary-title-container'>
                        <div className='summary-title'>Summary</div>
                    </div>

                    <div className='summary-entries-container'>
                        {/* gives summary statistics on current transactions for month/year */}
                        <SummaryEntries 
                            entries={currentTransactions} 
                            plannedAmounts={plannedAmountPerCategory[transactionsKey]} 
                            updatePlannedAmount={updatePlannedAmountForCategory}
                        />
                    </div>
                </div>
            
                <div>
                    {/* popup functionality to add new transaction */}
                    <AddTransactionPopup 
                        showAddTransactionPopup={showAddTransactionPopup}
                        setShowAddTransactionPopup={setShowAddTransactionPopup}
                        newTransactionEntryFormData={newTransactionEntryFormData}
                        setNewTransactionEntryFormData={setNewTransactionEntryFormData}
                        plannedAmountPerCategory={plannedAmountPerCategory}
                        setPlannedAmountPerCategory={setPlannedAmountPerCategory}
                        handleAddTransaction={handleAddTransaction}
                        updatePlannedAmountForCategory={updatePlannedAmountForCategory}
                        month={month}
                        year={year}/>
                </div>

            </div>
            
        </div>
    );
};

export default Expenses;