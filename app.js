const API_URL = 'https://6a170e181b90031f81b1f509.mockapi.io/api/pro/v1/todo';

const addText = document.getElementById('todoInput').value;
const addBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');




async function fetchTaskList() {
    const fetchData = await fetch(API_URL)
    const data = await fetchData.json();

    data.forEach((task) => {
        createElement(task)
    });
}

async function checkUpdate(id, taskValidation){
    const fetchData = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {'content-type': "application/json"},
        body: JSON.stringify({isCompleted: taskValidation})
    }); 
}

function createElement(task){
const li = document.createElement('li');
li.className = "todo-item";
li.innerHTML =`
    <input type="checkbox" class="check-box" ${task.isCompleted === true ? checked='checked' : ''} />
    <span class="task-text">${task.title}</span>
    <input type="text" class="edit-input" value="Learn JavaScript DOM Manipulation">
    <div class="actions">
        <button class="edit-btn">Edit</button>
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
        <button class="delete-btn">Delete</button>
    </div>
`;

if (task.isCompleted) {
    li.classList.add('completed');
}

const checkBox = li.querySelector('.check-box');
todoList.appendChild(li);

checkBox.addEventListener('change', async function(){
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

fetchTaskList();


