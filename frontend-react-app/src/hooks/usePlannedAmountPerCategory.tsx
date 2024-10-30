import { useState, useEffect } from 'react';
import axios from 'axios';

interface PlannedAmount {
    category: string;
    amount: number;
}

interface MonthYearAmountCategoryTypes {
    monthYear: string,
    plannedAmounts: PlannedAmount[]
}

const usePlannedAmountPerCategory = ({transactionsKey} : {transactionsKey: string}) => {

    // planned amount per category for each month and year
    const [plannedAmountPerCategory, setPlannedAmountPerCategory] = useState<{ [monthYear: string]: { [category: string]: number } }>({
        '10/2024': {}
    });

    // update a planned amount associated with category
    const updatePlannedAmountForCategory = (category: string, plannedAmountValue: string) => {
        const regex = /^\d*\.?\d*$/; // allows numbers and optional decimal point
        if (regex.test(plannedAmountValue)) { // test the planned amount string
            const numPlannedAmount = Number(plannedAmountValue); // convert to number
            setPlannedAmountPerCategory(prevAmounts => ({
                ...prevAmounts,
                [transactionsKey]: { // current month/year key
                    ...prevAmounts[transactionsKey],
                    [category]: numPlannedAmount // add new amount to specified category
                }
            }));
            updatePlannedAmountPerCategory(transactionsKey, category, numPlannedAmount);
        }

    };

    const updatePlannedAmountPerCategory = async (monthYear: string, category: string, newAmount: number) => {
        try {
            const response = await axios.post("http://localhost:5001/api/categories/update", {
                monthYear,
                category,
                newAmount
            });
            return response.data;
        } catch (error) {
            console.error("Error saving planned amouts:", error);
        }
    };

    useEffect(() => {
        const fetchPlannedAmountPerCategory = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/categories");
                const reponseMonthYearPlannedAmountsCategory = response.data;

                const loadedMonthYearPlannedAmountsCategory: { [monthYear: string]: { [category: string]: number } } = {};
                reponseMonthYearPlannedAmountsCategory.forEach((monthYearKeyAmountCategories: MonthYearAmountCategoryTypes) => {
                    const monthYearKey = monthYearKeyAmountCategories.monthYear;
                    const plannedAmounts = monthYearKeyAmountCategories.plannedAmounts;
                    
                    const loadedPlannedAmounts: { [category: string]: number } = {};
                    plannedAmounts.forEach((plannedAmount: PlannedAmount) => {
                        loadedPlannedAmounts[plannedAmount.category] = plannedAmount.amount;
                    });

                    loadedMonthYearPlannedAmountsCategory[monthYearKey] = loadedPlannedAmounts;
                })


                setPlannedAmountPerCategory(loadedMonthYearPlannedAmountsCategory);
                
            } catch (error) {
                console.error("Error fetching planned amounts per category:", error);
            }
        };

        fetchPlannedAmountPerCategory();
    }, []);

    return {plannedAmountPerCategory, updatePlannedAmountForCategory, setPlannedAmountPerCategory}
}

export default usePlannedAmountPerCategory;