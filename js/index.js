"use strict";

import validator from "./validator.js";

var input = document.querySelector("#input");
var inputDate = document.querySelector(".input-date")
var list = document.querySelector(".list");
var button = document.querySelector("#btn");
var inputContainer = document.querySelector(".input-container");
var modal = document.querySelector(".modal");
var modalClose = document.querySelector(".close");

var idx = localStorage.length;

// var validator = {
//     validateLength: function (input, maxLength) {
//         if(input.value.length < maxLength && input.value.length > 3) {
//             return true;
//         }
//     },
//     validateValue: function(input){
//         if(input.value) {
//             return true;
//         }
//     },
//     validateDate: function(inputDate){
//         if(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(inputDate.value)){
//             return true;
//         }
//     }
// }

function checkDate() {
    var spanDate = document.querySelectorAll(".date");
    var date = new Date() 
    var options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    spanDate.forEach(function (item) {
        var dateHtml = item.innerHTML.split(':').reduce((acc, time)=> acc + time);
        date = date.toLocaleString('ru-RU', options).split(':').reduce((acc, time)=> acc + time);

        if(dateHtml === 0) {
            clearAll();
            return;
        }

        if(item.parentElement.querySelector(".item").classList.contains("completed")) {
            item.parentElement.querySelector(".item").classList.remove("expired");
            return;
        }

        if(dateHtml < date.trim()) {
            item.parentElement.querySelector(".item").classList.add("expired");
        }
    });
}

setInterval(() => {
    checkDate();
}, 1000);

window.editTodo = editTodo;
window.deleteTodo = deleteTodo;
window.completeTodo = completeTodo;

// Add event listener to the button
button.addEventListener("click", function () {

    if(!validator.validateDate(inputDate)) {
        alert("Please enter a valid time in HH:MM:SS format");
        return;
    }

    if (validator.validateValue(input)) {
        if(validator.validateLength(input, 35)) {
            var element = `
                <li class="list-item" data-key="${++h}" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="date">${inputDate.value}</span>
                    <span class="item" style="display:flex; align-items:center;">${h}. ${input.value}</span>
                    <button class="delete" id="delete" onclick="deleteTodo(this)">Delete</button>
                    <button class="edit" id="edit" onclick="editTodo(this)">Edit</button>
                    <button class="complete" id="complete" onclick="completeTodo(this)">Completed</button>
                </li>
            `;

            list.innerHTML += element ;
            localStorage.setItem("todo" + h, element);
            input.value = "";
            inputDate.value = "";
        } else {
            alert("Value too long");
            return;
        }
    } else {
        alert("Please enter a value");
        return;
    }

    if(list.childNodes.length === 3) {
        inputContainer.appendChild(document.createElement("button")).innerHTML = "Очистить";
        inputContainer.lastChild.id = "clear";
        inputContainer.lastChild.addEventListener("click", function () {
            clearAll();
    });
}

});

if(idx > 0) {
    inputContainer.appendChild(document.createElement("button")).innerHTML = "Очистить";
    inputContainer.lastChild.id = "clear";
    inputContainer.lastChild.addEventListener("click", function () {
        clearAll();
    });
}

var arrayTodo = [];
for(var item in localStorage) {
    if(item.includes('todo')){
        arrayTodo.push(localStorage.getItem(item));
    }
}

var arrayLastItem = arrayTodo.map(item => {
    var result = item.match(/<li[^>]*data-key="([^"]+)"/)
    return result[1];
});

var h = 0;
arrayLastItem.forEach(element => {
    if(element > h) {
        h = element;
    }
});

var j = 0
while(j <= h) {
    if (localStorage.getItem("todo" + j) !== null) {
        list.innerHTML += localStorage.getItem("todo" + j);
    }
    j++;
}

