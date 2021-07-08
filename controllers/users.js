const User = require("../models/user")

module.exports.getRegisterForm = (req, res) => {
    res.render("users/register")
}

module.exports.registerUser = async(req, res, next) => {
    try {
        const { username, password, email} = req.body;
        const user = new User({username, email})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Dobrodošli u CroAdriu!");
            res.redirect("/beaches")
        })
    }
   catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
   }
}

module.exports.getLoginForm = (req, res) => {
    res.render("users/login")
}

module.exports.login =  (req, res) => {
    req.flash("success", "Dobrodošli natrag!");
    const redirectUrl = req.session.returnTo || '/beaches'
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Odjavljeni ste")
    res.redirect("/beaches")
}