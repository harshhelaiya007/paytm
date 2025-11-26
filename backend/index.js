const express = require("express");
var cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json()); //Used to parse JSON bodies


const mainRouter = require("./routes/index");

app.use("/api/v1", mainRouter);

app.listen(3000);
