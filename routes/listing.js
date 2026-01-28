const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateListing}= require("../middleware.js");
const { listingSchema } = require("../schema.js");
const listingController= require("../controller/listings");

const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });

// multer is used here which is a package in node.js used for uploading files (i.e., images), (image upload feature in 
// create new listing form )

// INDEX ROUTE and Create Route
router.route("/")
  .get( wrapAsync(listingController.index))
  .post( isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
  
// isAuthenticated() is a passport method verifies the user details for login

//New Route isLoggedIn jo bna hai iska main code middleware.js mei hai
router.get("/new", isLoggedIn, listingController.renderNewForm);


//EDIT ROUTE
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


//SHOW, UPDATE AND DELETE ROUTE 
router.route("/:id")
  .get(
  wrapAsync(listingController.showListing)
)
.put(isLoggedIn, isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing ));


module.exports=router;