import React, { useState, useEffect } from 'react';
import './Expenses.css';
import { Entry } from './types';
import ListEntries from './ListEntries';
import SummaryEntries from './SummaryEntries';

function Expenses() {

    // ********************* ADD TRANSACTION POPUP ********************* //

    const [showAddTransactionPopup, setShowAddTransactionPopup] = useState(false); // toggle add transaction popup

    // toggle popup to add transaction
    const toggleAddTransactionPopup = () => {
        setShowAddTransactionPopup(!showAddTransactionPopup);
      };

    // form information to enter new transaction
    const [newTransactionEntryFormData, setNewTransactionEntryFormData] = useState({ 
        day: '',
        amount: '',
        description: '',
        category: '',
    });

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
            setNewTransactionEntryFormData({ ...newTransactionEntryFormData, amount: amountValue });
        }
    };

    const handleAmountBlur = () => {
        const formattedAmount = formatAmount(newTransactionEntryFormData.amount);
        setNewTransactionEntryFormData({ ...newTransactionEntryFormData, amount: formattedAmount });
    };

    const handleAmountFocus = () => {
        const numericAmount = parseFloat(newTransactionEntryFormData.amount.replace(/[^0-9.]/g, '')); // remove all non-numeric characters and then parseFloat() converts string to floating point number
        // checks whether numericAmount is NaN, if valid number then sets this as new amount
        if (!isNaN(numericAmount)) {
            setNewTransactionEntryFormData({ ...newTransactionEntryFormData, amount: String(numericAmount) });
        }
    };

    const handleCancelTransaction = () => {
        setNewTransactionEntryFormData({ day: '', amount: '', description: '', category: '' });
        setShowAddTransactionPopup(false);
    }

    // ********************* MONTH/YEAR, TRANSACTIONS ********************* //

    // transaction list per month and year key
    const [transactionsByMonthYear, setTransactionsByMonthYear] = useState<{ [monthYear: string]: Entry[] }>({
        '10/2024': [
          { id: 1, description: "Rent", amount: 1200, date: new Date("2024-10-01"), category: "Rent" } as Entry,
          { id: 2, description: "Walmart", amount: 150, date: new Date("2024-10-02"), category: "Groceries" } as Entry,
          { id: 3, description: "Car Payment", amount: 300, date: new Date("2024-10-03"), category: "Car Payment" } as Entry
        ],
        '09/2024': [
          { id: 4, description: "Shopping", amount: 1200, date: new Date("2024-09-10"), category: "Extra" } as Entry
        ]
        ,
        '11/2024': [
          { id: 5, description: "Internet", amount: 100, date: new Date("2024-11-10"), category: "Utilities" } as Entry
        ]
      });

    const [selectedMonthYear, setSelectedMonthYear] = useState<[number, number]>([10, 2024]); // current user selected month and year, initialized to 10/2024
    const [month, year] = selectedMonthYear; // array of current user selected month and year
    const transactionsKey = `${String(month).padStart(2, '0')}/${year}`; // key to access transactions array for current month and year in form month/year
    const currentTransactions = transactionsByMonthYear[transactionsKey] || []; // transactions for selected month and year, if key doesnt exist then transactions will be empty array [] 

    // adds new transaction entry to array transactionsByMonthYear
    const handleAddTransaction = () => {

        // if user does not select a day then alert user and do not exit out of popup
        if (!newTransactionEntryFormData.day) {
            alert("Please select a valid day.");
            return;
        }
        
        const newTransaction: Entry = {
            id: currentTransactions.length + 1, // generate new id based on current transactions array length
            description: newTransactionEntryFormData.description,
            amount: parseFloat(newTransactionEntryFormData.amount.replace(/[^0-9.]/g, '')), // convert amount string to float value
            date: new Date(`${year}-${String(month).padStart(2, '0')}-${String(newTransactionEntryFormData.day).padStart(2, '0')}T00:00:00`), // convert date string to date object
            category: newTransactionEntryFormData.category,
        };

        setTransactionsByMonthYear({
            ...transactionsByMonthYear, // spread the current state
            [transactionsKey]: [...currentTransactions, newTransaction], // add the new transaction to the array for this month/year
        });

        
        setNewTransactionEntryFormData({ day: '', amount: '', description: '', category: '' }); // reset new entry data
        setShowAddTransactionPopup(false); // close popup
    }

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

    // change current month and year selection from dropdown selection
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [newMonth, newYear] = event.target.value.split('/').map(Number); // split month/year and change to numbers rather than strings
        setSelectedMonthYear([newMonth, newYear]);
    };

    const getNumDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate(); // 0 means last day of previous month, .getDate() returns day of the month
    };

    const numDaysInMonth = getNumDaysInMonth(month, year); 
    const monthDayOptions = Array.from({ length: numDaysInMonth }, (_, index) => index + 1); // shallow copy array with length of numDaysInMonth, getting all days in current month using index values

    // removes entry with id from current transactions for specific month and year
    const handleRemoveEntry = (id: number) => {
        // remove transaction with passed in id
        const updatedTransactions = currentTransactions.filter(transaction => transaction.id !== id);
        // update current transactions array
        setTransactionsByMonthYear(prevState => ({
            ...prevState,
            [transactionsKey]: updatedTransactions,
        }));
    };

    // ********************* CATEGORY, PLANNED AMOUNTS ********************* //

    // planned amount per category for each month and year
    const [plannedAmountPerCategory, setPlannedAmountPerCategory] = useState<{ [monthYear: string]: { [category: string]: number } }>({
        '10/2024': {
            'Rent': 1000,
            'Groceries': 300,
            'Car Payment': 150,
        },
        '09/2024': {
            'Extra': 100,
        },
        '11/2024': {
            'Utilities': 100,
        }
    });

    const [showAddCategoryInput, setShowAddCategoryInput] = useState(false); // toggle input and submit button to add an new category
    const [newCategory, setNewCategory] = useState(''); // state to hold new category
    const categoriesAndPlannedAmountsForCurrentMonthYear = plannedAmountPerCategory[transactionsKey] || {}; // categories and associated planned amounts for current month/year
    const transactionCategories = Object.keys(categoriesAndPlannedAmountsForCurrentMonthYear); // current categories for month/year

    // add a new category
    const handleAddCategory = () => {
        if (newCategory.trim()) { // remove whitespace
            setPlannedAmountPerCategory(prevAmounts => ({
                ...prevAmounts,
                [transactionsKey]: { // current month/year key
                    ...prevAmounts[transactionsKey],
                    [newCategory]: 0 // initialze new category planned amount to be 0
                }
            }));
            setNewTransactionEntryFormData({ ...newTransactionEntryFormData, category: newCategory }); // show new cateogry as one current selected in category dropdown
            setNewCategory('') // reset new category state
            setShowAddCategoryInput(false); // hide new category input and submit buttons
        }
    };

    // update a planned amount associated with category
    const updatePlannedAmountForCategory = (category: string, plannedAmountValue: string) => {
        const regex = /^\d*\.?\d*$/; // allows numbers and optional decimal point
        if (regex.test(plannedAmountValue)) { // test the planned amount string
            const numPlannedAmount = Number(plannedAmountValue); // conver to number
            setPlannedAmountPerCategory(prevAmounts => ({
                ...prevAmounts,
                [transactionsKey]: { // current month/year key
                    ...prevAmounts[transactionsKey],
                    [category]: numPlannedAmount // add new amount to specified category
                }
            }));
        }
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
                        <ListEntries entries={currentTransactions} removeEntry={handleRemoveEntry}/>
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
            
                {/* popup functionality for when user would like to add transaction for month/year */}
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
                                            value={newTransactionEntryFormData.day} 
                                            onChange={(e) => setNewTransactionEntryFormData({ ...newTransactionEntryFormData, day: e.target.value })}
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
                                        value={newTransactionEntryFormData.amount}
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
                                        value={newTransactionEntryFormData.description}
                                        onChange={(e) => setNewTransactionEntryFormData({ ...newTransactionEntryFormData, description: e.target.value })}
                                    />
                                </div>

                                <div className='category-dropdown-add-container'>
                                    <div className='category-text-input-container'>
                                        <div className='category-text'>Category</div>
                                        <select
                                            className='category-dropdown'
                                            value={newTransactionEntryFormData.category}
                                            onChange={(e) => {
                                                if (e.target.value === "add-category") {
                                                    setShowAddCategoryInput(true); 
                                                } else {
                                                    setNewTransactionEntryFormData({ ...newTransactionEntryFormData, category: e.target.value });
                                                    setShowAddCategoryInput(false); 
                                                }
                                            }}
                                        >
                                                <option value="" disabled>Select a category</option>
                                                {transactionCategories.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                                <option disabled>──────────</option>
                                                <option value="add-category">Add Category</option>
                                        </select>
                                    </div>

                                    {/* input box and submit button for option to add new cateogry */}
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