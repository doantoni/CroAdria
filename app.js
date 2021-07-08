if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError")
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require("./models/user")

const beachRoutes = require("./routes/beaches")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users");
const { prototype } = require('ejs-mate/lib/block');

const mongoDb = process.env.MONGO_DB;
const tempDb = 'mongodb://localhost:27017/adria-unknown'

mongoose.connect(mongoDb || tempDb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));


app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = MongoStore.create({
    mongoUrl: mongoDb || tempDb,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.congrats = req.flash('congrats');
    res.locals.error = req.flash('error');
    next();
})

app.use('/beaches', beachRoutes);
app.use('/beaches/:id/review', reviewRoutes);
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render("home");
})



app.all("*", (req, res, next) => {
    next(new ExpressError('Nismo pronašli ovu stranicu', 404))
})


app.use((err, req, res, next) => {
    const { statusCode=500} = err;
    if(!err.message) err.message = "Nešto je pošlo po zlu!";
    res.status(statusCode).render("error", {err});
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Hostamo na portu ${port}`)
})

