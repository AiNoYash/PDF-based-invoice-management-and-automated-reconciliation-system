const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", require("./routes/auth.js"));
app.use("/api/v1/user", require("./routes/userroutes.js"));

app.get("/", (req, res) => {
    return res.status(200).send("<h1>welcome to our app</h1>");
});

const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
