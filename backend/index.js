import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";

import mainRouter from './routes/main.router.js';


const app = express();
const port = process.env.PORT;
const DB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json());


const main = async () => {
    const connectDb = await mongoose.connect(DB_URL);
}

main()
    .then(() => {
        console.log("MongoDb Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    });


app.use("/", mainRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});