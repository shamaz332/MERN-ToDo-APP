const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
let Todo = require('./todo.model');

mongoose.connect('mongodb+srv://user:user12345@cluster0-4fsb0.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }, function (err) {

    if (err) {
        console.log('err', err)
    }
    else {
        console.log('successfully connected');
    }

});

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

todoRoutes.route('/').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function (req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' })
        })
        .catch(err => {
            res.status(400).send('Adding new todo is failed');
        });
});

todoRoutes.route('./update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else
            todo.todo_description = req.body.todo_description;
        todo.todo_responsible = req.body.todo_responsible;
        todo.todo_priority = req.body.todo_priority;
        todo.todo_completed = req.body.todo_completed;

        todo.save().then(todo => {
            res.json('Todo Updated')
        })
            .catch(err => {
                res.status(400).send("update not possible");

            });
    });
})

app.use('/todos', todoRoutes);


app.listen(PORT, () => console.log(`server running on port ${PORT}`));