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
// removeEventListener
// https://medium.com/beginners-guide-to-mobile-web-development/one-off-event-listeners-in-javascript-92e19c4c0336
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
  desc: [],
  age: 0,
  expelled: false,
  squad: false
};

const settings = {
  typeOfFilter: null,
  filter: "*",
  sortBy: null,
  sortDir: "asc"
};

let cnt = 0,
  fileCounter = 0;

function start() {
  // console.log("start()");

  HTML.filter_button = document.querySelectorAll(".filter_button");
  HTML.sort_button = document.querySelectorAll(".sort_button");
  HTML.modal = document.querySelector("#modal");
  HTML.modal_content = document.querySelector(".modal_content");
  HTML.modal_name = document.querySelector(".modal_name");
  HTML.modal_gender = document.querySelector(".modal_gender");
  HTML.modal_house = document.querySelector(".modal_house");
  HTML.modal_nickname = document.querySelector(".modal_nickname");
  HTML.modal_blood = document.querySelector(".modal_blood");
  HTML.modal_profile = document.querySelector(".modal_profile");
  HTML.modal_desc = document.querySelector(".modal_desc");
  HTML.modal_close = document.querySelector(".modal_close");
  HTML.modal_buttons = document.querySelector(".modal_buttons");
  HTML.expel_button = document.querySelector(".expel_button");
  HTML.expel_alert = document.querySelector("#expel");
  HTML.expel_yes = document.querySelector("#expel [data-action='expel_yes']");
  HTML.squad_button = document.querySelector(".squad_button");
  HTML.squad_alert = document.querySelector("#squad");
  HTML.squad_toggle = document.querySelector(
    "#squad [data-action='squad_toggle']"
  );
  HTML.no_button = document.querySelectorAll("[data-action='no_button']");

  // if clicks filter only selected data
  HTML.filter_button.forEach(btn => {
    btn.addEventListener("click", filterButton);
  });

  // if clicks sort selected data (toggle asc ↔ desc)
  HTML.sort_button.forEach(btn => {
    btn.addEventListener("click", sortButton);
  });

  // activate expel button (remove, add EventListener)
  HTML.expel_button.addEventListener("click", expelButton);

  // if clicks squad button
  HTML.squad_button.addEventListener("click", squadButton);

  // if clicks no button on alert
  HTML.no_button.forEach(ele => ele.addEventListener("click", noButton));

  //if clicks close button on modal
  HTML.modal_close.addEventListener("click", closeButton);

  //if clicks outside the modal, then close the modal
  window.onclick = function(e) {
    if (e.target == HTML.modal) closeButton();
  };

  function noButton() {
    HTML.expel_alert.classList.remove("show");
    HTML.squad_alert.classList.remove("show");
  }

  function closeButton() {
    HTML.modal_name.innerHTML = "";
    HTML.modal_gender.innerHTML = "";
    HTML.modal_house.innerHTML = "";
    HTML.modal_blood.innerHTML = "";
    HTML.modal_nickname.innerHTML = "";
    HTML.modal_desc.innerHTML = "";
    HTML.modal_content.dataset.theme = "";
    HTML.modal.style.display = "none";
  }

  fileCounter = 0;
  loadStuentsJSON(url[0]);
  loadFamiliesJSON(url[1]);
}

async function loadStuentsJSON(url) {
  // console.log("loadStuentsJSON()");
  const response = await fetch(url);
  const jsonData = await response.json();
  studentsJSON = jsonData;
  itsDone();
}
async function loadFamiliesJSON(url) {
  // console.log("loadFamiliesJSON()");
  const response = await fetch(url);
  const jsonData = await response.json();
  familiesJSON = jsonData;
  itsDone();
}

function itsDone() {
  if (++fileCounter == url.length) {
    // console.log("all files loaded");
    prepareStudentObjects(studentsJSON);
  }
}

