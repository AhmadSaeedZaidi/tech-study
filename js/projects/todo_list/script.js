const tasks = [];

const form = document.querySelector("#todo-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputValue = input.value;
    tasks.push(inputValue);
    input.value = "";
    renderTasks();
});

function renderTasks() {
    list.innerHTML = "";
    tasks.forEach(function (task) {
        const li = document.createElement("li");
        li.textContent = task;
        list.appendChild(li);
    });
}
