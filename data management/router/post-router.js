const { Router } = require('express')
const { postController } = require("../controller/post-controller.js")

const postRouter = new Router()

postRouter.get('/', postController.getPosts)
postRouter.get('/:postid', postController.getPost)
postRouter.put('/', postController.addPost)
postRouter.post('/', postController.addPost)
postRouter.delete('/', postController.deletePost)

module.exports = { postRouter }