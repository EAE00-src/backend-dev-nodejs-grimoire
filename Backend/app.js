const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
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
    console.log('✅ Connection to MongoDB Atlus successeful!');
}).catch((error) =>{
    console.error(`❌ Connection failed: ${error}`);
});

app.use(express.json());




module.exports = app;