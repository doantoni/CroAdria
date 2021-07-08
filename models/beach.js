const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const BeachSchema = new Schema ({
    name: String,
    description: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    location: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, opts);

BeachSchema.path('images').schema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200/');
})

BeachSchema.virtual('properties.popUpMarkup').get(function() {
        return `<a href="/beaches/${this.id}">
        <p>${this.name}<p>
        </a>
        <p>${this.description.substring(0, 150)}...<p>
        `
})

BeachSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Beach', BeachSchema);