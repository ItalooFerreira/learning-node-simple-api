const express = require('express');
const uuidv4 = require('uuid/v4');
const application = express();
const bodyParser = require('body-parser');

application.use(bodyParser.urlencoded({ extended: true }));
application.use(bodyParser.json());

const NOT_FOUND = -1;

let tasks = [];

application.get('/', (request, response) => {
    response.status(200).send('Task Manager');
});

application.post('/task', (request, response) => {
    const { title, resume, isDone, isPriority } = request.body;
    const id = uuidv4();
    const task = { id, title, resume, isDone, isPriority };
    tasks.push(task);
    response.status(201).send(task);
});

application.get('/task/', (request, response) => {
    response.status(200).send(tasks);
});

application.get('/task/:id', (request, response) => {
    const task = tasks.find((task) => task.id === request.params.id);
    const res = task ? task : makeResponse(false, "Task not found.");
    response.send(res);
});

application.put('/task/:id', (request, response) => {
    const indexToUpdate = tasks.findIndex((task) => task.id === request.params.id);
    if (indexToUpdate === NOT_FOUND) {
        const res = makeResponse(false, "Task not found.");
        response.send(res);
        return;
    }
    const { title, resume, isDone, isPriority } = request.body;
    let taskToUpdate = tasks[indexToUpdate];
    taskToUpdate = { id: taskToUpdate.id, title, resume, isDone, isPriority };
    tasks[indexToUpdate] = taskToUpdate;
    const res = makeResponse(true, "Task successfuly updated", taskToUpdate);
    response.send(res);
});

application.delete('/task/:id', (request, response) => {
    const newTasks = tasks.filter((task) => task.id !== request.params.id);
    const deleted = newTasks.length !== tasks.length;
    tasks = newTasks;
    const message = deleted ? "Task successfully deleted." : "Task not found.";
    const res = makeResponse(deleted, message);
    response.send(res);
});

application.listen(3000, () => {
    console.log('Server running on port 3000');
    
});


makeResponse = (success, message, data) => {
    return { success, message, data };
};