import mongoose, { Schema, Document, model } from 'mongoose';

// schema for an array of transactions per month-year
const monthYearPlannedAmountCategoriesSchema = new Schema({
    monthYear: { type: String, required: true },
    plannedAmounts: [{
        category: {
            type: String,
            required: true,
            unique: false
        },
        amount: {
            type: Number,
            default: 0
        }
    }]
});

const planned_amount_per_categories = mongoose.model('planned_amount_per_categories', monthYearPlannedAmountCategoriesSchema);
export default planned_amount_per_categories;