const { Router } = require('express')
const { userController } = require("../controller/user-controller.js")

const userRouter = new Router()

userRouter.get('/', userController.getusers)
userRouter.get('/:getuserbyid', userController.getUserById)
userRouter.put('/', userController.adduser)
userRouter.user('/', userController.adduser)
userRouter.delete('/', userController.deleteuser)

module.exports = { userRouter }