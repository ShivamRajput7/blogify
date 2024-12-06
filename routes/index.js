const express = require("express");
const bycrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/user");
const Blog = require("../models/blog");

const { createTokenForUser } = require("../services/auth");
router.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", { user: req.user, blog: allBlogs });
});
router.get("/about", async (req, res) => {
  return res.render("aboutPage", { user: req.user });
});
router.get("/contact", async (req, res) => {
  return res.render("contactPage", { user: req.user });
});
router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

router.get("/signup", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  return res.render("signup");
});
router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  return res.render("login");
});

//Author blog post
router.get("/author/:id", async (req, res) => {
  try {
    const author = await User.findById(req.params.id);
    const blog = await Blog.find({ createdBy: req.params.id });

    return res.render("authorBlogs", { user: req.user, blog, author });
  } catch (error) {
    console.error(error);

    return res.render("notfound");
  }
});

//signup form handling
router.post("/signup", async (req, res) => {
  const { name, email, password } = await req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("signup", {
      messege: `${email}`,
    });
  }

  const hashpswd = await bycrypt.hash(password, 10);
  try {
    User.create({
      fullname: name,
      email,
      password: hashpswd,
    });

    return res.redirect("/login");
  } catch (error) {
    console.log(error.errmsg);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render("login", {
      messege: `<b>${email}</b> This email Not Found in our database`,
    });
  }
  const isMatch = await bycrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", { messege: "Password does not match" });
  }
  const token = createTokenForUser(user);
  return res.cookie("token", token).redirect("/");
});

module.exports = router;
