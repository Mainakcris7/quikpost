
var ShareNetError = require('../Error/ShareNetError')
var Posts = require('../models/posts')

module.exports.postLike = async (req, res, next) => {
    const { id: postId } = req.params;
    let thePost = await Posts.findById(postId);
    if (req.body.increment) {   // Increment like count
        try {
            thePost.likes = thePost.likes + 1
            thePost.likers.push(req.user.id)  // liker information
            await thePost.save()
            res.send({ newLikes: thePost.likes })  // send the updated likes
        }
        catch (err) {
            next(err)
        }
    } else {   // Decrement like count
        try {
            thePost.likes = thePost.likes - 1;
            await thePost.save()   // Save the updated likes
            thePost = await Posts.findByIdAndUpdate(postId, { $pull: { likers: req.user.id } }, { new: true })  // Delete the liker as he/she dislikes
            res.send({ newLikes: thePost.likes })
        } catch (err) {
            next(err)
        }
    }
}

module.exports.commentLike = async (req, res) => {
    const { id: commentId } = req.params;
    let thePost = await await Posts.findOne({ "comments._id": commentId });
    let selectedComment = thePost.comments.find((comment) => comment.id == commentId)

    // Bad approach, but I have to do it in that way as I have not created a different schema for comments
    // Approach 
    // 1. Select the post having that particular comment Id
    // 2. select the actual comment by id
    // 3. update the comment likes
    // 4. Rewrite the whole array of comments to that db
    if (req.body.increment) {
        try {
            selectedComment.likes = selectedComment.likes + 1
            await Posts.findOneAndUpdate({ "comments._id": commentId }, { comments: thePost.comments })
            res.send({ newLikes: selectedComment.likes })  // send the updated likes
        } catch (err) {
            next(err)
        }
    } else {
        try {
            selectedComment.likes = selectedComment.likes - 1
            await Posts.findOneAndUpdate({ "comments._id": commentId }, { comments: thePost.comments })
            res.send({ newLikes: selectedComment.likes })  // send the updated likes
        } catch (err) {
            next(err)
        }
    }
}