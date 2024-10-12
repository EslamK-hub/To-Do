const Todo = require("../models/todo.model");

const getTodo = async (req, res) => {
    try {
        const todo = await Todo.find({ userId: req.userId });
        res.json(todo);
    } catch (err) {
        console.error("Error fetching todo:", err);
        res.status(500).json({ error: "Error fetching todo" });
    }
};

const addTodo = async (req, res) => {
    const { title, detail } = req.body;

    if (!title || !detail) {
        return res.status(400).json({ error: "Title and detail are required" });
    }

    try {
        const newTodo = new Todo({
            title,
            detail,
            userId: req.userId,
        });
        await newTodo.save();
        res.status(201).json({ message: "Todo added!" });
    } catch (err) {
        console.error("Error adding todo:", err);
        res.status(500).json({ error: "Error adding todo", error: err });
    }
};

const updateTodo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Todo ID is required" });
    }

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found!" });
        }
        res.json(updatedTodo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Error updating todo" });
    }
};

const deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Todo ID is required" });
    }

    try {
        const deletedTodo = await Todo.findOneAndDelete({
            _id: id,
            userId: req.userId,
        });
        if (!deletedTodo) {
            return res.status(404).json({ error: "Todo not found!" });
        }
        res.json({ message: "Todo deleted successfully!" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Error deleting todo" });
    }
};

module.exports = {
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo,
};
