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

"use strict";
window.addEventListener("DOMContentLoaded", loadJSON);

const file = "./students.json";
const HTML = {};
const students = [];
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
  cnt = 0;

function start() {
  console.log("start()");

  HTML.text_house = document.querySelectorAll(".house");
  const texts_house = Array.from(HTML.text_house);
  HTML.modal = document.querySelector(".modal");
  HTML.btn_detail = document.querySelectorAll(".btn_detail");
  const btns_detailArr = Array.from(HTML.btn_detail);
  HTML.modal_content = document.querySelector(".modal_content");
  HTML.modal_name = document.querySelector(".modal_name");
  HTML.modal_house = document.querySelector(".modal_house");
  HTML.modal_close = document.querySelector(".modal_close");

  texts_house.forEach(function(e, index) {
    if (e.textContent == "Gryffindor") e.src = "./Gryffindor.png";
    if (e.textContent == "Hufflepuff") e.src = "./Hufflepuff.png";
    if (e.textContent == "Ravenclaw") e.src = "./Ravenclaw.png";
    if (e.textContent == "Slytherin") e.src = "./Slytherin.png";
  });

  btns_detailArr.forEach(function(e, index) {
    e.onclick = function() {
      console.log(index);
      HTML.modal_name.innerHTML = students[index].fullname;
      HTML.modal_house.innerHTML = students[index].house;
      HTML.modal_content.dataset.theme = students[index].house;
      HTML.modal.style.display = "block";
    };
  });

  HTML.modal_close.onclick = function() {
    HTML.modal.style.display = "none";
  };

  window.onclick = function(e) {
    if (e.target == HTML.modal) {
      HTML.modal.style.display = "none";
    }
  };

  document
    .querySelector("select#theme")
    .addEventListener("change", selectedTheme);
  function selectedTheme() {
    const selectedTheme = this.value;
    HTML.modal_content.dataset.theme = selectedTheme;
  }

  // loadJSON();
}

function loadJSON() {
  console.log("loadJSON()");

  fetch(file)
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    })
    .catch(err => {
      // Do something for an error here
      console.log("cannot fetch JSON file!!!");
    });
}

function prepareObjects(jsonData) {
  console.log("prepareObjects()");

  jsonData.forEach(jsonObject => {
    // TODO: Create new object with cleaned data - and store that in the students array
    const student = Object.create(Student);
    let str = jsonObject.fullname;
    let newstr = "";

    // TODO: fullname Capitalization
    for (i = 0; i < str.length - 1; i++) {
      if (str[i] == " " || str[i] == "-" || str[i] == '"') {
        newstr += str[i];
        while (str[i + 1] == " " || str[i + 1] == "-" || str[i + 1] == '"') {
          newstr += str[++i];
        }
        newstr += str[++i].toUpperCase();
      } else if (i == 0) newstr += str[i].toUpperCase();
      else newstr += str[i].toLowerCase();
    }
    if (str.length - 1 == i) newstr += str[i].toLowerCase();
    cnt = 0;
    for (i = 0; ; i++) {
      if (newstr[i] == " " || newstr[i] == "-" || newstr[i] == '"') cnt++;
      else break;
    }
    if (cnt > 0) newstr = newstr.substring(cnt);
    const student_fullname = newstr;

    // TODO: house Capitalization
    str = jsonObject.house;
    const student_house =
      str.trim()[0].toUpperCase() +
      str
        .trim()
        .substring(1)
        .toLowerCase();

    // TODO: store data in Student object

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

  displayList();
}

function displayList() {
  console.log("displayList()");

  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);

  start();
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
