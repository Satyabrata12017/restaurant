
const mongooseconnect = require('mongoose')
const Schema= mongooseconnect.Schema


mongooseconnect.connect("mongodb+srv://restaurantportal:satya1234@cluster0.s7lay.mongodb.net/restaurantonlineportal?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log(`conection successful`);
}).catch((e)=>{
    console.log(e);
})

const userSchema= new Schema({
    name:{
        type: String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    password:{
        type:String
    }
},{timestamps:true})

const userLogin= mongooseconnect.model('userLogin',userSchema)
