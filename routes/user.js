const express = require("express");
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController= require("../controller/users");

// jb signup kroge to directly login ho jaoge , pehle signup krne k baad login krna padha tha solved by req.login()

router.route("/signup")
    .get( (req,res)=>{
    res.render("users/signup");
})
    .post(
    wrapAsync(userController.signup)
);


router.route("/login")
    .get( userController.renderLoginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

// it is for logging out from the website
router.get("/logout",userController.logout );

module.exports = router;