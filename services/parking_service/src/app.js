const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connect } = require('mongoose');
const connectDB = require('./config/database');
const e = require('express');


const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors())

app.get('/health', (req, res) => {
    res.send('Hello World!');
})

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    
}).catch((error)=>{
    console.log(error);
})



