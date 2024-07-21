const express = require('express')
const checkLogin = require("../middlewares/checkLogin.js")
const multer = require('multer')
const { storage } = require('../config/cloudinary-config')
const { indexRoute, getCreatePost, createPost, getPost, deletePost, getEditPost, editPost, commentPost, deleteCommentPost } = require('../controllers/posts.js')


const router = express.Router({ mergeParams: true })
const upload = multer({ storage })

// All the paths here are relative to "/posts"
// So, '/create' means '/posts/create'

router.get("/", indexRoute)

router.get("/create", checkLogin, getCreatePost)

router.post("/create", checkLogin, upload.single('items[mediaUrl]'), createPost)

router.get("/:id", checkLogin, getPost)

//Delete route
router.delete("/:id", checkLogin, deletePost)

//Update route
router.get("/:id/edit", checkLogin, getEditPost)

router.put("/:id", checkLogin, upload.single("mediaUrl"), editPost)

// Comment on post
router.post('/comment/:id', checkLogin, commentPost)

// Delete comment
router.delete("/comment/delete/:id", checkLogin, deleteCommentPost)

module.exports = router;