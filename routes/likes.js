const express = require('express')

const { postLike, commentLike } = require('../controllers/likes')

const router = express.Router({ mergeParams: true })

router.put("/:id", postLike)
router.put("/comment/:id", commentLike)

module.exports = router