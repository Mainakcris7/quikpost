const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash("error", "Please login to QuikPost")
        return res.redirect("/login")
    }
}
module.exports = checkLogin