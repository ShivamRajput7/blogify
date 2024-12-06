require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const userRoute = require("./routes");
const blogRoute = require("./routes/blog");
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkCookieForAuthentication } = require("./middleware/authentication");

const port = process.env.port || 8000;
//database connect
mongoose.connect(process.env.MONGO_URL);
//
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkCookieForAuthentication("token"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// route
app.use("/", userRoute);
app.use("/blog", blogRoute);
app.use((req, res, next) => {
  res.status(404).render("notfound", { message: "Page Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
