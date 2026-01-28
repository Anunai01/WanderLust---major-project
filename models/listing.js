const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref:"Review"
  }
],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});
listingSchema.index({ geometry: "2dsphere" });

// neeche ki 4 line se jb bhi tm review delete kroge toh database se listing bhi delete hogi , means jo id jisne 
// review kiya tha vo bhi delete hoga 
// pehle id delete ho jate the pr dbs review reh jata tha usko prevent krne k liye we have done this thing

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;