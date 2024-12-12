import express from 'express';
import planned_amount_per_categories from '../models/categories.js'; 

const router = express.Router();

router.post("/update", async (req, res) => {
    try {
        const { monthYear, category, newAmount } = req.body;

        // check if document (row or entry) already exists
        let monthYearPlannedAmountCategory = await planned_amount_per_categories.findOne({ monthYear });

        // if the month/year key already exists
        if (monthYearPlannedAmountCategory) {
            
            // check if the category exists or not
            const categoryExists = monthYearPlannedAmountCategory.plannedAmounts.find(
                (item) => item.category === category
            );

            // if category does exist
            if (categoryExists) {
                // update that category value with new category using $set
                await planned_amount_per_categories.updateOne(
                    { monthYear, "plannedAmounts.category": category },
                    { $set: { "plannedAmounts.$.amount": newAmount } }
                );
            // if category does not exist
            } else {
                // use $push to add a new category with inital amount value
                await planned_amount_per_categories.updateOne(
                    { monthYear },
                    { $push: { plannedAmounts: { category, amount: newAmount } } }
                );
            }

            // save collection
            await monthYearPlannedAmountCategory.save();
            res.status(201).json(planned_amount_per_categories);
        }

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: 'Error saving', error: error.message });
    }
})

router.get('/', async (req, res) => {
    try {
        const monthYearPlannedAmountCategory = await planned_amount_per_categories.find();
        res.status(200).json(monthYearPlannedAmountCategory); // send to frontend
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
});

export default router;