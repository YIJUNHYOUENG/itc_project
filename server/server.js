const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const test = require("./Router/test");

app.use(bodyParser.urlencoded({ extended : false }));
app.use(cors());
app.use(bodyParser.json());

// app.get("/api", (req, res) => {
//     res.send({test : "hello~~"});
// });

app.use("/api", test);

const port = 5000;
app.listen(port, () => console.log(`${port}`));