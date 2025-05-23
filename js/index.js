"use strict";

var input = document.querySelector("#input");
var inputDate = document.querySelector(".input-date")
var list = document.querySelector(".list");
var button = document.querySelector("#btn");
var inputContainer = document.querySelector(".input-container");

var idx = localStorage.length;

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

// Add event listener to the button
button.addEventListener("click", function () {

    if(!/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(inputDate.value)){
        alert("Please enter a valid time in HH:MM:SS format");
        return;
    }

    if (input.value) {
        if(input.value.length) {
            var element = `
                <li class="list-item" data-key="${++h}" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="date">${inputDate.value}</span>
                    <span class="item" style="display:flex; align-items:center;">${h}. ${input.value}</span>
                    <button class="delete" id="delete" onclick="deleteTodo(this)">Delete</button>
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