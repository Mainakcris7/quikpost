module.exports.logInPage = (req, res) => {
    res.render("login.ejs", { title: "Login" })
}
module.exports.logIn = async (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`)
    res.redirect("/posts")
}

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged out successfully!")
        res.redirect("/login")
    })
}