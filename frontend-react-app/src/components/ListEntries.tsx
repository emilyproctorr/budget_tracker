import React, { useState } from 'react';
import './ListEntries.css';
import { Entry } from './types';

function ListEntries({ entries, removeEntry } : {entries : Entry[], removeEntry: (id: number) => void}) {

    // format date to month/day/year format
    const formatDate = (date: Date): string => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    return (
        <div className='list-entries-main-container'>
            <div className='list-entries-sub-container'>

                <div className='column-titles'>
                    <div className='date-column'>Date</div>
                    <div className='amount-column'>Amount</div>
                    <div className='description-column'>Description</div>
                    <div className='category-column'>Category</div>
                    <div className='remove-entry-column'></div>

                </div>
                <hr className="entry-list-divider"/>

                {/* list each entry and associated information */}
                {entries.map((entry_item, index) => (
                    <div key={index} className='entry-row-container'>
                        <div className='date-column'>{formatDate(entry_item.date)}</div>
                        <div className='amount-column'>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry_item.amount)} 
                        </div>
                        <div className='description-column'>{entry_item.description}</div>
                        <div className='category-column'>{entry_item.category}</div>
                        <div className='remove-entry-column'>
                            {/* remove entry complete from entries array */}
                            <button className='remove-entry-button' onClick={() => removeEntry(entry_item.id)}>
                                <svg className="remove-entry-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 10 10">
                                  <path fill="currentColor" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                                </svg>
                              </button>
                        </div>
                    </div>
                ))}

            </div>
            
        </div>
    );
}

export default ListEntries;