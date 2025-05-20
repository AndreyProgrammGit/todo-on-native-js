input = document.querySelector("#input");
list = document.querySelector(".list");
button = document.querySelector("#btn");
inputContainer = document.querySelector(".input-container");

idx = localStorage.length;

// Add event listener to the button
button.addEventListener("click", function () {

    if (input.value) {
        // i++;
        var element = `
            <li class="list-item" data-key="${++h}">
                <span class="item">${h}. ${input.value}</span>
                <button class="delete" id="delete" onclick="deleteTodo(this)">Delete</button>
                <button class="complete" id="complete" onclick="completeTodo(this)">Completed</button>
            </li>
        `;

        list.innerHTML += element ;
        localStorage.setItem("todo" + h, element);
        input.value = "";
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

arrayTodo = [];
for(item in localStorage) {
    if(item.includes('todo')){
        arrayTodo.push(localStorage.getItem(item));
    }
}

arrayLastItem = arrayTodo.map(item => {
    result = item.match(/<li[^>]*data-key="([^"]+)"/)
    return result[1];
});

h = 0;
arrayLastItem.forEach(element => {
    if(element > h) {
        h = element;
    }
});

console.log(h);

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
}

// Function to mark a todo item as complete
function completeTodo(e) {
    var item = e.parentElement;
    var span = item.querySelector(".item");
    var btn = item.querySelector(".complete");
    localStorageComplete = localStorage.getItem("todo" + item.dataset.key);
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