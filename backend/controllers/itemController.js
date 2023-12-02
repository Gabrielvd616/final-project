// const model = require("../models/item");
const db = require("../models");
const Item = db.items;

//define middleware and controller
exports.index = (req, res, next) => {
  let user = req.session.user;

  Item.findAll({
    where: {
      userId: user,
    },
  })
    .then((items) => res.json(items))
    .catch((err) => next(err)); // Passes error along for all requests with no body content
};

exports.create = (req, res, next) => {
  //creates a new item
  let item = req.body;
  item.userId = req.session.user;

  Item.create(item)
    .then((item) => {
      // Flash notification
      res.json({ success: ["Budget item was created successfully."] });
      // Redirect to dashboard
    })
    .catch((err) => {
      console.log("Validation error name:", err.name); // REMOVE THIS AFTER TESTING
      if (err.name === "SequelizeValidationError") {
        // Flash notification
        res.json({ error: [err.message] });
        // Redirect back to same page
      }
      next(err);
    });
};

exports.update = (req, res, next) => {
  let item = req.body;
  // let id = req.params.id;
  Item.update(item, {
    where: {
      id: item.id,
    },
  })
    .then((rcode) => {
      if (rcode == 1) {
        // Flash notification
        res.json({
          success: ["Budget item was updated successfully."],
        });
        // Redirect to dashboard
      } else {
        // Flash notification
        res.json({
          error: [
            `Cannot update budget item with id=${item.id}. Either the item was not found or req.body is empty.`,
          ],
        });
        // Redirect back to same page
      }
    })
    .catch((err) => {
      if (err.name === "SequelizeValidationError") {
        // Flash notification
        res.json({ error: [err.message] });
        // Redirect back to same page
      }
      next(err);
    });
};

exports.delete = (req, res, next) => {
  let id = 0;
  if (req.body.id) {
    id = req.body.id;
  } else {
    id = req.params.id;
  }

  Item.destroy({
    where: {
      id: id,
    },
  })
    .then((rcode) => {
      if (rcode == 1) {
        // Flash notification
        res.json({
          success: ["Budget item was deleted successfully."],
        });
        // Redirect to dashboard
      } else {
        // Flash notification
        res.json({
          error: [
            `Cannot delete budget item with id=${id}. The item was not found.`,
          ],
        });
        // Redirect back to same page
      }
    })
    .catch((err) => next(err));
};
