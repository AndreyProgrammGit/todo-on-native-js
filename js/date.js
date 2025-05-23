"use strict";

var dateEl = document.getElementById("date");

setInterval(() => {
    let date = new Date();
    let options = {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    var dateMD =  date.toLocaleString('ru-RU', options).split(',')[0];
    var dateHM = date.toLocaleString('ru-RU', options).split(',')[1];
    dateEl.innerHTML = `
        <div class="date-title" style="display:flex; flex-direction:column; font-size: 20px; font-weight: 600;"> 
            <span class="date-subtitle" style="margin-bottom: 5px;">Дата ${dateMD}</span>
            <span class="time-subtitle">Время ${dateHM}</span>
        </div>
        `
}, 1000);