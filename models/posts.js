const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        default: new Date(),
        required: true,
    },
    caption: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
    ,
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        commentTime: {
            type: Date,
            default: new Date()
        },
        likes: {
            type: Number,
            default: 0
        }
    }]
})

const Posts = mongoose.model('Post', postSchema)
module.exports = Posts;