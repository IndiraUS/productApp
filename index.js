/* add "type":"module" in package.json to make the below import works */
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

// const root_dir = "/Users/indiraus/Desktop/The-Room-Assignment/productsApp";
//const port = 3000; 
const root_dir = "../";
const PORT = process.env.PORT ;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
mongoose.set('strictQuery',false);

console.log("mongo uri: ",process.env.MONGO_URI);
//connecting to mongoDB collection named as 'productApp'
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Successfully connected to MongoDB: ");
}).catch((error)=>{
    console.log(error);
})
        
    
// mongoose.connect("mongodb+srv://indira:Sivaganga31@mymongodb.wvbx2d5.mongodb.net/productApp?retryWrites=true&w=majority")
// .then(()=>{
//     console.log("Successfully connected to mongoDB")
// }).catch((error)=>{
//     console.log(error)
// })

// app.listen(port,()=>{
//     console.log(`Express app listening on port http://localhost:${port}`)
// });
app.listen(PORT,()=>{
    console.log(`Express app listening on port http://localhost:${PORT}`)
});
app.get("/",async(req,res)=>
{
    res.sendFile("Front-End/register.html",{root: root_dir})
});

app.get("/home",(req,res)=>
{
    res.sendFile("Front-End/index.html",{root: root_dir})
});
app.get("/login",(req,res)=>
{
    res.sendFile("Front-End/login.html",{root: root_dir})
});

//post
app.post("/register",async(req,res)=>
{
    console.log("Inside app.post('/register') in index.js:request body = ",req.body)
    const {username,password} = req.body;

    //checking if user alredy exists
    const uname = await User.findOne({username});
    if(uname)
    {
        return res.json({sucess:false,message: "User already Exists!"})
    }
    // Hashing password before storing it in DB
       const hPwd = await bcrypt.hash(password,10);

    // inserting the JSON data in mongoDB model 'User'
    const newUser = new User({username:username,password:hPwd});
    await newUser.save().then(()=>{
        console.log("Registration data successfully inserted inside data base.")
        res.status(200).json({success:true,message:"User successfully registered."});
    }).catch((error)=>{
        console.log(error,"Registration failed, Try Again with a differet username")
        res.status(400).json({sucess:false,message:"Registration failed"});
    })
 });

app.post("/login",async(req,res)=>
{
    console.log("index.js : app.post('/login'): request body = ",req.body);
    const {username,password} = req.body;

     // checking if username & password combo exist in mongoDB model 'User'
    const user = await User.findOne({username});
    const validPwd = await bcrypt.compare(password,user.password);
    console.log("user: ",user)
    if(!user && !validPwd)  // if no such combo exists
    {
        console.log("Login Failed.");
        res.status(400).json({success:false,message:"username or password not found"});
    }
    else
    {
        console.log("Logged In Successfully");
        const token = jwt.sign({id: user._id},"secret");

        res.status(200).json({success:true,token,userId:user._id,message:"Loggedin"});
    }
    
});

app.post("/add",async(req,res)=>
{
    console.log("index.js : app.post('/add'):request body: ",req.body);
    // inserting the JSON data in mongoDB model 'Product'
    const product = await Product.create(req.body).then(()=>{
        console.log("Product added successfully into data base.")
        res.status(200).json({success:true});
    }).catch((error)=>{
        console.log(error,"Product add failed.")
        res.status(400).json({sucess:false});
    }); 
});

app.post("/delete",async(req,res)=>{
    //find the unique imgUrl and delete from DB
    const docToDelete = await Product.deleteOne(req.body).then(()=>{
        console.log(req.body);
        console.log("product deleted successfully");
        res.status(200).json({success:true})
    }).catch((error)=>{
        console.log(error,"Product deletion failed.")
        res.status(400).json({sucess:false});
    })
})

app.post("/home",async(req,res)=>{
    const products = await Product.find();
    console.log("index.js: app.post('/home'):",products);
    res.status(200).json({success:true,products:products})
})