const { beachSchema, reviewSchema } = require('./models/joiSchema.js')
const ExpressError = require("./utils/ExpressError")
const Beach = require('./models/beach');
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Morate se prijaviti")
        return res.redirect("/login")
    } next()
}

module.exports.beachValidation = (req, res, next) => {
    const result = beachSchema.validate(req.body);
    if(result.error){
        const msg = result.error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let { id } = req.params;
    const beach = await Beach.findById(id);
    if(!beach.author.equals(req.user.id)){
        req.flash('error', 'Nemate dozvolu za to!');
        return res.redirect(`/beaches/${id}`)
    } next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Nemate dozvolu za to!');
        return res.redirect(`/beaches/${id}`)
    } next();
}

module.exports.reviewValidation = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}