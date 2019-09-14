const mongoose = require("mongoose");
const joi = require("joi");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phoneNumber: [{
        type: String,
        required: true
    }],
    imageURI: {
        type: String,
        required: true
    }
});

function validateStudent(student, image) {
    const schema = {
        name: joi.string().required().min(5).max(255),
        phoneNumber: joi.array().items(joi.string())
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
    
    return joi.validate(student, schema);
}


exports.validateStudent = validateStudent;
exports.studentModel = mongoose.model('student', studentSchema); 