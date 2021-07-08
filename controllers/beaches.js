const Beach = require("../models/beach");
const { cloudinary } = require("../cloudinary");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});




module.exports.index = async (req, res, next) => {
    const beaches = await Beach.find({});
    /* const imagesArr = beaches.map(beach => beach.image)
    res.send(imagesArr);
    console.log(imagesArr) */
   /* res.send(beaches[24].geometry.coordinates) */
    res.render('beaches/index', {beaches});
}

module.exports.renderNewForm = (req, res) => {
    res.render('beaches/new')
}

module.exports.newBeach = async (req, res, next) => {
        const geoData = await geoCoder.forwardGeocode({
            query: req.body.beach.location,
            limit: 1
        }).send()
        const beach = new Beach(req.body.beach);
        console.log(req.body.beach);
        beach.geometry = geoData.body.features[0].geometry;
        beach.images = req.files.map(f => ({url: f.path, filename: f.filename}))
        beach.author = req.user.id; 
        await beach.save();
        req.flash("congrats", "Čestitamo!");
        req.flash("success", "Napravili ste novu plažu!")
        res.redirect(`/beaches/${beach.id}`)
}

module.exports.showBeach = async(req, res) => {
    let { id } = req.params;
    const beach = await Beach.findById(id).populate(
        {path: 'reviews', 
        populate: {
        path: 'author'
            }
        }).populate('author');   
    if (!beach) {
        req.flash("error", "Ne možemo pronaći ovu plažu");
        return res.redirect('/beaches')
    }
    res.render('beaches/show', {beach});
}

module.exports.editBeach = async(req, res) => {
   
    let { id } = req.params;
    const beach = await Beach.findById(id);
    if (!beach) {
        req.flash("error", "Ne možemo pronaći ovu plažu");
        return res.redirect('/beaches')
    }
    res.render('beaches/edit', {beach})
}

module.exports.updateBeach = async(req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.beach.location,
        limit: 1
    }).send()
    const { id } = req.params;
    const beach = await Beach.findByIdAndUpdate(id, { ...req.body.beach});
    beach.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    beach.images.push(...imgs);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
        await beach.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    await beach.save();
    req.flash("success", "Upravo ste ažurirali plažu!")
    res.redirect(`/beaches/${beach.id}`)
}

module.exports.deleteBeach = async (req, res) => {
    const { id } = req.params;
    await Beach.findByIdAndDelete(id);
    req.flash("success", "Uspješno ste obrisali plažu!")
    res.redirect('/beaches')
}