var Posts = require('../models/posts')
var Users = require('../models/users')
var ShareNetError = require('../Error/ShareNetError')

module.exports.signUpPage = async (req, res, next) => {
    res.render("signup.ejs", { title: "Register" })
}

module.exports.signUp = async (req, res, next) => {
    const { username, email, about, address, dob, gender, password } = req.body;
    if (password.length < 8) {
        req.flash("error", "Password length must be at least 8!")
        res.redirect("/signup")
    } else {
        let newUser = { username: username.trim(), email: email.trim(), about, address, dob, gender, createdOn: Date.now() }
        if (req.file) {
            newUser = { ...newUser, profilePicUrl: req.file.path }
        }
        try {
            let registeredUser = await Users.register(newUser, password)
            // console.log(registeredUser)    // login the user after sign up
            req.logIn(registeredUser, (err) => {
                if (err)
                    next(err)
                else {
                    req.flash("success", "Welcome to QuikPost!")
                    res.redirect("/posts")
                }
            })
        } catch (err) {
            if (err.name === "UserExistsError") {
                msg = err.message.replace('username', 'email')
                req.flash("error", msg)
            } else {
                req.flash("error", err.message)
            }
            res.redirect("/signup")
        }
    }
}