const { Router } = require('express')
const { postController } = require("../controller/post-controller.js")

const postRouter = new Router()

postRouter.get('/', postController.getPosts)
postRouter.get('/:postid', postController.getPost)
postRouter.post('/', postController.addPost)
postRouter.put('/:postid', postController.updatePost)
postRouter.delete('/:postid', postController.deletePost)

module.exports = { postRouter }