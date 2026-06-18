const { Router } = require('express');
const { userController } = require("../controller/user-controller.js");

const userRouter = new Router();

// Route definitions
userRouter.get('/', userController.getusers);
userRouter.get('/:getuserbyid', userController.getUserById);
userRouter.post('/login', userController.loginUser);
userRouter.post('/', userController.adduser);
userRouter.delete('/', userController.deleteuser);

module.exports = { userRouter };
