const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, beachValidation } = require("../middleware");
const Beach = require("../models/beach");
const beaches = require("../controllers/beaches")
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({ storage })

router.route("/")
    .get(catchAsync(beaches.index))
    .post(isLoggedIn,  upload.array("image"), beachValidation, catchAsync(beaches.newBeach))
   /*  .post(upload.array("image"), (req, res) => {
        res.send("Multer čini čudaaaaa");
       console.log(req.body, req.files)
    }) */

router.get("/new", isLoggedIn, beaches.renderNewForm)

router.route("/:id")
    .get(catchAsync(beaches.showBeach))
    .put(isLoggedIn, isAuthor, upload.array("image"), beachValidation, catchAsync(beaches.updateBeach))
    .delete(isAuthor, catchAsync(beaches.deleteBeach))


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(beaches.editBeach))





module.exports = router;