const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.users;

exports.create = (req, res, next) => {
  let user = req.body;
  if (user.email) {
    user.email = user.email.toLowerCase();
  }
  User.findOne({
    where: {
      email: user.email,
    },
  })
    .then((foundUser) => {
      if (foundUser) {
        // Flash notification
        res.json({ error: ["Email address has already been used."] });
        // Redirect back to same page
      } else {
        bcrypt
          .hash(user.password, 10)
          .then((hash) => {
            user.password = hash;
            User.create(user)
              .then((createdUser) => {
                // Flash notification
                res.json({ success: ["You have successfully registered."] });
                // Redirect to login page
              })
              .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                  // Flash notification
                  res.json({ error: [err.message] });
                  // Redirect back to same page
                }
                next(err);
              });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  let email = req.body.email;
  if (email) {
    email = email.toLowerCase();
  }
  let password = req.body.password;
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        // Flash notification
        res.json({ error: ["Email address or password is incorrect.MARKED"] }); // REMOVE MARKED AFTER TESTING
        // Redirect back to same page
      } else {
        bcrypt.compare(password, user.password).then((result) => {
          if (result) {
            req.session.user = user.id;
            // Flash notification
            res.json({ success: ["You have successfully logged in."] });
            // Redirect to dashboard
          } else {
            // Flash notification
            res.json({
              error: ["Email address or password is incorrect."],
            });
            // Redirect back to same page
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    } else {
      // Flash notification
      res.json({ success: ["You have successfully logged out."] });
      // Redirect to home page
    }
  });
};
