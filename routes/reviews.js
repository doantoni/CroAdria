const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const { reviewValidation, isLoggedIn, isReviewAuthor } = require("../middleware")

const ExpressError = require("../utils/ExpressError")
const Review = require("../models/review");
const Beach = require("../models/beach")
const reviews = require("../controllers/reviews")



router.post("/", isLoggedIn, reviewValidation, catchAsync(reviews.addReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;