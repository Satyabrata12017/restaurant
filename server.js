
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const RegisterAdmin = require('./models/registers');
const server = require('http').Server(app)
require("./database/conn");
const Register = require("./models/registers")
const addCustomer = require("./models/addcustomer")
const moment = require('moment')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth');







const staticPath = path.join(__dirname, "./public");

app.set('view engine', 'hbs');
app.use(express.static(staticPath));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/viewcustomer', auth, async (req, res) => {
    try {

        const data = await addCustomer.find({}, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.render('viewcustomer', { records: data })
            }
        })

    } catch (e) {

        res.status(404).send("error")
        console.log(e)

    }
})

app.post('/viewcustomer',async(req,res)=>{
    try{
        const email= req.body.email;
        const name= req.body.name;
        const viewcustomerpostdata=await addCustomer.find({email:email})
        if(viewcustomerpostdata[0].name===name){
            res.render('viewcustomer',{records:viewcustomerpostdata})
        }else{
            res.render('viewcustomer',{message:"no record found"})
        }
        

    }catch(e){
        res.render('viewcustomer',{message:"no record found"})
    }
})


app.get('/viewcustomer/:id', auth, async (req, res) => {
    try {
        const id= req.params.id;
        const viewdata = await addCustomer.findOne({_id:id})
        const name=viewdata.name;
        const email= viewdata.email;
        const phoneno= viewdata.phoneno;
        const guests= viewdata.guests;
        const address= viewdata.address;
        const date= moment(viewdata.date).format('YYYY-MM-DD');
        const specialmessage= viewdata.specialmessage;
        console.log(viewdata)

        res.render('viewcustomerdetails',{name:name,email:email,phoneno:phoneno,guests:guests,address:address,date:date,specialmessage:specialmessage,message:`Customer id: ${id}`})
    } catch (e) {

        res.status(404).send("error")
        console.log(e)

    }
})




app.post('/login', async (req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password
        console.log(email)
        console.log(password)

        const userEmail = await Register.findOne({ email: email })
        const token = await userEmail.generateAuthToken();
        console.log(token);


        res.cookie("jwt", token, {
            expires: new Date - (Date.now()),
            httpOnly: true
        })




        if (userEmail.password === password) {
            res.redirect('addcustomer')
        } else {
            res.render('login', { message: "Invalid Password" })
        }

    } catch (e) {
        res.status(404).render('login', { message: "Invalid login password" })
    }
})

app.get('/register', (req, res) => {
    res.render('register')
})


app.get('/logout', auth, async (req, res) => {
    try {
        console.log(req.user)


        req.user.tokens=req.user.tokens.filter((currenttoken)=>{
          return currenttoken.token !== req.token
        })

        
        res.clearCookie("jwt");
        await req.user.save();
        console.log('logout')
        res.redirect('/login')

    } catch (error) {
        res.status(404).send("error")
    }
})

app.post('/register', async (req, res) => {
    try {

        const fname = req.body.fname
        const lname = req.body.lname
        const email = req.body.email
        const password = req.body.password
        console.log(req.body.email)

        const registerAdmin = new Register({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password

        })

        console.log(registerAdmin)
        const token = await registerAdmin.generateAuthToken();
        console.log(token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        })
        

        const registered = await registerAdmin.save();
        res.status(201).render('index',{message:"register successful"})

    } catch (error) {
        res.status(404).send(error)
    }
})


app.get('/deletecustomer', auth, (req, res) => {
    res.render('deletecustomer')
})

app.post('/deletecustomer', async (req, res) => {
    try{
        const email=req.body.email;
        const name=req.body.name;
        const phoneno=req.body.phoneno;
        const deleteset= await addCustomer.find({email:email})
        if(deleteset[0].name===name || deleteset[0].phoneno=== phoneno){
            res.render('deletecustomer',{records:deleteset})
        }else{
            res.render('deletecustomer',{message:"data not found"})
        }
        


    }catch(e){
        res.render("deletecustomer",{message:"no record found"})
    }
})





app.get('/addcustomer', auth, (req, res) => {

    res.render('addcustomer')
})

app.post('/addcustomer', async (req, res) => {
    try {
        console.log(req.body.name)
        console.log(req.body.email)
        console.log(req.body.phoneno)
        console.log(req.body.guests)
        console.log(req.body.date)
        console.log(req.body.address)
        console.log(req.body.specialmessage)

        var mysqlTimestamp = moment(req.body.date).format('YYYY-MM-DD');


        const registerCustomer = new addCustomer({
            name: req.body.name,
            email: req.body.email,
            phoneno: req.body.phoneno,
            guests: req.body.guests,
            address: req.body.address,
            date: mysqlTimestamp,
            specialmessage: req.body.specialmessage

        })

        const registercustomer = await registerCustomer.save();
        res.status(201).render('addcustomer', { message: " New Customer Added Successfully" })

    } catch (e) {
        res.status(404).send("error")
        console.log(e)
    }
})




app.get('/editcustomer', auth, (req, res) => {
    res.render('editcustomer')
})

app.get('/editcustomer/:id', auth, async (req, res) => {
    try {
        var id = req.params.id

        const editcustomerdata=await addCustomer.findOne({_id:id})
        const name=editcustomerdata.name;
        const email=editcustomerdata.email;
        const phoneno= editcustomerdata.phoneno;
        const guests=editcustomerdata.guests;
        const date= moment(editcustomerdata.date).format('YYYY-MM-DD');
        const specialmessage=editcustomerdata.specialmessage;
        res.render('editcustomer',{name:name,email:email,phoneno:phoneno,guests:guests,date:date,specialmessage:specialmessage})


    } catch (e) {
        console.log(e)
    }
})


app.get('/deletecustomer/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        await addCustomer.deleteOne({ _id: id }, function (err) {
            if (err) {
                console.log(err)
            } else {
                res.redirect('/viewcustomer')
                console.log("Successful deletion");
            }

        })


    } catch (e) {
        res.status(404).send("error in database")
        console.log(e)
    }


})

app.post('/editcustomer', async (req, res) => {
    try {

        const name = req.body.name;
        const email = req.body.email;
        const phoneno = req.body.phoneno;
        const guests = req.body.guests;
        const date = req.body.date;
        const specialmessage = req.body.specialmessage

        await addCustomer.updateOne({ email: req.body.email }, { $set: { name: name, email: email, phoneno: phoneno, guests: guests, date: date, specialmessage: specialmessage } })


        res.status(201).render('editcustomer', { message: "Customer updated Successfully" })


    } catch (e) {
        res.status(404).send("error")
        console.log(e)
    }
})

server.listen(process.env.PORT || 3000, (req, res) => {
    console.log("port is running....");
})

