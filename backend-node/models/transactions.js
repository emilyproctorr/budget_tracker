import mongoose, { Schema, Document, model } from 'mongoose';

// mongoose info
    // schema: structure of documents in a mongodb collection
    // document: instance of schema, single record in mongodb collection that adheres to structure defined by schema
    // model: compiled version of schema, way to interact with mongodb through mongoose

// schema for individual transaction
const transactionSchema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true }
});

// schema for an array of transactions per month-year
const monthYearTransactionsSchema = new Schema({
    monthYear: { type: String, required: true, unique: true },
    transactions: [transactionSchema]
});

const month_year_transactions = mongoose.model('month_year_transactions', monthYearTransactionsSchema);
export default month_year_transactions;
