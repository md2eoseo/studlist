"use strict";
// loading json file
// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
// Access to XMLHttpRequest from origin 'null' has been blocked by CORS policy
// https://www.sololearn.com/Discuss/1735780/xmlhttprequest-blocked-by-cors-policy
// array.foreach
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// array.foreach index
// https://gomakethings.com/es6-foreach-loops-with-vanilla-javascript/
// fetching json file
// https://stackoverflow.com/questions/51859358/how-to-read-json-file-with-fetch-in-javascript
window.addEventListener("DOMContentLoaded", start);

const HTML = {};
const url = [
  "http://petlatkea.dk/2020/hogwarts/students.json",
  "http://petlatkea.dk/2020/hogwarts/families.json"
];
let studentsJSON;
let familiesJSON;
const students = [];
const families = [];
const Student = {
  fullname: "",
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  house: "",
  fileName: "",
  desc: "",
  age: 0
};

let i = 0,
  cnt = 0,
  fileCounter = 0;

function start() {
  console.log("start()");

  fileCounter = 0;
  loadStuentsJSON(url[0]);
  loadFamiliesJSON(url[1]);
}

async function loadStuentsJSON(url) {
  console.log("loadStuentsJSON()");
  const response = await fetch(url);
  const jsonData = await response.json();
  studentsJSON = jsonData;
  itsDone();
}
async function loadFamiliesJSON(url) {
  console.log("loadFamiliesJSON()");
  const response = await fetch(url);
  const jsonData = await response.json();
  familiesJSON = jsonData;
  itsDone();
}

function itsDone() {
  if (++fileCounter == url.length) {
    console.log("all files loaded");
    prepareStudentObjects(studentsJSON);
  }
}

function prepareStudentObjects(jsonData) {
  console.log("prepareStudentObjects()");

  jsonData.forEach(jsonObject => {
    // Create new object with cleaned data - and store that in the students array
    const student = Object.create(Student);
    const student_fullname = fullnameCapitalization(jsonObject.fullname);
    const student_house = houseCapitalization(jsonObject.house);

    // store data in Student object
    student.fullname = student_fullname;
    student.firstName = student_fullname.substring(
      0,
      student_fullname.indexOf(" ")
    );
    student.lastName = student_fullname.substring(
      student_fullname.lastIndexOf(" ")
    );
    student.middleName = student_fullname.substring(
      student_fullname.indexOf(" ") + 1,
      student_fullname.lastIndexOf(" ")
    );
    student.house = student_house;
    student.gender = jsonObject.gender;

    students.push(student);
  });

  function fullnameCapitalization(fullname) {
    let capitalizedFullname = "";
    for (i = 0; i < fullname.length - 1; i++) {
      if (fullname[i] == " " || fullname[i] == "-" || fullname[i] == '"') {
        capitalizedFullname += fullname[i];
        while (
          fullname[i + 1] == " " ||
          fullname[i + 1] == "-" ||
          fullname[i + 1] == '"'
        ) {
          capitalizedFullname += fullname[++i];
        }
        capitalizedFullname += fullname[++i].toUpperCase();
      } else if (i == 0) capitalizedFullname += fullname[i].toUpperCase();
      else capitalizedFullname += fullname[i].toLowerCase();
    }
    if (fullname.length - 1 == i)
      capitalizedFullname += fullname[i].toLowerCase();
    cnt = 0;
    for (i = 0; ; i++) {
      if (
        capitalizedFullname[i] == " " ||
        capitalizedFullname[i] == "-" ||
        capitalizedFullname[i] == '"'
      )
        cnt++;
      else break;
    }
    if (cnt > 0) capitalizedFullname = capitalizedFullname.substring(cnt);
    return capitalizedFullname;
  }

  function houseCapitalization(house) {
    return (
      house.trim()[0].toUpperCase() +
      house
        .trim()
        .substring(1)
        .toLowerCase()
    );
  }

  displayList();
}

function displayList() {
  console.log("displayList()");

  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);

  setting();
}

function displayStudent(student) {
  console.log("displayStudent()");

  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=fullname]").textContent = student.fullname;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function setting() {
  HTML.text_house = document.querySelectorAll(".house");
  const texts_house = Array.from(HTML.text_house);
  HTML.btn_detail = document.querySelectorAll(".btn_detail");
  const btns_detail = Array.from(HTML.btn_detail);
  HTML.modal = document.querySelector(".modal");
  HTML.modal_content = document.querySelector(".modal_content");
  HTML.modal_name = document.querySelector(".modal_name");
  HTML.modal_house = document.querySelector(".modal_house");
  HTML.modal_close = document.querySelector(".modal_close");

  // translate textContent to img file
  texts_house.forEach(e => {
    if (e.textContent == "Gryffindor") e.src = "img/gryffindor.PNG";
    if (e.textContent == "Hufflepuff") e.src = "img/hufflepuff.PNG";
    if (e.textContent == "Ravenclaw") e.src = "img/ravenclaw.PNG";
    if (e.textContent == "Slytherin") e.src = "img/slytherin.PNG";
  });

  // if clicks detail button
  btns_detail.forEach((e, i) => {
    e.onclick = function() {
      console.log(students[i].fullname);
      HTML.modal_name.innerHTML = students[i].fullname;
      HTML.modal_house.innerHTML = students[i].house;
      HTML.modal_content.dataset.theme = students[i].house;
      HTML.modal.style.display = "block";
    };
  });

  //if clicks close button on modal
  HTML.modal_close.onclick = function() {
    HTML.modal_name.innerHTML = "";
    HTML.modal_house.innerHTML = "";
    HTML.modal_content.dataset.theme = "";
    HTML.modal.style.display = "none";
  };

  //if clicks outside the modal, then close the modal
  window.onclick = function(e) {
    if (e.target == HTML.modal) {
      HTML.modal_name.innerHTML = "";
      HTML.modal_house.innerHTML = "";
      HTML.modal_content.dataset.theme = "";
      HTML.modal.style.display = "none";
    }
  };
}
