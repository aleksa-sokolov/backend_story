const Router = require("express");
const {Post, User, UserLike, Comment} = require("../models");
const {logger} = require("sequelize/lib/utils/logger");
const {Sequelize} = require("sequelize");


const router = new Router();


router.get("/", async (req, res) => {
    const {limit = 10, page = 1} = req.query;
    const posts = await Post.findAll({
        limit: limit,
        subQuery: false,
        offset: (+page - 1) * limit,
        order: [["id", "DESC"]],
        attributes: {
            include: [
                [Sequelize.fn("COUNT", Sequelize.col("userLikes.id")), "likeCount"], [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],]
        }, include: [{
            model: UserLike,
        }, {
            model: Comment
        }], group: ['post.id', 'userLikes.id', 'comments.id']
    })
    const totalPosts = await Post.count(); // кол-во постов
    const pages = Math.round(totalPosts / limit);
    return res.json({
        posts, pages
    });
})

router.post("/", async (req, res) => {
    try {
        const {name, text, mainImg} = req.body;
        const post = await Post.create({
            name, text, mainImg, userId: 1
        });
        return res.json(post);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Не удалось создать пост"
        })
    }
});


router.post("/like", async (req, res) => {
    const userId = 1;
    try {
        const {postId} = req.body;
        const post = await Post.findOne({
            where: {id: postId}
        })


        if (!post) {
            return res.status(400).json({
                message: "Что-то пошло не так"
            });
        }

        const user = await User.findOne({
            where: {id: userId}
        })


        if (!user) {
            return res.status(400).json({
                message: "Что-то пошло не так"
            });
        }

        const userLike = await UserLike.findOne({
            where: {
                postId: postId, userId: userId
            }
        })


        if (!userLike) {
            const like = await UserLike.create({
                postId, userId
            });
            return res.status(200).json({
                message: "All ok",
            });
        }

        await userLike.destroy();

        return res.status(200).json({
            message: "like удален",
        })


    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Что-то пошло не так"
        });
    }
});

router.put("/", async (req, res) => {
    const {id} = req.body;
    const post = await Post.findOne({
        where: {
            id: id
        }
    })
    await post.update({
        views: post.views += 1
    });
    res.status(200).json("Update view single post");
});

//req.body используется в методах post, put
//req.params параметры ссылки(пишется через "/")
//req.query пишется через ? (используется для фильтров или сортировок)

router.get("/:id", async (req, res) => {
    // SELECT * FROM posts JOIN (SELECT * FROM comments WHERE comments.postId = req.params.id)WHERE post.id = req.params.id)
    const post = await Post.findOne({
        where: {id: req.params.id},
        attributes: {
            include: [
                [Sequelize.fn("COUNT", Sequelize.col("userLikes.id")), "likeCount"], [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],]
        }, include: [{
            model: UserLike,
        }, {
            model: Comment
        }], group: ['post.id', 'userLikes.id', 'comments.id']
    });


    return res.json(post);
});

module.exports = router;
