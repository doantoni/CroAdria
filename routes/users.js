const express = require("express");
const router = express.Router();
const passport = require('passport');
const catchAsync = require("../utils/catchAsync")
const User = require("../models/user")
const users = require("../controllers/users")

router.route("/register")
    .get(users.getRegisterForm)
    .post(catchAsync(users.registerUser))


router.route("/login")
    .get(users.getLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get("/logout", users.logout)


module.exports = router;