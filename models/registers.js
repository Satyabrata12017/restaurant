const mongoose= require('mongoose');
const jwt= require('jsonwebtoken');


const customerSchema= new mongoose.Schema({
    fname:{
        type:String,
        required: true
    },
    lname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
        unique:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


customerSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id)
        const token= jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        console.log(token)
        return token;
    }catch(error){
        console.log(error)

    }
}

const RegisterAdmin= new mongoose.model("Registeradmin",customerSchema)

module.exports=RegisterAdmin;