const router = require("express").Router();
const { validateStudent, studentModel } = require("../models/studentModel");
const multer = require("multer");
const _ = require("lodash");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/")
    },
    filename: function (req, file, cb) {

        cb(null, new Date().toDateString() + file.originalname)
    }
});

const upload = multer({ storage });

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

router.post("/", upload.single("wow"), async (req, res) => {

    const { error } = validateStudent(req.body, req.file);
    if (error)
    {
        if(req.file)
            deleteStudentImage("http://localhost:3000/uploads/" + req.file.filename) ;
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
        deleteStudentImage(imageURI);
        res.status(500).send(err);
    }

});


router.put("/:id" , async(req ,res)=>{

});

router.delete("/:id" , async( req , res )=>{

    try{
        const student = await studentModel.findByIdAndDelete(req.params.id) ;
        if( !student ) return res.status(404).send("student not found") ;  

        deleteStudentImage( student.imageURI ) ; 
        res.send(student);
    }
    catch(err){
        return res.status(500).send(err) ;  
    }

});


function deleteStudentImage(uri) {
    let imageName = uri.split("uploads/")[1];
    fs.unlink( "./uploads/"+imageName , (err) => {
        if (err)
            return err
        return true ;
    });
}

module.exports = router; 