// Function to delete a todo item
function deleteTodo(e) {
    var item = e.parentElement;
    list.removeChild(item);
    localStorage.removeItem("todo" + item.dataset.key);
    j--;
    console.log(j);
    if(j === 0) {
        inputContainer.removeChild(document.querySelector("#clear"));
        h = 0;
    }
}

function editTodo(e) {
    modal.classList.add("active-modal");
    var item = e.parentElement;
    var btn = document.querySelector("#edit-modal");
    var key = item.dataset.key;

    var todo = localStorage.getItem("todo" + key);

    console.log(key);

    btn.addEventListener("click", function () {
        console.log('btn clicked');
        var spanDate = item.querySelector(".date");
        var spanTask = item.querySelector(".item");

        var inputTime = document.querySelector("#input-edit__time");
        var inputTask = document.querySelector("#input-edit__task");

        if(!validator.validateDate(inputTime)) {
            if(validator.validateValue(inputTask) && validator.validateLength(inputTask, 35)) {
                var updateTask = todo.replace(/(<span class="item"[^>]*>)(.*?)(<\/span>)/, `$1 ${key}. ${inputTask.value}$3`);
                console.log(updateTask);
                localStorage.setItem("todo" + key, updateTask);
                spanTask.innerHTML = `${key}. ${inputTask.value}`;
                inputTask.value = '';
                inputTime.value = '';
                return;
            }
        }

        if(!validator.validateValue(inputTask)) {
            if(validator.validateDate(inputTime)) {
                var updateTime = todo.replace(/(<span class="date">)(\d{2}:\d{2}:\d{2})(<\/span>)/, `$1${inputTime}$3`);
                localStorage.setItem("todo" + key, updateTime);
                spanDate.innerHTML = inputTime.value;
                inputTask.value = '';
                inputTime.value = '';
                return;
            }
        }

        if(validator.validateDate(inputTime) && validator.validateLength(inputTask, 35) && validator.validateValue(inputTask)) {
            console.log('all ok');
            var updateTime = todo.replace(/(<span class="date">)(\d{2}:\d{2}:\d{2})(<\/span>)/, `$1${inputTime}$3`);
            var updateTask = todo.replace(/(<span class="item"[^>]*>)(.*?)(<\/span>)/, `$1  ${key}. ${inputTask}$3`);
            localStorage.setItem("todo" + key, updateTime);
            localStorage.setItem("todo" + key, updateTask);

            spanDate.innerHTML = inputTime.value;
            spanTask.innerHTML = `${key}. ${inputTask.value}`;
            inputTask.value = '';
            inputTime.value = '';
        }
    })
}

function closeModal() {
    modal.classList.remove("active-modal");
}

modalClose.addEventListener("click", closeModal)

// Function to mark a todo item as complete
function completeTodo(e) {
    var item = e.parentElement;
    var span = item.querySelector(".item");
    var btn = item.querySelector(".complete");
    var localStorageComplete = localStorage.getItem("todo" + item.dataset.key);
    if (span.classList.contains("completed")) {
        span.classList.remove("completed");
        localStorage.setItem("todo" + item.dataset.key, localStorageComplete.replace(/(<span\s+class=")item\s+completed(")/g, '$1item$2')
            .replace(/\s*style="background-color:\s*greenyellow"\s*/g, ' '));
    } else {
        span.classList.add("completed");
        console.dir(localStorageComplete);
        localStorage.setItem("todo" + item.dataset.key, localStorageComplete.replace(/(<span\s+class=")(item)(")/g, '$1item completed$3')
            .replace(/(<button\s+class="complete")([^>]*?)>/, '$1 style="background-color: greenyellow"$2>'));
    }

    if(span.classList.contains("completed")){
        btn.style.backgroundColor = "greenyellow";
    } else {
        btn.style.backgroundColor = "green";
    }
}

// Function to clear all todo items
function clearAll() {
    list.innerHTML = "";
    h = 0;
    inputContainer.removeChild(document.querySelector("#clear"));
    localStorage.clear();
}