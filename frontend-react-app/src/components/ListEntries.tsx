import React, { useState } from 'react';
import './ListEntries.css';
import { Entry } from './types';

function formatDate(date: Date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // returns zero based index of month, adds to bc zero based index, convers to string, adds leading zero if necessary
    const day = date.getDate().toString().padStart(2, '0'); // returns day, adds leading zero if neccessary
    const year = date.getFullYear(); // returns year, four digits

    return `${month}/${day}/${year}`;
}

function ListEntries({ entries } : {entries : Entry[]}) {

    return (
        <div className='list-entries-main-container'>
            <div className='list-entries-sub-container'>

                <div className='column-titles'>
                    <div className='date-column'>Date</div>
                    <div className='amount-column'>Amount</div>
                    <div className='description-column'>Description</div>
                    <div className='category-column'>Category</div>

                </div>
                <hr className="entry-list-divider"/>

                {entries.map((entry_item, index) => (
                    <div key={index} className='entry-row-container'>
                        <div className='date-column'>{formatDate(entry_item.date)}</div>
                        <div className='amount-column'>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry_item.amount)}
                        </div>
                        <div className='description-column'>{entry_item.description}</div>
                        <div className='category-column'>{entry_item.category}</div>
                    </div>
                ))}

            </div>
            
        </div>
    );
}

export default ListEntries;