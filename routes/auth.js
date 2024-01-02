const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Register

router.post("/register", async (req, res) => {

    try{

        // Hashing the user's password with a salt "a random number"

        salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Creating the new user

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // Saving the new user

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }

})

// Login

router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({username : req.body.username});
        !user && res.status(401).json("Wrong Credentials");

        const Password = await bcrypt.compare(req.body.password, user.password);

        !Password && res.status(401).json("Wrong Credentials");


        res.status(200).json(user);

    } catch(err){
        res.status(500).json(err);
    }
})




module.exports = router;