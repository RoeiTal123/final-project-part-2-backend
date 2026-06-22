const { Router } = require('express');
const { userController } = require("../controller/user-controller.js");

const userRouter = new Router();

userRouter.get('/', userController.getUsers);
userRouter.post('/', userController.addUser);
userRouter.post('/login', userController.login);

module.exports = { userRouter };
