const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
//dotenv installation is necessary for reading/process .env variables
require('dotenv').config();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const mongoSrv = process.env.MONGO_SRV;
//mongoUri determines whether to use developer credentials or user credentials
    //...when connecting to MongoDB Atlus
const mongoUri = process.env.MONGO_NODE_ENV === 'public' ? process.env.MONGO_URI_PUB : mongoSrv;

//Start of the creation of Express app
const app = express();


//Cross-Origin Resource Sharing set to accept all origins and HTTP methods aand Headers
app.use(cors());

//MongoDB Atlus connection & status
mongoose.connect(mongoUri).then(() => {
    console.log('✅ Connection to MongoDB Atlus successful!');
}).catch((error) =>{
    console.error(`❌ Connection failed: ${error}`);
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;