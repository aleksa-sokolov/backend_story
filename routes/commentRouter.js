const Router = require("express");
const {Post, Comment} = require("../models");
const router = new Router();


router.post("/", async (req, res) => {
    const {comment, id} = req.body;

    const post = await Post.findOne({
        where: {id: id}
    });

    if(post) {
        const addComment = await Comment.create({
            text: comment,
            postId: id,
            userId: 1,
            date: new Date()
        })
        return res.status(200).json(addComment);
    }
    return res.status(400).json({
       message: "Такого поста нет"
    });

});

module.exports = router;
