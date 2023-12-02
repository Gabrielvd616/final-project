const db = require("../models");
const Item = db.items;

//check if user is a guest
exports.isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    // Flash notification
    res.json({ error: ["You are logged in already."] });
    // Redirect to dashboard
  }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    // Flash notification
    res.json({ error: ["You need to log in first."] });
    // Redirect to login page
  }
};

//check if user is owner of the item
exports.isItemOwner = (req, res, next) => {
  let id = 0;
  if (req.body.id) {
    id = req.body.id;
  } else {
    id = req.params.id;
  }

  Item.findOne({
    where: {
      id: id,
    },
  })
    .then((foundItem) => {
      if (foundItem) {
        if (foundItem.userId == req.session.user) {
          return next();
        } else {
          let err = new Error("Unauthorized to access the resource.");
          err.status = 401;
          return next(err);
        }
      } else {
        let err = new Error(
          `Cannot find a budget item with id=${id}. The item was not found.`
        );
        err.status = 404;
        return next(err);
      }
    })
    .catch((err) => next(err));
};

exports.sessionStatus = (req, res, next) => {
  let secondsRemaining = -1;
  let loggedInStatus = false;

  if (req.session.user) {
    let expirationTime = new Date(req.session.cookie._expires);
    let currentTime = new Date();
    secondsRemaining = Math.round((expirationTime - currentTime) / 1000);
    loggedInStatus = true;
  }
  res.json({ status: loggedInStatus, timeout: secondsRemaining });
};
