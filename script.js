let taskInput = document.querySelector("#taskInput");
let addBtn = document.querySelector("#addBtn");
let filterBtns = document.querySelectorAll(".filter-btn");
let counter = document.querySelector("#counter");
let taskList = document.querySelector("#taskList");

//
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

//
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//
addBtn.addEventListener("click",() => {
    let task = taskInput.value.trim();
    if (task === "") return;

    const newTask = {
        id:Date.now(),
        text: task,
        completed:false
    };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    renderTasks();
});

//
function renderTasks() {
    taskList.innerHTML = '';

    const filtered = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filtered.forEach(task => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) span.classList.add('done');
        span.style.cursor = 'pointer';
        span.addEventListener("click", () => toggleTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

    });
    updateCounter();
}
//
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

//
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

//
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');

        renderTasks();
    });
});

function updateCounter() {
    const remaining = tasks.filter(task => !task.completed).length;
    counter.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

//
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

//
renderTasks();
