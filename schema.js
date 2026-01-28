const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    // Fix: allow both string and object formats
    image: Joi.alternatives().try(
      Joi.string().allow("", null),
      Joi.object({
        url: Joi.string().optional(),
        filename: Joi.string().optional()
      })
    ).optional(),
  }).required(),
});

// this bakend validation is for "reviews" 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

// When you make validation in your form or frontend (EJS, HTML, etc.),
// that only works inside your website — for example, when someone fills the form and clicks “Submit.”

// But tools like Hoppscotch or Postman can directly send requests to your server,
// without using your website or your form at all.

// So your frontend validation can’t stop them.
// That’s why people can still add wrong or fake data from Hoppscotch.

// Joi is a powerful JavaScript object schema validator for Node.js.

// It lets you define clear, descriptive blueprints for your data, 
// ensuring that objects conform to specific rules regarding type, format, 
// and content (e.g., a field must be a required string, or a number greater than zero). 
// It's commonly used to validate user input in Express applications.
// aise tmhe indivisual hrr route me if condition lagane padege ....joi is a shortcut and reliable method 

// jo screen pr aata hai vo mongoose ka error hai and jo console me aa rha voh joi ka error hai 