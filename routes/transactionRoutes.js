const express = require('express')
const { addTransaction, getAllTransaction, editTransaction,deleteTransaction } = require('../controllers/transactionCtrl')


//router object
const router = express.Router()

//routes


//add Transaction POST model
router.post('/add-transaction',addTransaction);

//edit Transactions
router.post("/edit-transaction", editTransaction);

//delete Transactions
router.post("/delete-transaction", deleteTransaction);

//get Transactions
router.post("/get-transaction",getAllTransaction);



module.exports = router;