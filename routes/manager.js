const router = require("express").Router();
const { managerModel, validateManager } = require("../models/managerModel");
const _ = require("lodash");
const { upload } = require("../middlewares/uploadImage");
const deleteImage = require("../middlewares/deleteImage");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth")

router.get("/", auth , async (req, res) => {
    try {
        const managersList = await managerModel.find().lean();
        res.send(managersList);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/", upload.single('manager'), async (req, res) => {

    const { error } = validateManager(req.body, req.file);
    if (error) {
        if (req.file)
            deleteImage("http://localhost:3000/uploads/" + req.file.filename);

        return res.status(400).send(error.details[0].message);
    }

    let temp = _.pick(req.body, ['name', 'phoneNumber', 'password', 'email']);
    let imageURI = "http://localhost:3000/uploads/" + req.file.filename;

    try {
        const prevManager = await managerModel.findOne({ email: temp.email });
        if (prevManager) return res.status(400).send( "manager already registerd " );
    }
    catch (err) {
        return res.status(500).send(err);
    }

    try {
        
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash( temp.password , salt);
        temp.password = password;

        let manager = new managerModel({
            name: temp.name,
            phoneNumber: temp.phoneNumber,
            imageURI,
            email: temp.email,
            password: temp.password
        });

        manager = await manager.save(); 
        const token = manager.generateToken() ; 
        res.header("x-auth-token" , token).send( manager);
    }
    catch (err) {
        deleteImage(imageURI);
        return res.status(500).send(err);
    }

});


router.get("/:id", auth , async (req, res) => {
    try {
        const manager = await managerModel.findById(req.params.id);
        if (!manager) return res.status(404).send("manager doesn't exist");

        res.send(manager);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.delete("/:id", auth , async (req, res) => {
    try {
        const manager = await managerModel.findByIdAndDelete(req.params.id);
        if (!manager) return res.status(404).send("manager not found");

        deleteImage(manager.imageURI);
        res.send(manager);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.delete("/" , async(req ,res) => {
    try {
        const managerList = await managerModel.deleteMany() ; 
        res.send(managerList); 
     }
    catch(err) {
        return res.status(500).send(err) ; 
    }
});

module.exports = router;