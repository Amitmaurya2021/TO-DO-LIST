document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskAction);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = {
            id: new Date().getTime(),
            text: taskText
        };

        addTaskToDOM(task);
        saveTaskToLocalStorage(task);

        taskInput.value = '';
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;
        taskList.appendChild(li);
    }

    function handleTaskAction(event) {
        const target = event.target;
        const li = target.closest('li');
        const taskId = li.getAttribute('data-id');

        if (target.classList.contains('delete')) {
            li.remove();
            deleteTaskFromLocalStorage(taskId);
        } else if (target.classList.contains('edit')) {
            const newText = prompt('Edit task:', li.firstElementChild.textContent);
            if (newText !== null) {
                li.firstElementChild.textContent = newText;
                updateTaskInLocalStorage(taskId, newText);
            }
        }
    }

    function saveTaskToLocalStorage(task) {
        let tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromLocalStorage() {
        return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => addTaskToDOM(task));
    }

    function deleteTaskFromLocalStorage(taskId) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id != taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(taskId, newText) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task => {
            if (task.id == taskId) {
                task.text = newText;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
