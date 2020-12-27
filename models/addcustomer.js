const mongoose= require('mongoose')

const addcustomerSchema= new mongoose.Schema({
    name:{
        type:String,

    },
    email:{
        type:String,
        unique:true
    },
    phoneno:{

        type:String

    },
    guests:{
        type:Number

    },
    address:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    },
    
    specialmessage:{
        type:String

    }
})

const addCustomer= mongoose.model('addCustomer',addcustomerSchema);

module.exports= addCustomer;