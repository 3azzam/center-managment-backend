const router = require("express").Router();
const { validateStudent, studentModel } = require("../models/studentModel");
const _ = require("lodash");
const deleteImage = require("../middlewares/deleteImage") ; 
const auth = require("../middlewares/auth") ; 
const {upload} = require("../middlewares/uploadImage") ; 

router.get("/", async (req, res) => {
    try {
        const studentList = await studentModel.find().lean();
        res.send(studentList);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/:id", async (req, res) =>{

}) ; 

router.post("/", [auth , upload.single("student")] , async (req, res) => {

    const { error } = validateStudent(req.body, req.file);
    if (error)
    {
        if(req.file)
            deleteImage("http://localhost:3000/uploads/" + req.file.filename) ;
        return res.status(400).send(error.details[0].message);
    } 

    let temp = _.pick(req.body, ['name', 'phoneNumber']);
    let imageURI = "http://localhost:3000/uploads/" + req.file.filename;

    try {

        let student = new studentModel({
            name: temp.name,
            phoneNumber: temp.phoneNumber,
            imageURI
        });

        student = await student.save();
        res.send(student);
    }
    catch (err) {
        deleteImage(imageURI);
        res.status(500).send(err);
    }

});


router.put("/:id" , async(req ,res)=>{

});

router.delete("/:id" , auth , async( req , res )=>{

    try{
        const student = await studentModel.findByIdAndDelete(req.params.id) ;
        if( !student ) return res.status(404).send("student not found") ;  

        deleteImage( student.imageURI ) ;
        res.send(student);
    }
    catch(err){
        return res.status(500).send(err) ;  
    }

});

module.exports = router; 