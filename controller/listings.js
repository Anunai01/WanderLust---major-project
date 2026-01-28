const { request } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs", {allListings});
};

module.exports.createListing= async (req, res,next) => {
  const response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();


  let url= req.file.path;
  let filename = req.file.filename;
  // if(!result.error){
  //   throw new ExpressError(400, result.err)
  // } validateListing use kr rhe hai toh if condtion ki zarurat nhi hai ab
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url, filename};
  newListing.geometry = response.body.features[0].geometry;
  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("success" , "Listing created successfully !");
  res.redirect("/listings");
//   console.log("coordinates:", coordinates);
// console.log("Array?", Array.isArray(coordinates));
// console.log("mapbox supported:", mapboxgl.supported());
// console.log("map div:", document.getElementById("map"));
  req.flash("success", "Listing created successfully!");
  return res.redirect("/listings");

  
};

module.exports.showListing=async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

  module.exports.renderNewForm=(req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.updateListings=async (req, res) => {
  //  if(!req.body.listing){
  //   throw new ExpressError(404,"Please enter a valid data for listing");
  // }
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  if(typeof req.file !== "undefined") {
  let url= req.file.path;
  let filename = req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
   req.flash("success" , "Listing updated successfully !");
   res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success" , "Listing deleted successfully !");
  res.redirect("/listings");
};


module.exports.renderEditForm=async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
    
    let originalImageUrl= listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload" , "/upload/w_250");
    // req.flash("success" , "Listing edited successfully !");
     res.render("listings/edit.ejs", { listing ,originalImageUrl});
};