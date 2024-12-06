const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

router.get("/add-new", (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  return res.render("createBlog", {
    user: req.user,
  });
});

// single blog by blog id
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comment = await Comment.find({ blogId: req.params.id }).populate(
      "commentedBy"
    );
    return res.render("blog", { user: req.user, blog, comment });
  } catch (error) {
    return res.render("notfound");
  }
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const blog = await Blog.create({
    title: req.body.title,
    body: req.body.blog,
    imageUrl: req.file.filename,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${blog._id}`);
});

// comments route is here
router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  await Comment.create({
    comment: req.body.comment,
    blogId: req.params.blogId,
    commentedBy: req.user,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
