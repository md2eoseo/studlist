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

const file = "./students1991.json";

function readFile() {
  fetch(file)
    .then(response => {
      return response.json();
    })
    .then(students => {
      // Work with JSON data here
      // console.log(students[0].house);

      if ("content" in document.createElement("template")) {
        const student = document.querySelector("#student");
        const table = document.querySelector("tbody");

        students.forEach(e => {
          let clone = document.importNode(student.content, true);

          // td = clone.querySelectorAll("td");
          house = clone.querySelector("img");
          fullname = clone.querySelector("h3");
          // console.log(house, fullname);

          if (e.house == "Gryffindor") house.src = "gryffindor.png";
          if (e.house == "Hufflepuff") house.src = "hufflepuff.png";
          if (e.house == "Ravenclaw") house.src = "ravenclaw.png";
          if (e.house == "Slytherin") house.src = "slytherin.png";

          // textContent에는 스크립트를 작성할 수 있어서 위험 --> innerHTML 사용 권장
          // td[0].textContent = students.house;
          // td[1].textContent = students.fullname;
          house.innerHTML = e.house;
          fullname.innerHTML = e.fullname;

          table.appendChild(clone);
        });
      }

      const modal = document.querySelector(".modal");
      const btn = document.querySelectorAll(".btn_detail");
      const btnsArr = Array.from(btn);
      const modal_name = document.querySelector(".modal_name");
      const modal_house = document.querySelector(".modal_house");
      const span = document.querySelector(".close");

      btnsArr.forEach(function(e, index) {
        e.onclick = function() {
          modal_name.innerHTML = students[index].fullname;
          modal_house.innerHTML = students[index].house;
          document.querySelector(".modal_content").dataset.theme =
            students[index].house;
          modal.style.display = "block";
        };
      });

      span.onclick = function() {
        modal.style.display = "none";
      };

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };

      document
        .querySelector("select#theme")
        .addEventListener("change", selected);
      function selected() {
        const selectedTheme = this.value;
        document.querySelector(".modal_content").dataset.theme = selectedTheme;
      }
    })
    .catch(err => {
      // Do something for an error here
    });
}

readFile();
