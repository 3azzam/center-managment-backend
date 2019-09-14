const express = require("express") ; 
const mongoose = require("mongoose") ; 

const studnet = require("./routes/student") ; 

const app = express() ; 

const Port = 3000 ; 

// database connection 
mongoose.connect("mongodb://localhost:27017/center-managment" ,  { useNewUrlParser: true ,useUnifiedTopology: true } ) ; 

// middelwares
app.use( express.json() );
app.use('/uploads' , express.static('./uploads') ); 

// Routes
app.use("/api/student" ,  studnet ) ; 




app.listen(Port , ()=> {
    console.log("server started") ; 
});

