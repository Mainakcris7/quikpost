const express = require('express')
const Users = require("../models/users")
const Posts = require("../models/posts")
var ShareNetError = require('../Error/ShareNetError')

module.exports.getUserDetails = async (req, res, next) => {
    const { id: uid } = req.params;
    try {
        let user = await Users.findById(uid);
        let allPosts = await Posts.find({ userId: user.id }).populate('userId', ["username", "profilePicUrl"]) // Populate the user data in each post
        allPosts = allPosts.sort((a, b) => {
            return b.time - a.time     // Sort based on the time posted
        })
        res.render('user_details.ejs', { showUser: user, title: user.username, allPosts, mt: 3 })
    } catch (err) {
        next(new ShareNetError("400", "User doesn't exist!"))
    }
}

module.exports.followUser = async (req, res, next) => {
    const { id: uid } = req.params;
    try {
        let user = await Users.findById(uid);
        if (req.body.increment) {
            if (req.user.id) {
                user.followerCount = user.followerCount + 1;
                user.followers.push(req.user.id);
            } else {
                throw new Error("err")
            }
        }
        else {
            if (req.user.id) {
                user.followerCount = user.followerCount - 1;
                await Users.findByIdAndUpdate(uid, { $pull: { followers: req.user.id } }, { new: true })
            } else {
                throw new Error("err")
            }
        }
        await user.save()
        res.send({ newFollowers: user.followerCount });
    } catch (err) {
        next(new ShareNetError(400, "User doesn't exist!"))
    }
}

module.exports.editUserDetailsForm = async (req, res, next) => {
    const userId = req.params.id;
    const userDetails = await Users.findById(userId);
    res.render("edit_user_details.ejs", { title: "Edit your details", userDetails })
}

module.exports.editUserDetails = async (req, res, next) => {
    const userId = req.params.id;
    const { username, about, address, dob, gender } = req.body;
    userUpdate = { username, about, address, dob, gender }
    if (req.file) {
        userUpdate = { ...userUpdate, profilePicUrl: req.file.path }
    }
    try {
        let user = await Users.findByIdAndUpdate(userId, userUpdate)
        res.redirect(`/user/${userId}`)
    } catch (err) {
        next(err)
    }
}