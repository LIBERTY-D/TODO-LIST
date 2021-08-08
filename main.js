const months = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fr", "Sat"];

let unique = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const addBtn = document.querySelector(".add-btn");
const content = document.querySelector(".content");
const input = document.querySelector(".input");
const form = document.querySelector("form");
const determine = document.querySelector(".determine");

let ediId = "";
let element = "";
let edit = false;
let createdDate = "";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let uniqueId = "";
  for (let i = 0; i <= 10; i++) {
    let randomNum = Math.floor(Math.random() * unique.length);
    uniqueId += unique.charAt(randomNum);
  }
  let date = new Date();
  let hours = date.getHours();
  let min = date.getMinutes();
  let day = date.getDay();
  day = days[day];
  let numDate = date.getDate();
  let month = date.getMonth();
  month = months[month];
  const year = date.getFullYear();

  const value = input.value;
  let fullDate = `${day} ${numDate} , ${format(hours, min)} ${year}`;
  if (value && !edit) {
    let userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    const attr = document.createAttribute("data-id");
    attr.value = uniqueId;
    userInfo.setAttributeNode(attr);
    userInfo.innerHTML = `<div>
               <h2 class="item">${value}</h2>
               <h2 class="date">Created on ${fullDate}</h2>
               </div>
               <div class="edit-delete">
                <button type="button"><i class="fas fa-edit"></i></button>
                <button type="button"><i class="fas fa-trash"></i></button>
               </div>`;
    content.appendChild(userInfo);
    action(determine, "success", "item added");
    addToStorage(uniqueId, value, fullDate);
    setBackToDefault();
  }
  if (value && edit) {
    element.innerHTML = value;
    action(determine, "success", "item edited");
    let list = getStorage();
    list = list.map((item) => {
      if (item.id === ediId) {
        item.value = value;
      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(list));
    setBackToDefault();
  }
});
// EDIT
content.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-edit")) {
    const dataId =
      e.target.parentElement.parentElement.parentElement.dataset.id;
    const userInfo = e.target.parentElement.parentElement.parentElement;
    const elementValue =
      e.target.parentElement.parentElement.parentElement.children[0]
        .children[0];
    const created =
      e.target.parentElement.parentElement.parentElement.children[0]
        .children[1];

    createdDate = created;
    edit = true;
    element = elementValue;
    ediId = dataId;
    addBtn.innerHTML = "Edit";
    input.value = elementValue.innerHTML;
  }
});

// CLASS TO ADD
function action(element, action, text) {
  element.classList.add(action);
  element.innerHTML = text;
  setTimeout(() => {
    element.classList.remove(action);
    element.innerHTML = "";
  }, 2000);
}
// REMOVE
content.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    const dataId =
      e.target.parentElement.parentElement.parentElement.dataset.id;
    const userInfo = e.target.parentElement.parentElement.parentElement;
    content.removeChild(userInfo);
    action(determine, "danger", "item removed");
    setBackToDefault();
    let list = getStorage();
    list = list.filter((item) => item.id !== dataId);
    localStorage.setItem("list", JSON.stringify(list));
  }
});

// ADD TO STORAGE

function addToStorage(id, value, date) {
  const items = { id, value, date };
  let list = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  list.push(items);
  localStorage.setItem("list", JSON.stringify(list));
}

// GET STORAGE

function getStorage() {
  let items = localStorage.getItem("list");
  if (items) {
    items = JSON.parse(localStorage.getItem("list"));
  } else {
    items = [];
  }
  return items;
}
// FORMAT

function format(hours, minutes) {
  if (hours < 10) {
    return `0${hours}:${minutes}am`;
  } else {
    return `${hours}:${minutes}pm`;
  }
}

// SET TO DEFAULT

function setBackToDefault() {
  input.value = "";
  ediId = "";
  edit = false;
  addBtn.innerHTML = "Add";
  createdDate = "";
}
// DOMLoaded

window.addEventListener("DOMContentLoaded", () => {
  let list = getStorage();
  list = list
    .map((item) => {
      const { id, value, date } = item;
      return ` <div class="user-info" data-id=${id}>
                <div>
               <h2 class="item">${value}</h2>
               <h2 class="date">Created on ${date}</h2>
               </div>
               <div class="edit-delete">
                <button type="button"><i class="fas fa-edit"></i></button>
                <button type="button"><i class="fas fa-trash"></i></button>
               </div>
           </div>`;
    })
    .join("");
  content.innerHTML = list;
});
