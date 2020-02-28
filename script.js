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
  blood: "",
  gender: "",
  house: "",
  profile: "",
  desc: "",
  age: 0
};

const settings = {
  filter: null,
  sortBy: null,
  sortDir: "asc"
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
    let student_fullname = fullnameCapitalization(jsonObject.fullname);
    const student_house = houseCapitalization(jsonObject.house);

    // store data in Student object
    student.nickName = "";
    if (student_fullname.indexOf('"') != -1) {
      student.nickName = student_fullname.substring(
        student_fullname.indexOf('"') - 1,
        student_fullname.lastIndexOf('"') + 2
      );
      student_fullname = student_fullname.replace(student.nickName, " ");
      student.nickName = student.nickName.trim();
    }
    student.fullname = student_fullname;

    student.firstName = student_fullname.substring(
      0,
      student_fullname.indexOf(" ")
    );
    if (student.fullname.search("-") != -1) {
      student.lastName = student_fullname.substring(
        student_fullname.lastIndexOf("-") + 1
      );
      student.middleName = student_fullname.substring(
        student_fullname.indexOf(" ") + 1,
        student_fullname.lastIndexOf("-")
      );
    } else {
      student.lastName = student_fullname.substring(
        student_fullname.lastIndexOf(" ") + 1
      );
      student.middleName = student_fullname.substring(
        student_fullname.indexOf(" ") + 1,
        student_fullname.lastIndexOf(" ")
      );
    }

    student.gender = jsonObject.gender;
    student.house = student_house;
    student.blood = setBloodStatus(student.lastName) ? "Half" : "Pure";
    student.profile = setProfileName(student.lastName, student.firstName);

    students.push(student);
  });

  function setProfileName(lastName, firstName) {
    let sameLastName = false;
    students.forEach(student => {
      if (student.lastName === lastName) {
        sameLastName = true;
        student.profile = `profile/${lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
      }
    });

    if (sameLastName)
      return `profile/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
    else
      return `profile/${lastName.toLowerCase()}_${firstName
        .substring(0, 1)
        .toLowerCase()}.png`;
  }

  function setBloodStatus(lastName) {
    const result = familiesJSON.half.find(e => e === lastName);
    if (result == undefined) return false;
    else return true;
  }

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
    return capitalizedFullname.trim();
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

  displayList(students);
}

function displayList(students) {
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
  // querySelector Set
  HTML.filter_button = document.querySelectorAll(".filter_button");
  HTML.text_house = document.querySelectorAll(".house");
  HTML.detail_button = document.querySelectorAll(".detail_button");
  HTML.modal = document.querySelector("#modal");
  HTML.modal_content = document.querySelector(".modal_content");
  HTML.modal_name = document.querySelector(".modal_name");
  HTML.modal_gender = document.querySelector(".modal_gender");
  HTML.modal_house = document.querySelector(".modal_house");
  HTML.modal_nickname = document.querySelector(".modal_nickname");
  HTML.modal_blood = document.querySelector(".modal_blood");
  HTML.modal_profile = document.querySelector(".modal_profile");
  HTML.modal_close = document.querySelector(".modal_close");

  // if clicks filter only selected data
  HTML.filter_button.forEach(btn => {
    btn.addEventListener("click", filterButton);
  });

  // translate textContent to img file
  HTML.text_house.forEach(e => (e.src = `img/${e.textContent}.PNG`));

  // if clicks detail button
  HTML.detail_button.forEach((e, i) => {
    e.onclick = function() {
      console.log(students[i].fullname);

      // show up data on modal
      HTML.modal_name.innerHTML = students[i].fullname;
      HTML.modal_nickname.innerHTML =
        students[i].nickName === "" ? "" : `&nbsp;${students[i].nickName}`;
      HTML.modal_gender.innerHTML = students[i].gender == "boy" ? "♂" : "♀";
      HTML.modal_house.innerHTML = students[i].house;
      HTML.modal_blood.innerHTML = students[i].blood;
      HTML.modal_profile.src = students[i].profile;
      HTML.modal_content.dataset.theme = students[i].house;
      HTML.modal.style.display = "block";
    };
  });

  //if clicks close button on modal
  HTML.modal_close.addEventListener("click", closeButton);

  //if clicks outside the modal, then close the modal
  window.onclick = function(e) {
    if (e.target == HTML.modal) closeButton();
  };

  function filterStudentsByHouse(house) {
    const result = students.filter(filterFunction);

    function filterFunction(student) {
      if (student.house === house) return true;
      else return false;
    }
    return result;
  }

  function filterButton(e) {
    let selected_type = e.target.dataset.type,
      selected_data = e.target.dataset.house;
    console.log("filter type : " + selected_data);
    if (selected_data === "*") displayList(students);
    else if (selected_type === "house")
      displayList(filterStudentsByHouse(selected_data));
  }

  function closeButton() {
    HTML.modal_name.innerHTML = "";
    HTML.modal_gender.innerHTML = "";
    HTML.modal_house.innerHTML = "";
    HTML.modal_blood.innerHTML = "";
    HTML.modal_nickname.innerHTML = "";
    HTML.modal_content.dataset.theme = "";
    HTML.modal.style.display = "none";
  }
}
