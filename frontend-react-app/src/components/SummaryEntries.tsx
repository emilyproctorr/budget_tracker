import React, { useState, useEffect } from 'react';
import './SummaryEntries.css';
import { Entry } from '../types';

function SummaryEntries({ entries, plannedAmounts, updatePlannedAmount } : { 
    entries: Entry[], 
    plannedAmounts: { [category: string]: number }, 
    updatePlannedAmount: (category: string, value: string) => void}) {

    // add up all amounts per category to find how much user has spent for that category in month/year key
    const findActualAmount = (entries: Entry[]) => {
        // "category": amount spent that month/year
        const actualAmounts: { [category: string]: number } = {};

        // sum all transaction amounts for each category
        entries.forEach(entry => {
            // if category alread exists
            if (actualAmounts[entry.category]) {
                // add to that category total amount spent
                actualAmounts[entry.category] += entry.amount;
            // if category does not exist yet
            } else {
                // initialize to this entries amount spent
                actualAmounts[entry.category] = entry.amount;
            }
        });

        return actualAmounts;
    };

    // total amount spent per category
    const actualAmounts = findActualAmount(entries);

    // initialize formatting for planned amounts upon user entry into webpage
    const initializeLocalPlannedAmounts = () => {
        const formattedAmounts: { [category: string]: string } = {}; 
    
        // check if plannedAmounts is empty
        if (Object.keys(plannedAmounts).length === 0) {
            return formattedAmounts;
        }

        // format each amount to appear as currency 
        Object.entries(plannedAmounts).forEach(([category, amount]) => {
            formattedAmounts[category] = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        });
        return formattedAmounts;
    };

    const [localPlannedAmounts, setLocalPlannedAmounts] = useState<{ [category: string]: string }>(initializeLocalPlannedAmounts()); // local state array of planned amounts, kept for formatting

    // when user enters input box, want to remove currency formatting
    const handleFocus = (category: string, amount: number) => {
        setLocalPlannedAmounts((prev) => ({ ...prev, [category]: amount.toString() }));
    };

    // when user exits input box, want to format amount value as currency value
    const handleBlur = (category: string) => {
        const amount = parseFloat(localPlannedAmounts[category]); // convert planned amount for specified category to floating point value
        if (!isNaN(amount)) { // check if number
            setLocalPlannedAmounts((prev) => ({ ...prev, [category]: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) })); // format as currency
        }
    };

    return (
        <div className='summary-entries-main-container'>
            <div className='summary-entries-sub-container'>

                <div className='column-titles'>
                    <div className='summary-category-column'>Category</div>
                    <div className='planned-amount-column'>Planned Amount</div>
                    <div className='actual-amount-column'>Actual Amount</div>
                    <div className='difference-column'>Difference</div>

                </div>
                <hr className="entry-list-divider"/>

                {/* list each category, planned amount spent, actual amount spent, and difference of these two values */}
                {Object.entries(plannedAmounts).map(([category, plannedAmount]) => {

                    const actualAmount = actualAmounts[category] || 0; // actual amount spent for that category
                    const difference = plannedAmount - actualAmount; // find difference between planned and actual

                    return (
                        <div key={category} className='category-row-container'>
                            <div className='summary-category-column'>{category}</div>
                            <div className='planned-amount-column'>
                                    <input
                                        className='planned-amount-input-box'
                                        type="text"
                                        placeholder="Amount"
                                        value={localPlannedAmounts[category] || plannedAmount.toString()} 
                                        onFocus={() => handleFocus(category, plannedAmount)} // formatting when user enters input box
                                        onBlur={() => handleBlur(category)} // formatting when user exits input box
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9.]/g, ''); // allow only numbers and decimal point
                                            setLocalPlannedAmounts((prev) => ({ ...prev, [category]: value })); // update local state
                                            updatePlannedAmount(category, value); // update planned amount in parent
                                        }} 
                                    />
                            </div>
                            <div className='actual-amount-column'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(actualAmount)}</div>
                            <div className='difference-column'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(difference)}</div>
                        </div>
                    )
                })}

            </div>
            
        </div>
    );
}

export default SummaryEntries;