const { Router } = require("express")
const { postController } = require("../controller/post-controller.js")

const postRouter = new Router()

postRouter.get("/", postController.getPosts)
postRouter.get("/:postid", postController.getPost)
postRouter.post("/", postController.addPost)
postRouter.post("/:postid/likes", postController.addLike);
postRouter.put("/:postid", postController.updatePost)
postRouter.delete("/:postid/likes", postController.removeLike);
postRouter.delete("/:postid", postController.deletePost)

module.exports = { postRouter }