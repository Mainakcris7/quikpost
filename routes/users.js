const express = require('express')
const { storage } = require('../config/cloudinary-config')
const multer = require('multer')
const { getUserDetails, followUser, editUserDetailsForm, editUserDetails } = require('../controllers/users')
const upload = multer({ storage })

const router = express.Router({ mergeParams: true })

// User details page
router.get('/:id', getUserDetails)

// Follow user
router.put('/follow/:id', followUser)

// Edit user details
router.get("/:id/edit", editUserDetailsForm)

router.put("/:id", upload.single("profilePicUrl"), editUserDetails)

module.exports = router;