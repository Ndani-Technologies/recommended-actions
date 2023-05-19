const express = require("express");

const UserController = require("../controllers/users");

const UserRouter = express.Router();

UserRouter.get("/", UserController.getUsers).post(
  "/",
  UserController.createUser
);
UserRouter.get("/:id", UserController.getUser)
  .patch("/:id", UserController.updateUser)
  .delete("/:id", UserController.deleteUser);

module.exports = UserRouter;
