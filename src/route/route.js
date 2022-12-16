const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const {authentication,authorization} = require("../MiddleWare/auth")


router.post("/author", authorController.createAuthor)

router.post("/login", authorController.login)

router.post("/blogs",authentication,authorization,blogController.createBlog)

router.get("/blogs", authentication, blogController.getBlogs)

router.put("/blogs/:blogId",authentication,authorization,blogController.putBlog)

router.delete("/blogs/:blogId", authentication,authorization,blogController.deleteBlog)

router.delete("/blogs/:blogId", authentication,authorization,blogController.deleteBlogBy)

module.exports = router;