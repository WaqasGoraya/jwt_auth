const env = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const userRoutes = require('./routes/api/userRoutes');
const app = express();
const port = process.env.port || 8000;
const DB_URL = process.env.DB_URL;



//Config Json
app.use(express.json());

//
// app.use(express.urlencoded({extended:false}));

//DB Connection
connectDB(DB_URL);

//Routes
app.use('/api/user',userRoutes);

app.listen(port,()=> {
    console.log(`http://localhost:${port}`)
});