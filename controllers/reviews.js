const Review = require("../models/review");
const Beach = require("../models/beach")

module.exports.addReview = async(req, res) => {
    const beach = await Beach.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user.id;
    beach.reviews.push(review);
    await review.save();
    await beach.save();
    req.flash("success", "Dodali ste recenziju")
    res.redirect(`/beaches/${beach.id}`) 
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Beach.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Uspješno ste obrisali recenziju")
    res.redirect(`/beaches/${id}`)
}