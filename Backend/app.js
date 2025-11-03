const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mongoSrv = process.env.MONGO_SRV;

//Start of the creation of Express app
const app = express();

//Cross-Origin Resource Sharing set to accept all origins and HTTP methods aand Headers
app.use(cors());
//MongoDB Atlus connection & status
mongoose.connect(mongoSrv).then(() => {
    console.log('✅ Connection to MongoDB Atlus successeful!');
}).catch((error) =>{
    console.error(`❌ Connection failed: ${error}`);
});

app.use(express.json());




module.exports = app;