function prepareStudentObjects(jsonData) {
  // console.log("prepareStudentObjects()");

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

    student.expelled = false;
    student.squad = false;
    student.desc = [];
    student.gender = jsonObject.gender;
    student.house = student_house;
    student.blood = setBloodStatus(student.lastName, student.house);
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

  function setBloodStatus(lastName, house) {
    if (house === "Slytherin") return "Pure";
    const result = familiesJSON.half.find(e => e === lastName);
    if (result == undefined) return "Pure";
    else return "Half";
  }

  function fullnameCapitalization(fullname) {
    let i = 0,
      capitalizedFullname = "";
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
  // console.log("displayList()");

  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // console.log("displayStudent()");

  // if its expelled student, don't show up on the list
  if (settings.filter != "expelled" && student.expelled === true) return;

  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=fullname]").textContent = student.fullname;

  // querySelector Set
  HTML.text_house = clone.querySelector(".house");
  HTML.detail_button = clone.querySelector(".detail_button");

  // translate textContent to img file
  HTML.text_house.src = `img/${HTML.text_house.textContent}.PNG`;

  // if clicks detail button
  HTML.detail_button.addEventListener("click", function() {
    // show up data on modal
    if (student.expelled) HTML.expel_button.style.display = "none";
    if (student.blood != "Pure") HTML.squad_button.style.display = "none";
    HTML.modal_name.innerHTML = student.fullname;
    HTML.modal_nickname.innerHTML =
      student.nickName === "" ? "" : `&nbsp;${student.nickName}`;
    HTML.modal_gender.innerHTML = student.gender == "boy" ? "♂" : "♀";
    HTML.modal_house.innerHTML = student.house;
    HTML.modal_blood.innerHTML = student.blood;
    HTML.modal_profile.src = student.profile;
    if (student.desc.length != 0) {
      HTML.modal_desc.innerHTML = "";
      for (let i = 0; i < student.desc.length; i++)
        HTML.modal_desc.innerHTML += `- ${student.desc[i]} <br>`;
    } else HTML.modal_desc.innerHTML = `Nothing`;
    HTML.modal_content.dataset.theme = student.house;
    HTML.modal_buttons.dataset.student = student.fullname;
    HTML.modal.style.display = "block";
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function expelButton() {
  const student = students.find(
    ele => ele.fullname === HTML.modal_buttons.dataset.student
  );
  HTML.expel_alert.classList.add("show");
  HTML.expel_yes.addEventListener("click", expelYes);

  function expelYes() {
    student.expelled = true;
    student.desc.push(`Expelled from Hogwarts since ${getCurrentDate()}`);
    HTML.expel_alert.classList.remove("show");
    HTML.expel_yes.removeEventListener("click", expelYes);
    HTML.modal.style.display = "none";
    displayList(sortStudentsByData());
  }
}

function squadButton() {
  const student = students.find(
    ele => ele.fullname === HTML.modal_buttons.dataset.student
  );

  if (student.squad)
    document.querySelector("#squad h1").innerText =
      "Do you want to remove this student from inquisitorial squad?";
  else
    document.querySelector("#squad h1").innerText =
      "Do you want to add this student to inquisitorial squad?";

  HTML.squad_alert.classList.add("show");
  HTML.squad_toggle.addEventListener("click", squadToggle);

  function squadToggle() {
    student.squad = !student.squad;
    if (student.squad)
      student.desc.push(
        `Became a Inquisitorial Squad Member since ${getCurrentDate()}`
      );
    else
      student.desc.push(
        `Came out from Inquisitorial Squad at ${getCurrentDate()}`
      );
    HTML.squad_alert.classList.remove("show");
    HTML.squad_toggle.removeEventListener("click", squadToggle);
    HTML.modal.style.display = "none";
    displayList(sortStudentsByData());
  }
}

function filterStudentsByHouse(house) {
  let result;
  if (house === "*") result = students;
  else result = students.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === house) return true;
    else return false;
  }
  return result;
}

function filterExpelledStudents() {
  const result = students.filter(filterFunction);

  function filterFunction(student) {
    if (student.expelled === true) return true;
    else return false;
  }
  return result;
}

function filterButton(e) {
  settings.typeOfFilter = e.target.dataset.type;

  if (settings.sortBy != null) {
    document
      .querySelector(`[data-sort="${settings.sortBy}"]`)
      .classList.remove("clicked");
    document.querySelector(`[data-sort="${settings.sortBy}"]`).dataset.action =
      "";
    document.querySelector(
      `[data-sort="${settings.sortBy}"]`
    ).dataset.sortDirection = "asc";
  }
  settings.sortBy = null;
  settings.sortDir = "asc";

  document
    .querySelector(`[data-filter="${settings.filter}"]`)
    .classList.remove("clicked");
  settings.filter = e.target.dataset.filter;
  document
    .querySelector(`[data-filter="${settings.filter}"]`)
    .classList.add("clicked");
  if (settings.filter === "*") displayList(students);
  else if (settings.typeOfFilter === "house")
    displayList(filterStudentsByHouse(settings.filter));
  else if (settings.typeOfFilter === "expelled")
    displayList(filterExpelledStudents());
}

function sortStudentsByData() {
  const filtered_list =
    settings.typeOfFilter == "expelled"
      ? filterExpelledStudents()
      : filterStudentsByHouse(settings.filter);
  const dir = settings.sortDir === "desc" ? 1 : -1;

  return filtered_list.sort((a, b) =>
    a[settings.sortBy] < b[settings.sortBy] ? dir : dir * -1
  );
}

function sortButton(e) {
  if (settings.sortBy != e.target.dataset.sort) {
    if (settings.sortBy != null) {
      document
        .querySelector(`[data-sort="${settings.sortBy}"]`)
        .classList.remove("clicked");
      document.querySelector(
        `[data-sort="${settings.sortBy}"]`
      ).dataset.action = "";
    }
    settings.sortBy = e.target.dataset.sort;
    e.target.dataset.sortDirection = "asc";
    settings.sortDir = "asc";

    document
      .querySelector(`[data-sort="${settings.sortBy}"]`)
      .classList.add("clicked");
  } else {
    e.target.dataset.sortDirection =
      settings.sortDir === "asc" ? "desc" : "asc";
    settings.sortDir = e.target.dataset.sortDirection;
  }

  e.target.dataset.action = "sorted";
  displayList(sortStudentsByData());
}

function getCurrentDate() {
  const today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"),
    yyyy = today.getFullYear();

  return dd + "/" + mm + "/" + yyyy;
}
