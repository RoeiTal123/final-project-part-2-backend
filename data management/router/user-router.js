const { Router } = require('express');
const { userController } = require("../controller/user-controller.js");

const userRouter = new Router();

userRouter.get('/', userController.getUsers);

module.exports = { userRouter };
