const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
var engine = require('ejs-mate')
var methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash')
var Posts = require('./models/posts')
var Users = require('./models/users')
var ShareNetError = require('./Error/ShareNetError')
const postsRouter = require("./routes/posts")
const likesRouter = require("./routes/likes")
const usersRouter = require("./routes/users")
const checkLogin = require("./middlewares/checkLogin.js")
const multer = require('multer');
const { storage } = require('./config/cloudinary-config')
const { logInPage, logOut, logIn } = require('./controllers/loginAndout.js')
const { signUp, signUpPage } = require('./controllers/signup.js')

const app = express()
app.listen(8080)

app.use(methodOverride("_method"))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const upload = multer({ storage })

const dbUrl = process.env.MONGODB_ATLAS_URL;

// MongoStore to store session info.
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 12 * 60 * 60   // Update after 12 hrs. if no change occurs
})
store.on("error", (err) => console.log("Error in MongoStore: " + err))
app.use(session({
    store: store,
    secret: 'super-secret-cr7',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 24 * 60 * 60 * 3,
        maxAge: 1000 * 24 * 60 * 60 * 3,
        httpOnly: true
    }
}))   // used to store session info.


// Flash
app.use(flash())

// Passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({ usernameField: 'email' }, Users.authenticate()));
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())


async function mongooseConnect() {
    try {
        console.log("Trying to connect...")
        await mongoose.connect(dbUrl);
        console.log("Database connected!")
    } catch (err) {
        console.error(err)
    }
}
mongooseConnect()

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.user = req.user;
    next()
})

app.get("/", async (req, res, next) => {
    res.redirect("/posts")
})
app.use("/posts", postsRouter);
app.use("/like", checkLogin, likesRouter);
app.use("/user", checkLogin, usersRouter);


// Login
app.get("/login", logInPage)

app.post('/login', passport.authenticate('local', { failureFlash: "Email or password is incorrect", failureRedirect: "/login" }), logIn)

// Signup
app.get("/signup", signUpPage)

app.post("/signup", upload.single('profilePicUrl'), signUp)

// Logout
app.get("/logout", logOut)


// Page not found
app.all("*", (req, res) => {
    throw new ShareNetError(404, 'Page not found!')
})

// Error handler
app.use((err, req, res, next) => {
    const { code = 500, message } = err;
    res.status(code).render("error.ejs", { title: "Error", errorMsg: message })
})