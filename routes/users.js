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

// Get a user by his username

router.get("/:username", async (req, res) => {
    try{
        const user = await User.findOne({username: req.params.username});
        if (!user) {
            return res.status(404).json("User not found");
        }else{
            const {password, updatedAt, ...other} = user._doc;
            res.status(200).json(other);
        }
    }catch(err){
        res.status(500).json(err);
    }
})


// Follow a user

router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user || !currentUser) { // Checks if both users exists 
                return res.status(404).json("User not found");
            }else {
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push:{followers:req.body.userId}});
                    await currentUser.updateOne({$push:{following:req.params.id}});
                    res.status(200).json(`Started following ${user.username}`);
                }else {
                    res.status(403).json("You already follow this user !");
                }
        }}catch(err){
            res.status(500).json(err);
        }
    }else {
        res.status(403).json("You cannot follow yourself !!");
    }
})

// Unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user || !currentUser) { // Checks if both users exists 
                return res.status(404).json("User not found");
            }else {
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull:{followers:req.body.userId}});
                    await currentUser.updateOne({$pull:{following:req.params.id}});
                    res.status(200).json(` unfollowed ${user.username}`);
                }else {
                    res.status(403).json("You don't follow this user !");
                }
        }}catch(err){
            res.status(500).json(err);
        }
    }else {
        res.status(403).json("You cannot unfollow yourself !!");
    }
})




module.exports = router;