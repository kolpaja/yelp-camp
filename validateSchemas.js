const Joi = require("joi");

module.exports.campgroundSchemaJoi = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    // images: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchemaJoi = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),
  }).required(),
});
