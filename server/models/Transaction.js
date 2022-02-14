const mongoose = require('mongoose');
const DelCard = require('./DelegateCard')
const User = require('./User')

const transactionSchema = new mongoose.Schema({
    delegateCard:{
        type:mongoose.Types.ObjectId,
        ref:'DelCard'
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    orderId:{
        type:String
    },
    transactionData:{
        type:Object
    },
    amount:{
        type:String,
    },
    isPaymentConfirmed:{
        type:Boolean.length,
        default:false
    }
}) 

module.exports = Transaction = mongoose.model('Transaction', transactionSchema);