// purpose: main entry point of express application

import express from "express";
import { config } from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import transaction_routes from './routes/transaction_routes.js';
import category_routes from './routes/category_routes.js';

config();

// middleware
const app = express();
const PORT = process.env.PORT;

// connect to db
connectDB();

// parse json and url-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/transactions', transaction_routes);
app.use('/api/categories', category_routes);
 
app.get("/", (request, response) => {
  response.send({ message: "API is live" });
});
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});