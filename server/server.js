const express = require("express");
const db = require('./database/db');
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const userRouter = require("./Router/userRouter");

app.use(bodyParser.urlencoded({ extended : false }));
app.use(cors());
app.use(bodyParser.json());

// app.get("/api", (req, res) => {
//     res.send({test : "hello~~"});
// });


app.use("/api", userRouter);

const port = 5000;
app.listen(port, () => console.log(`${port}`));