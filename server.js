const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDb = require('./config/connectDb')
//config dot env file
dotenv.config();

//database Call
connectDb();

//Rest object 
const app = express();

// middlewares 
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

//routes
//user Routes
app.use('/api/v1/users', require('./routes/userRoute'))

//transaction Routes
app.use('/api/v1/transactions',require('./routes/transactionRoutes'));

//ports
const PORT = 8000 || process.env.PORT

//listen server
app.listen(PORT, () =>{
    console.log(`Server running on PORT ${PORT}`)
});