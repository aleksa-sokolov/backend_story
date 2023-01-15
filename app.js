const express = require("express");
const sequelize = require("./bdConnect");
const cors = require('cors');
const router = require("./routes/index");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({extends: true}));


app.use("/api", router)


async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {
        console.log(`Port listen on ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    } finally {

    }
}

start();
