import React, { useState, useEffect } from 'react';
import './AddTransactionPopup.css';
import { TransactionEntryFormData } from '../types';

function AddTransactionPopup( {showAddTransactionPopup, setShowAddTransactionPopup, newTransactionEntryFormData, setNewTransactionEntryFormData, plannedAmountPerCategory, setPlannedAmountPerCategory, handleAddTransaction, updatePlannedAmountForCategory, month, year} : {
    showAddTransactionPopup: boolean, // state variable to show/hide add transaction popup
    setShowAddTransactionPopup: React.Dispatch<React.SetStateAction<boolean>>, // state updater function for showAddTransactionPopup
    newTransactionEntryFormData: TransactionEntryFormData, // state variable that holds all information regarding new transaction
    setNewTransactionEntryFormData: React.Dispatch<React.SetStateAction<TransactionEntryFormData>>, // state updater function for newTransactionEntryFormData
    plannedAmountPerCategory: { [monthYear: string]: { [category: string]: number } }, // state variable / object that holds the planned amounts for each category per month/year 
    setPlannedAmountPerCategory: React.Dispatch<React.SetStateAction<{ [monthYear: string]: { [category: string]: number } }>>, // state updater for plannedAmountPerCategory
    handleAddTransaction: () => void, // adds a new transaction to transactions object 
    updatePlannedAmountForCategory: (category: string, plannedAmount: string) => void, // this updates the local plannedAmountPerCategory and also the backend
    month: number, // current month
    year: number})  // current year
    {

    // returns the number of days in the currently selected month
    const getNumDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate(); // 0 means last day of previous month, .getDate() returns day of the month
    };

    const numDaysInMonth = getNumDaysInMonth(month, year);  // number of days in currently selected month
    const monthDayOptions = Array.from({ length: numDaysInMonth }, (_, index) => index + 1); // shallow copy array with length of numDaysInMonth, getting all days in current month using index values
    const transactionsKey = `${String(month).padStart(2, '0')}/${year}`; // key to access transactions for specific month/year key

    // turns numeric value into currency format
    const formatAmount = (amount: string) => {
        const numericAmount = Number(amount); // converts amount string to numeric value

        if (isNaN(numericAmount)) { // if not a number
            return amount; // return original string that was passed in
        } else { // if a number
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericAmount); // return currency format
        }
    };

    // sets the current amount in the new transaction form upon change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amountValue = e.target.value;
        const regex = /^\d*\.?\d*$/; // allow numbers and single decimal point
        if (regex.test(amountValue)) {
            setNewTransactionEntryFormData({ ...newTransactionEntryFormData, amount: amountValue }); // update amount
        }
    };

    // formats amount in currency format when user leaves input box
    const handleAmountBlur = () => {
        const formattedAmount = formatAmount(newTransactionEntryFormData.amount);
        setNewTransactionEntryFormData({ ...newTransactionEntryFormData, amount: formattedAmount });
    };

    const handleAmountFocus = () => {
        const numericAmount = Number(newTransactionEntryFormData.amount.replace(/[^0-9.]/g, '')); // remove all non-numeric characters and then converts string to number
        // checks whether numericAmount is NaN, if valid number then sets this as new amount
        if (!isNaN(numericAmount)) {
            setNewTransactionEntryFormData({ ...newTransactionEntryFormData, amount: String(numericAmount) });
        }
    };

    // if transaction is canceled, reinitize all input form values
    const handleCancelTransaction = () => {
        setNewTransactionEntryFormData({ day: '', amount: '', description: '', category: '' });
        setShowAddTransactionPopup(false);
    }

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
            updatePlannedAmountForCategory(newCategory, String(0)); // update backend
            setNewCategory('') // reset new category state
            setShowAddCategoryInput(false); // hide new category input and submit buttons
        }
    };

    return (
        <>
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
        </>
    )
}

export default AddTransactionPopup;
