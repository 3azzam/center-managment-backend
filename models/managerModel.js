const mongoose = require("mongoose") ; 
const joi = require("joi");
const jwt = require("jsonwebtoken") ; 

const managerSchema = new mongoose.Schema({
    name : {
        type : String , 
        required: true 
    } , 
    phoneNumber : [{ 
        type :String , 
        required : true 
    }] , 
    imageURI : {
        type : String ,
        required : true  
    },
    password : {
        type : String , 
        required : true ,
        minlength : 6 , 
        maxlength : 255 
    } ,
    email : {
        type : String , 
        required : true ,
        minlength : 6 , 
        maxlength : 255 
    }
});

managerSchema.methods.generateToken = function () {
    const payload = {
        id : this._id , 
        isAdmin : true
    }
    const token = jwt.sign(payload, "centerMannagementSecretKey" ,  {expiresIn : 3600 } ) ; 
    return token ; 
}


function validateManager( manager , image ) {

    const schema = {
        name: joi.string().required().min(5).max(255),
        phoneNumber: joi.array().items(joi.string()).required() , 
        password : joi.string().min(6).max(255).required() , 
        email : joi.string().email().min(6).max(255).required()
    }

    let errors = {
        error: {
            details: [{
                message: "image required"
            }, {
                message: "please select image only"
            }]
        }
    }

    if (!image) return errors;
    
    errors.error.details.shift();
    if( image.mimetype !== "image/jpeg" && image.mimetype !== "image/jpg" && image.mimetype !== "image/png" )
        return errors ; 

    return joi.validate(manager, schema);    
};


exports.managerModel = mongoose.model('manager' , managerSchema ) ;
exports.validateManager = validateManager ;  