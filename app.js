const API_URL = 'https://6a170e181b90031f81b1f509.mockapi.io/api/pro/v1/todo';

// Global variables
const todoAddSection = document.getElementById('todo-input-section');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addTodoBtn');

const updateSection = document.getElementById('update-section');
const updateInput = document.getElementById('updateInput');
const updateTodoBtn = document.getElementById('updateTodoBtn');
const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');


const todoList = document.getElementById('todoList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const success = document.getElementById('success');
const noTask = document.getElementById('no-task');
const editBtn = document.getElementById('edit-btn');

let editTaskId = null;

// Error function
function errerMessage(errorText) {
    error.innerText = errorText;
    error.style.display = 'block';
    setTimeout(
        () => {
            error.style.display = 'none';
        }
        , 3000)
}
// success text
function successMessage(successText) {
    success.innerText = successText;
    success.style.display = 'block';
    setTimeout(
        () => {
            success.style.display = 'none';
        }
        , 3000)
}

// Get task list
async function fetchTaskList() {
    loading.style.display = 'block';
    try {
        const fetchData = await fetch(API_URL)
        const data = await fetchData.json();

        if (data.length === 0) {
            noTask.style.display = 'block';
        }
        data.forEach((task) => {
            createElement(task)
        });

        loading.style.display = 'none';

    } catch (error) {
        loading.style.display = 'none';
        errerMessage('Failed to load task.')

    }
}

// update check box 
async function checkUpdate(id, taskValidation) {
    const fetchData = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { 'content-type': "application/json" },
        body: JSON.stringify({ isCompleted: taskValidation })
    });
}


function createElement(task) {
    const li = document.createElement('li');
    li.className = "todo-item";
    li.innerHTML = `
    <input type="checkbox" class="check-box" ${task.isCompleted === true ? checked = 'checked' : ''} />
    <span class="task-text">${task.title}</span>

    <div class="actions">
        <button class="edit-btn" onclick="editSingleTask('${task.id}', '${task.title}')">Edit</button>
        <button class="delete-btn" onclick = "deleteTask(${task.id})">Delete</button>
    </div>`;

    if (task.isCompleted) {
        li.classList.add('completed');
    }

    const checkBox = li.querySelector('.check-box');
    todoList.appendChild(li);

    checkBox.addEventListener('change', async function () {
        const id = task.id;
        const btns = li.querySelectorAll('.edit-btn, .delete-btn');

        if (this.checked) {
            li.classList.add('completed');
            btns.forEach(btn => btn.disabled = true);
            await checkUpdate(id, true);

        } else {
            li.classList.remove('completed');
            btns.forEach(btn => btn.disabled = false);
            await checkUpdate(id, false);
        }
    });
}

// Create task 
async function addTaskToList() {
    const title = todoInput.value;
    if (!title) {
        errerMessage('Please enter task');
        return;
    }
    const data = {
        title
    }
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            console.log(res);
            todoList.innerHTML = "";
            fetchTaskList();
            successMessage('Task added successfully');
            todoInput.value = '';
        }

    } catch (error) {
        loading.style.display = 'none';
        errerMessage('Failed to create task.');

    }

}

// Edit task
function editSingleTask(id, title) {
    todoAddSection.style.display = "none";
    updateSection.style.display = "flex";
    editTaskId = id;
    updateInput.value = title;
    updateInput.focus();
}

function cancelUpdating() {
    todoAddSection.style.display = "flex";
    updateSection.style.display = "none";
}

async function updateTask(editTaskId) {
    const title = updateInput.value;
    const id = editTaskId;

    if (!title) {
        errerMessage('Invalid task');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({title})
    });


    if (res.ok) {
        todoAddSection.style.display = "flex";
        updateSection.style.display = "none";
        successMessage('Task updated successfully');
        todoList.innerHTML = "";
        fetchTaskList();
    }
    } catch (error) {
        errerMessage('Failed to update task');
        
    }
}

// Delete task
async function deleteTask(id) {
    const confirmation =  confirm('Are you sure want to delete this task ? task ID: '+ id);

    if (!confirmation) {
        return;
    }
    try {
        const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {'content-type': 'application/json'}
    });
    if (res.ok) {
        successMessage('Task deleted successfully');
        todoList.innerHTML = "";
        fetchTaskList();
    }
    } catch (error) {
        errerMessage('Failed to delete task');
        console.log(error);
        
    }
}

fetchTaskList();
addBtn.addEventListener('click', () => {addTaskToList() });
updateTodoBtn.addEventListener('click', () => {updateTask(editTaskId)});
cancelUpdateBtn.addEventListener('click', () => {cancelUpdating()});

