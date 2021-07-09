const Joi = require('joi')

module.exports.beachSchema = Joi.object({
    beach: Joi.object({ 
        name: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),            
       /*  images: Joi.array().required()  */
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

