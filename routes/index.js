const Router = require("express");
const PostRouter = require("./postRouter");
const UserRouter = require("./userRouter");
const CommentRouter = require("./commentRouter");

const router = new Router();
router.use("/posts", PostRouter);
router.use("/user", UserRouter);
router.use("/comment", CommentRouter);


module.exports = router;
