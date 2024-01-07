const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");



// Creating new post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
})


// Editing an existing post

router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json("Post updated successfully !");
    }else{
        res.status(403).json("You can update only your posts !!");
    }
    }catch(err){
        res.status(500).json(err);
    }
})


// Delete a post

router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.deleteOne();
        res.status(200).json("Post has been deleted !");
    }else{
        res.status(403).json("You can delete only your posts !!");
    }
    }catch(err){
        res.status(500).json(err);
    }
})


// Like a post or remove the like

router.put("/:id/like", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("You liked the post !");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("You removed the like !");
        }
    }catch(err){
        res.status(500).json(err);
    }
})


// Get a post

router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
})


// Timeline ---> Get all the posts of your followings 

router.get("/timeline/all", async (req, res) => {
    let postArray = [];
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id}); // get all the posts of the user
        const friendsPosts = await Promise.all(
            currentUser.following.map(friendId => { // Get all the posts of the friends in the followings list
                return Post.find({userId : friendId})
            })
        );
        
        res.json(userPosts.concat(...friendsPosts));

    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;
