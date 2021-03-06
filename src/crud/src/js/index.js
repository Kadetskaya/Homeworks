"use strict";

const id = document.getElementById('input__id');
const firstName = document.getElementById('input__firstName');
const lastName = document.getElementById('input__lastName');
const age = document.getElementById('input__age');
const email = document.getElementById('input__email');
const phone = document.getElementById('input__phone');

const lStore = document.getElementById('radio__localStore');
const idb = document.getElementById('radio__indDB');
const labelLocalStore = document.getElementById('rBtn__ls');
const labelIndexedDB = document.getElementById('rBtn__idb');

const buttonCreate = document.getElementById('create');
const buttonUpdate = document.getElementById('update');
const buttonDelete = document.getElementById('delete');

const dataLS = JSON.parse(localStorage.getItem('personState'));

let table = document.getElementsByClassName('table-container');

let state = [];
let persons;
let isIndexedDb = false;
let db;
let row;

function validation() {
    if (isNaN(id.value)) {
        id.value = "";
        alert("The ID must be a number!")
    }
    if (isNaN(age.value)) {
        age.value = "";
        alert("The age must be a number!")
    }
    if (isNaN(phone.value)) {
        phone.value = "";
        alert("The phone must be a number!")
    }
};

function clear() {
    id.value = "";
    firstName.value = "";
    lastName.value = "";
    age.value = "";
    email.value = "";
    phone.value = "";
};

/////////////////Работа с хранилищем IndexedDB//////////////////////

const dbReq = indexedDB.open('myDB', 1);
//Создаем хранилище объектов с именем persons
dbReq.onupgradeneeded = function (event) {
    db = event.target.result;
    persons = db.createObjectStore('persons', {keyPath: 'id'})
};
dbReq.onsuccess = function (event) {
    db = event.target.result;
};
dbReq.onerror = function (event) {
    alert(`Error opening database ${event.target.errorCode}`)
};

function addIndexDB(db) {
//создаем транзакцию, получаем хранилище, добавляем в него данные
    let tx = db.transaction(['persons'], 'readwrite');
    let store = tx.objectStore('persons');
    const person = {
        id: id.value,
        firstName: firstName.value,
        lastName: lastName.value,
        age: age.value,
        email: email.value,
        phone: phone.value
    };
    store.add(person);
    tx.oncomplete = function () {
        console.log('Object was successfully added!')
    }
    readIndexDb(db);
    tx.onerror = function (event) {
        alert(`The person with the ID ${id.value} has been already created!`, event.target.error.name);
    }
};

function updateIndexDB(db) {
    let tx = db.transaction(['persons'], 'readonly');
    let store = tx.objectStore('persons');
    let req = store.get(id.value);
    req.onsuccess = function (event) {
        let gotten = event.target.result;
        if (gotten) {
            gotten.firstName = firstName.value;
            gotten.lastName = lastName.value;
            gotten.age = age.value;
            gotten.email = email.value;
            gotten.phone = phone.value;
        } else if (confirm(`The person with the ID ${id.value} is not in the list! Do you want to create?`)) {
            addIndexDB(db);
            return;
        }
        let request = db
            .transaction(['persons'], 'readwrite')
            .objectStore('persons')
            .delete(id.value);
        request.onsuccess = function (event) {
            console.log('It is gone!');
        };

        let tx = db.transaction(['persons'], 'readwrite');
        store = tx.objectStore('persons');
        store.add(gotten);
        tx.oncomplete = function () {
            readIndexDb(db);
            console.log('store is updated!');
        };
        tx.onerror = function (event) {
            alert(`Error ${event.target.errorCode}`);
        };
    };
}

function delIndexDB(id) {
    if (confirm(`Are you sure that you want to delete the person with ID ${id.value}?`)) {
        let request = db
            .transaction(['persons'], 'readwrite')
            .objectStore('persons')
            .delete(id.value);
        request.onsuccess = function (event) {
            readIndexDb(db);
            clear();
            console.log('deleted');
        };
    }
}

function readIndexDb(db) {
    let tx = db.transaction(['persons'], 'readonly');
    let store = tx.objectStore('persons');
    let req = store.openCursor();
    let allPersons = [];
    req.onsuccess = event => {
        let cursor = event.target.result;
        if (cursor != null) {
            allPersons.push(cursor.value);
            cursor.continue();
        } else {
            table[0].textContent = '';
            for (let i = 0; i < allPersons.length; i++) {
                row = document.createElement("div");
                row.classList.add("table-item");
                row.id = allPersons[i].id;

                let td1 = document.createElement("div");
                td1.classList.add("item");
                td1.textContent = allPersons[i].id;

                let td2 = document.createElement("div");
                td2.classList.add("item");
                td2.textContent = allPersons[i].firstName;

                let td3 = document.createElement("div");
                td3.classList.add("item");
                td3.textContent = allPersons[i].lastName;

                let td4 = document.createElement("div");
                td4.classList.add("item");
                td4.textContent = allPersons[i].age;

                let td5 = document.createElement("div");
                td5.classList.add("item");
                td5.textContent = allPersons[i].email;

                let td6 = document.createElement("div");
                td6.classList.add("item");
                td6.textContent = allPersons[i].phone;

                row.append(td1);
                row.append(td2);
                row.append(td3);
                row.append(td4);
                row.append(td5);
                row.append(td6);
                table[0].append(row);
                clear();
            }
        }
    };
    req.onerror = event => {
        alert('error in cursor request ' + event.target.errorCode);
    };
};

