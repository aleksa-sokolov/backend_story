const sequelize = require('./bdConnect');
const {DataTypes} = require('sequelize');

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    mainImg: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING(50000)},
    views: {type: DataTypes.INTEGER, defaultValue: 0}
});

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    nickname: {type: DataTypes.STRING},
    avatar: {type: DataTypes.STRING}
});

const UserLike = sequelize.define("userLike", {
    isLiked: {type: DataTypes.BOOLEAN}
});

const Comment = sequelize.define("comment", {
    text: {type: DataTypes.STRING},
    date: {type: DataTypes.DATE}
});



Post.hasMany(Comment); //пост имеет много комментариев
Comment.belongsTo(Post); // комментарии + к какому-то посту

User.hasMany(Comment); // пользователь может писать много комментариев
Comment.belongsTo(User); // комментарии у какого-то пользователя

User.hasOne(Post); //пост имеет одного пользователя
// "SELECT * FROM POSTS WHERE userId = 1"
Post.belongsTo(User); //имеет много постов


Post.hasMany(UserLike); //пост имеет много like`ов
UserLike.belongsTo(Post); // like к какому-то посту

User.hasMany(UserLike); // пользователь может лайкать много постов
UserLike.belongsTo(User); // лайки у какого-то пользователя


module.exports = {Post, User, UserLike, Comment};
