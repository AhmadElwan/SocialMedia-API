const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Update user's info by his id 

router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.user.isAdmin){
        if(req.body.password){ // if user wants to update his password
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err){
                res.status(500).json(err);
            }
        }
    } else {
        return res.status(403).json("You can update only your account");
    }
    

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true}
        );
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        res.status(200).json("The account has been updated successfully !");

    }catch(err){
        res.status(500).json(err);
    }

})


// Delete a user's account by his id


router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.user.isAdmin){
    try{
        const updatedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        res.status(200).json("The account has been deleted successfully !");

    }catch(err){
        res.status(500).json(err);
    }

}
})




module.exports = router;