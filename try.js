const express = require("express") ; 
const mongoose = require("mongoose") ; 


const product = require("./try/routes/productRoute") ;
const order = require("./try/routes/orderRoute") ; 

const app = express() ; 


// database connection 
mongoose.connect("mongodb://localhost:27017/trydb" ,  { useNewUrlParser: true ,useUnifiedTopology: true } ) ; 

// middelwares
app.use( express.json() );


app.use("/try/product" , product ) ; 
app.use("/try/order" , order ) ; 


app.listen(3000 , ()=>{
    console.log(" server started ") ; 
}) ; 

