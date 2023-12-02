const e = require("express");
const { body, validationResult } = require("express-validator");

exports.validateId = (req, res, next) => {
  let id = 0;
  if (req.body.id) {
    id = req.body.id;
  } else {
    id = req.params.id;
  }
  //a bigint is an auto-incremented integer
  if (!id.toString().match(/^[0-9]\d*$/)) {
    let err = new Error("Budget item id is invalid.");
    err.status = 400;
    return next(err);
  } else {
    return next();
  }
};

exports.validateSignUp = [
  body("firstName", "First name cannot be empty.").notEmpty().trim().escape(),
  body("lastName", "Last name cannot be empty.").notEmpty().trim().escape(),
  body("email", "Email must be a valid email address.")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64 characters."
  ).isLength({ min: 8, max: 64 }),
];

exports.validateLogin = [
  body("email", "Email must be a valid email address.")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64 characters."
  ).isLength({ min: 8, max: 64 }),
];

exports.validateItem = [
  body("title", "Item title cannot be empty.") // Possibly add validator for max length of 40 chars
    .notEmpty()
    .trim()
    .escape(),
  body("budget", "Item budget cannot be empty.").notEmpty().trim().escape(),
  body("budget", "Item budget must be a number greater than or equal to 0.")
    .isFloat({ min: 0 })
    .trim()
    .escape(),
  body("spend", "Item spend cannot be empty.").notEmpty().trim().escape(),
  body("spend", "Item spend must be a number greater than or equal to 0.")
    .isFloat({ min: 0 })
    .trim()
    .escape(),
];

exports.validateResult = (req, res, next) => {
  let errors = validationResult(req);
  let errorMessages = [];
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => errorMessages.push(error.msg));
    // Flash notification
    res.json({ error: errorMessages });
    // Redirect back to same page
  } else {
    return next();
  }
};
