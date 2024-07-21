const express = require('express')
var ShareNetError = require('../Error/ShareNetError')
var Posts = require('../models/posts')

module.exports.indexRoute = async (req, res, next) => {
    let allPosts = await Posts.find().populate('userId', ["username", "profilePicUrl"]) // Populate the user data in each post
    allPosts = allPosts.sort((a, b) => {
        return b.time - a.time     // Sort based on the time posted
    })
    res.render("home.ejs", { title: "Home", allPosts, mt: 3 })
}

module.exports.getCreatePost = (req, res, next) => {
    res.render("new_post.ejs", { title: "Create post" })
}

module.exports.createPost = async (req, res, next) => {
    try {
        const { caption } = req.body.items;
        var newPost = {
            userId: req.user.id,
            caption,
            time: new Date()
        }
        if (req.file) {
            newPost = { ...newPost, mediaUrl: req.file.path }
        }
        let post = new Posts(newPost);
        await post.save()
        res.redirect("/posts")
        // res.send(newPost)
    } catch (err) {
        next(new ShareNetError(500, "Can't create new post!"))
    }
}

module.exports.getPost = async (req, res, next) => {
    const { id: postId } = req.params;
    try {
        let post = await Posts.findById(postId).populate("userId", ["username", "profilePicUrl"]).populate('comments.user', ["username", "profilePicUrl"])
        let comments = post.comments;
        // Sort post comments based on time
        comments = comments.sort((commentA, commentB) => commentB.commentTime - commentA.commentTime)
        res.render('post_details.ejs', { title: "Post details", post, comments })
    } catch (err) {
        next(err)
    }
}

module.exports.deletePost = async (req, res) => {
    const id = req.params.id;
    try {
        let post = await Posts.findByIdAndDelete(id)
        req.flash("success", "Post deleted successfully!")
        res.redirect("/posts")
    } catch (err) {
        next(err)
    }
}

module.exports.getEditPost = async (req, res) => {
    const id = req.params.id;
    try {
        let post = await Posts.findById(id)
        res.render("edit_post.ejs", { title: "Edit post", post })
    } catch (err) {
        next(err)
    }
}

module.exports.editPost = async (req, res) => {
    const id = req.params.id;
    let { items } = req.body;
    if (req.file) {
        items = { ...items, mediaUrl: req.file.path }
    }
    try {
        let post = await Posts.findByIdAndUpdate(id, items)
        req.flash("success", "Post updated successfully!")
        res.redirect("/posts")
    } catch (err) {
        next(err)
    }
}

module.exports.commentPost = async (req, res, next) => {
    const { id: postId } = req.params;
    try {
        let post = await Posts.findById(postId)
        const { comment } = req.body;
        let newComment = {
            user: req.user.id,
            content: comment.trim()
        }
        post.comments.push(newComment)
        await post.save()
        res.redirect(`/posts/${postId}`)
    } catch (err) {
        next(new ShareNetError(500, "Can't add comment to this post!"))
    }
}

module.exports.deleteCommentPost = async (req, res, next) => {
    const { id: commentId } = req.params;
    try {
        let post = await Posts.findOne({ "comments._id": commentId });  // Find the post
        let refinedComments = post.comments.filter((comment) => comment.id != commentId);  // Filter out all comments except the to be deleted one
        post.comments = refinedComments;  // Update post
        await post.save()  // Save
        req.flash("success", "Comment deleted successfully!")
        res.redirect(`/posts/${post.id}`)
    }
    catch (err) {
        next(err)
    }
}