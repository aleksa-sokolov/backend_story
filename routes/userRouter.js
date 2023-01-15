const Router = require("express");
const {User, Post} = require("../models");
const bcrypt = require("bcrypt");

const router = new Router();

router.post("/registration", async (req, res) => {
    try {
        const {nickName, email, password, repeatPassword} = req.body;
        if (password.length < 4) {
            return res.status(400).json({
                message: "Пароль не может быть меньше,чем 4 символа"
            });
        }
        if (repeatPassword !== password) {
            return res.status(400).json({
                message: "Пароли не совпадают"
            });
        }
        if (!nickName) {
            return res.status(400).json({
                message: "Не указан ник"
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Не указан email"
            });
        }

        const hashPassword = await bcrypt.hash(password, 3);

        const user = await User.create({
            nickName,
            email,
            password: hashPassword
        });

        return res.status(200).json({
            nickName: user.nickName,
            email: user.email,
            id: user.id
        });

    } catch (e) {
        console.log(e)
    }
});


router.get("/data", async (req, res) => {
    // "SELECT COUNT(*) FROM POSTS WHERE userId=1"
    const userPosts = await Post.count({
        where: {
            userId: 1
        }
    });
    res.status(200).json(userPosts);
});



module.exports = router;
