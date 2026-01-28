if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//console.log(process.env.secret);

const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate= require('ejs-mate');
const ExpressError= require("./utils/ExpressError.js");

const flash= require("connect-flash");


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

const passport= require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter= require("./routes/user.js");
main()
    .then(()=>{
        console.log("Connected to the DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
}
app.get("/" , (req,res)=>{
    res.redirect("/listings");
});



const store = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: "sessions",   // 🔥 MUST
  ttl: 14 * 24 * 60 * 60,        // 🔥 MUST (seconds)
});


store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,   // 🔥 VERY IMPORTANT
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));



app.use(flash());

// USE OF PASSPORT FOR AUTHENTICATION BELOW 5 LINES
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});


// DEMO USER -> to check password authentication (pbkdf2) is the hashing algo implemented here
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);


// app.get("/testListing" , async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa", 
//         description: "By the beach",
//         price:1200,
//         location:"Moon",
//         country:"Azcaban",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });



app.all(/.*/,(req,res,next)=>{
  next(new ExpressError(404,"Page not Found !!"));
});

// app.use((err,req,res,next)=>{
//   let {statusCode=500,message="Something went wrong !!"}=err;
//   res.status(statusCode).render("error.ejs" , {message});
// }); 
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let { statusCode = 500, message = "Something went wrong !!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


// above is a middleware used for error handling



app.listen(8080,()=>{
    console.log("Server is listening to the port ");
});