/////////////////Работа с хранилищем LocalStorage//////////////////////

function updateLocalStorage() {
    localStorage.setItem("personState", JSON.stringify(state));
};

function readLS() {
    table[0].textContent = '';
    for (let i = 0; i < state.length; i++) {
        let row = document.createElement('div');
        row.classList.add("table-item");
        row.id = state[i].id;

        let td1 = document.createElement("div");
        td1.classList.add("item");
        td1.textContent = state[i].id;

        let td2 = document.createElement("div");
        td2.classList.add("item");
        td2.textContent = state[i].firstName;

        let td3 = document.createElement("div");
        td3.classList.add("item");
        td3.textContent = state[i].lastName;

        let td4 = document.createElement("div");
        td4.classList.add("item");
        td4.textContent = state[i].age;

        let td5 = document.createElement("div");
        td5.classList.add("item");
        td5.textContent = state[i].email;

        let td6 = document.createElement("div");
        td6.classList.add("item");
        td6.textContent = state[i].phone;

        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);
        row.append(td5);
        row.append(td6);
        table[0].append(row);
    }
};


//после перезагрузки страницы отображаются данные LocalStorage
window.onload = function () {
    if (dataLS !== null) {
        state = dataLS;
        readLS();
    }
};


//приклепляем прослушивателей событий на все кнопки

lStore.addEventListener('click', function (event) {
    isIndexedDb = false;
    readLS();
});

labelLocalStore.addEventListener('click', function (event) {
    isIndexedDb = false;
    readLS();
});

idb.addEventListener('click', function () {
    isIndexedDb = true;
    readIndexDb(db);
});

labelIndexedDB.addEventListener('click', function () {
    isIndexedDb = true;
    readIndexDb(db);
});

id.addEventListener("change", validation);
age.addEventListener("change", validation);
phone.addEventListener("change", validation);


buttonCreate.addEventListener("click", function () {
    if (id.value === "" ||
        firstName.value === "" ||
        lastName.value === "" ||
        age.value === "" ||
        email.value === "" ||
        phone.value === "") {
        alert("Fill all of the fields, please!");
        return;
    }
    if (isIndexedDb === false) {
        for (let i = 0; i < state.length; i++) {
            if (id.value === state[i].id) {
                alert(`The person with the ID ${id.value} has been already created!`);
                return;
            }
        }
        state.push({
            id: id.value,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            email: email.value,
            phone: phone.value
        });
        clear();
        updateLocalStorage();
        readLS();
    } else {
        addIndexDB(db);
    }
});


buttonUpdate.addEventListener("click", function () {
    if (id.value === "" ||
        firstName.value === "" ||
        lastName.value === "" ||
        age.value === "" ||
        email.value === "" ||
        phone.value === ""
    ) {
        alert("Fill all of the fields, please!");
        return;
    }
    if (isIndexedDb === false) {
        let el = document.getElementById(id.value);
        if (el) {
            let i = state.findIndex(element => element.id === id.value);
            state[i] = {
                id: id.value,
                firstName: firstName.value,
                lastName: lastName.value,
                age: age.value,
                email: email.value,
                phone: phone.value
            };
            clear();
            updateLocalStorage();
            readLS();

        } else if (confirm(`The person with the ID ${id.value} is not in the list! Do you want to create?`)) {
            state.push({
                id: id.value,
                firstName: firstName.value,
                lastName: lastName.value,
                age: age.value,
                email: email.value,
                phone: phone.value
            });
            clear();
            updateLocalStorage();
            readLS();
        }
    } else if (isIndexedDb === true) {
        updateIndexDB(db);
    }
});


buttonDelete.addEventListener("click", function () {
    if (isIndexedDb === false) {
        if (confirm(`Are you sure that you want to delete the person with ID ${id.value}?`)) {
            let el = document.getElementById(id.value);
            if (el) {
                el.remove();
                let i = dataLS.findIndex(element => element.id === id.value);
                dataLS.splice(i, 1);
                clear();
                return;
            } else {
                alert(`The person with the ID ${id.value} is not in the list!`)
            }
        }
    } else if (isIndexedDb === true) {
        delIndexDB(id);
    }
});

