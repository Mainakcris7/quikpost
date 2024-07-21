const mongoose = require('mongoose')
const passportLocalStrategy = require('passport-local-mongoose')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    profilePicUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/5987/5987424.png",
        set: (v) => v == "" ? "https://cdn-icons-png.flaticon.com/512/5987/5987424.png" : v
    },
    about: {
        type: String
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: "String",
        required: true,
        enum: ["male", "female", "others"]
    },
    address: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    followerCount: {
        type: Number,
        default: 0
    },
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]

})
userSchema.plugin(passportLocalStrategy, { usernameField: 'email' })
const Users = mongoose.model('User', userSchema)
module.exports = Users;