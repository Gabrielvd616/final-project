const express = require("express");
const controller = require("../controllers/itemController");
const { isLoggedIn, isItemOwner } = require("../middleware/auth");
const {
  validateId,
  validateItem,
  validateResult,
} = require("../middleware/validator");

const router = express.Router();

//GET /items: send all items to the user
router.get("/", isLoggedIn, controller.index);

//POST /items: create a new item
router.post("/", isLoggedIn, validateItem, validateResult, controller.create);

//PUT /items/:id: update the item identified by id
router.put(
  "/",
  validateId,
  isLoggedIn,
  isItemOwner,
  validateItem,
  validateResult,
  controller.update
);

//DELETE /items/:id: delete the item identified by id
router.delete("/:id", validateId, isLoggedIn, isItemOwner, controller.delete);

module.exports = router;
