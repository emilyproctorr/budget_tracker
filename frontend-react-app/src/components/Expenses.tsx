import React, { useState } from 'react';
import './Expenses.css';
import { Entry } from './types';
import ListEntries from './ListEntries';

function Expenses() {

    const [showAddTransactionPopup, setShowAddTransactionPopup] = useState(false); // toggle add transaction popup
    const [selectedMonthYear, setSelectedMonthYear] = useState<[number, number]>([10, 2024]); // current user selected month and year

    const [transactionCategories, setTransactionCategories] = useState<string[]>(['Food', 'Utilities']); // array of categories
    const [showAddCategoryInput, setShowAddCategoryInput] = useState(false); // state to toggle category input
    const [newCategory, setNewCategory] = useState('');
    
    const [month, year] = selectedMonthYear; // array of current user selected month and year
    const transactionsKey = `${String(month).padStart(2, '0')}/${year}`; // key to access transactions list for current month and year

    // form information to enter new transaction
    const [newEntryFormData, setNewEntryFormData] = useState({
        day: '',
        amount: '',
        description: '',
        category: '',
    });

    // transaction list per month and year key
    const [transactionsByMonthYear, setTransactionsByMonthYear] = useState<{ [key: string]: Entry[] }>({
        '10/2024': [
          { id: 1, description: "Rent", amount: 1200, date: new Date("2024-10-01"), category: "Rent" } as Entry,
          { id: 2, description: "Walmart", amount: 150, date: new Date("2024-10-02"), category: "Groceries" } as Entry,
          { id: 3, description: "Car Payment", amount: 300, date: new Date("2024-10-03"), category: "Car Payment" } as Entry
        ],
        '09/2024': [
          { id: 4, description: "Internet", amount: 100, date: new Date("2024-09-10"), category: "Utilities" } as Entry
        ]
        ,
        '11/2024': [
          { id: 5, description: "Internet", amount: 100, date: new Date("2024-09-10"), category: "Heyo" } as Entry
        ]
      });

    // transactions for selected month and year
    const currentTransactions = transactionsByMonthYear[transactionsKey] || []; // if key doesnt exist then transactions will be empty array [] 

    // get all keys and sort based on both month and year
    // sort() takes comparison function, parameters are two objects being compared in array (month-year keys here)
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

    // change current month and year selection
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [newMonth, newYear] = event.target.value.split('/').map(Number);
        setSelectedMonthYear([newMonth, newYear]); 
    };

    // adds new transaction entry to array
    const handleAddTransaction = () => {

        // if user does not select a day then alert user and do not exit out of popup
        if (!newEntryFormData.day) {
            alert("Please select a valid day.");
            return;
        }
        
        const newTransaction: Entry = {
            id: currentTransactions.length + 1, // generate new id based on current transactions array length
            description: newEntryFormData.description,
            amount: parseFloat(newEntryFormData.amount.replace(/[^0-9.]/g, '')),
            date: new Date(`${year}-${String(month).padStart(2, '0')}-${String(newEntryFormData.day).padStart(2, '0')}T00:00:00`),
            category: newEntryFormData.category,
        };

        setTransactionsByMonthYear({
            ...transactionsByMonthYear, // spread the current state
            [transactionsKey]: [...currentTransactions, newTransaction], // add the new transaction to the array for this month/year
        });

        console.log(currentTransactions);

        // reset new entry data
        setNewEntryFormData({ day: '', amount: '', description: '', category: '' });
        // close popup
        setShowAddTransactionPopup(false);
    }

    const getNumDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate(); // 0 means last day of previous month
    };

    const numDaysInMonth = getNumDaysInMonth(month, year);
    const monthDayOptions = Array.from({ length: numDaysInMonth }, (_, index) => index + 1);

    const formatAmount = (amount: string) => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) return amount;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericAmount);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amountValue = e.target.value;
        const regex = /^\d*\.?\d*$/; // allow numbers and single decimal point
        // console.log(typeof amountValue)
        if (regex.test(amountValue)) {
            setNewEntryFormData({ ...newEntryFormData, amount: amountValue });
        }
    };

    const handleAmountBlur = () => {
        const formattedAmount = formatAmount(newEntryFormData.amount);
        setNewEntryFormData({ ...newEntryFormData, amount: formattedAmount });
    };

    const handleAmountFocus = () => {
        const numericAmount = parseFloat(newEntryFormData.amount.replace(/[^0-9.]/g, '')); // remove all non-numeric characters and then parseFloat() converts string to floating point number
        // checks whether numericAmount is NaN, if valid number then sets this as new amount
        if (!isNaN(numericAmount)) {
            setNewEntryFormData({ ...newEntryFormData, amount: String(numericAmount) });
        }
    };

    const handleCancelTransaction = () => {
        setNewEntryFormData({ day: '', amount: '', description: '', category: '' });
        setShowAddTransactionPopup(false);
    }

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setTransactionCategories([...transactionCategories, newCategory]);
            setNewEntryFormData({ ...newEntryFormData, category: newCategory });
            setNewCategory('');
            setShowAddCategoryInput(false);
        }
    };

    const handleRemoveEntry = (id: number) => {
        // remove transaction with passed in id
        const updatedTransactions = currentTransactions.filter(transaction => transaction.id !== id);
        // update current transactions array
        setTransactionsByMonthYear(prevState => ({
            ...prevState,
            [transactionsKey]: updatedTransactions,
        }));
    };

    return (
        <div className='expenses-page-container'>

            <div className='title-container'>

                <div className='expenses-title'>Expenses</div>

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
                        <ListEntries entries={currentTransactions} removeEntry={handleRemoveEntry}/>
                    </div>
                </div>

                <div className='summary-container'>
                    <div className='summary-title'>Summary</div>
                </div>
            
                {showAddTransactionPopup && (
                    <div className='add-transaction-popup-outer-container'>
                        <div className='add-transaction-popup-box'>
                            <div className='add-transaction-popup-content'>
                                <div className='add-transaction-popup-title'>Add Transaction</div>

                                <div className='month-day-year-input-container'>
                                        
                                    <div className='month-text-input-container'>
                                        <div className='month-text'>Month</div>
                                        <input
                                            className='month-input-box'
                                            type="number"
                                            value={month}
                                            readOnly
                                        />
                                    </div>
                                        
                                    <div className='day-text-input-container'>
                                        <div className='day-text'>Day</div>
                                        <select 
                                            className='day-input-box'
                                            value={newEntryFormData.day} 
                                            onChange={(e) => setNewEntryFormData({ ...newEntryFormData, day: e.target.value })}
                                        >
                                                <option value="">Day</option>
                                                {monthDayOptions.map((day) => (
                                                    <option key={day} value={day}>
                                                        {day}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    
                                    <div className='year-text-input-container'>
                                        <div className='year-text'>Year</div>
                                        <input
                                            className='year-input-box'
                                            type="number"
                                            value={year}
                                            readOnly
                                        />
                                    </div>

                                </div>

                                <div className='amount-text-input-container'>
                                    <div className='amount-text'>Amount</div>
                                    <input
                                        className='amount-input-box'
                                        type="text"
                                        placeholder="Amount"
                                        value={newEntryFormData.amount}
                                        onChange={handleAmountChange}
                                        onBlur={handleAmountBlur} // format output when user leaves input 
                                        onFocus={handleAmountFocus} // removed formatting when user enters input
                                    />
                                </div>

                                <div className='description-text-input-container'>
                                    <div className='description-text'>Description</div>
                                    <textarea
                                        className='description-input-box'
                                        placeholder="Description"
                                        value={newEntryFormData.description}
                                        onChange={(e) => setNewEntryFormData({ ...newEntryFormData, description: e.target.value })}
                                    />
                                </div>

                                <div className='category-dropdown-add-container'>
                                    <div className='category-text-input-container'>
                                        <div className='category-text'>Category</div>
                                        <select
                                            className='category-dropdown'
                                            value={newEntryFormData.category}
                                            onChange={(e) => {
                                                if (e.target.value === "add-category") {
                                                    setShowAddCategoryInput(true); 
                                                } else {
                                                    setNewEntryFormData({ ...newEntryFormData, category: e.target.value });
                                                    setShowAddCategoryInput(false); 
                                                }
                                            }}
                                        >
                                            {transactionCategories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                            <option disabled>──────────</option>
                                            <option value="add-category">Add Category</option>
                                        </select>
                                    </div>

                                    {showAddCategoryInput && (
                                        <div className='add-category-outer-container'>
                                            <div className='add-category-container'>
                                                <div className='add-new-category-text'>Add New Category</div>
                                                <input
                                                    className='add-new-category-input'
                                                    type="text"
                                                    placeholder="New category"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                />
                                            </div>
                                            <div className='add-category-button-container'>
                                                <button onClick={handleAddCategory} className='add-category-button'>Submit</button>
                                            </div>
                                        </div>
                                    )}
                                    
                                </div>

                                <button className="submit-transaction-button" onClick={handleAddTransaction}>Submit Transaction</button>
                                <button className="cancel-transaction-button" onClick={handleCancelTransaction}>Cancel Transaction</button>

                            </div>
                        </div>
                    </div>
                )}

            </div>
            
        </div>
    );
};

export default Expenses;