const express = require("express");

const todoController = require("../controllers/todo.controller");

const router = express.Router();

router.route("/").get(todoController.getTodo).post(todoController.addTodo);
router
    .route("/:id")
    .put(todoController.updateTodo)
    .delete(todoController.deleteTodo);

module.exports = router;
