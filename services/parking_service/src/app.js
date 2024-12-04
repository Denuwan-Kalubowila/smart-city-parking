const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const parkingRouter = require('../src/routes/route');


const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors())

app.get('/health', (req, res) => {
    res.send('Hello World!');
})
app.use("/api/v1/parking",parkingRouter);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    
}).catch((error)=>{
    console.log(error);
})



