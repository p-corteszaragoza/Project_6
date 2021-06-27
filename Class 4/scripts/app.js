var important;
var taskArray = [];
var myTask = [];
var index;
var serverUrl = "https://fsdiapi.azurewebsites.net/";

function toogleImportant() {
  console.log("Click on important icon");
  if (!important) {
    important = true;
    $("#iconImportant").removeClass("far").addClass("fas");
  } else {
    important = false;
    $("#iconImportant").removeClass("fas").addClass("far");
  }
}

function saveTask() {
  console.log("Task has been saved");
  // Read values from controls
  let title = $("#txtTitle").val();
  let description = $("#txtDescription").val();
  let category = $("#selCategory").val();
  let location = $("#txtLocation").val();
  let date = $("#txtDueDate").val();
  let color = $("#txtColor").val();

  // Create an object
  let task = new Task(
    title,
    important,
    description,
    category,
    location,
    date,
    color,
    1
  );
  console.log("task ", task);

  // Send object to a backend server
  taskArray.push(task);
  console.log("Registro ", taskArray);
  console.log("task ", JSON.stringify(task));

  $.ajax({
    url: serverUrl + "api/tasks/",
    type: "POST",
    data: JSON.stringify(task),
    contentType: "application/json",
    success: function (res) {
      console.log("Server says: ", res);
      let task = JSON.parse(res);
      myTask.push(task);
      //  Display the task
      displayTask(task);
      clearForm();
    },
    error: function (eDetails) {
      console.log("Error: ", eDetails);
    },
  });
}

function doneTask(id) {
  console.log("Click on card id: " + id);
  // Get the object
  for (let i = 0; i < myTask.length; i++) {
    let task = myTask[i];
    if (task._id == id) {
      console.log(task.title);
      task.status = 2;

      $.ajax({
        url: serverUrl + "api/tasks",
        type: "PUT",
        data: JSON.stringify(task),
        contentType: "application/json",
        success: function (res) {
          console.log("Response: " + res);

          // remove the task from the pending list
          $(`#${id}`).remove();

          // display the task on the done list
          displayTask(task);
        },
        error: function (eDetails) {
          console.log("Error: " + eDetails);
        },
      });
    }
  }
  // update the status
  // send if on a PUT request

  //AJAX PUT
  //url: serverUrl + "api/task"
}

function displayTask(task) {
  let syntaxPart1 = `<div id="${task._id}" class="important task important-container"> `;
  let syntaxPart2 = ` <div class="description">`;
  if (task.important) {
    syntaxPart2 += `<i class="fas fa-star"></i></h4>`;
  } else {
    syntaxPart2 += `<i class="far fa-star"></i></h4>`;
  }

  let syntaxPart3 = `       
                <h5>${task.title}</h5>
                <p>${task.description}</p>
            </div>
            <label class="due-date">${task.date}</label>
            <label class="location">${task.location}</label>`;

  if (task.status == 1) {
    syntaxPart3 += `<button onclick="doneTask('${task._id}')" class="btn btn-sm btn-primary">Done</button></div>`;
    $("#pendingList").append(syntaxPart1 + syntaxPart2 + syntaxPart3);
  } else if (task.status == 2) {
    syntaxPart3 += `<button onclick="removeTask('${task._id}')" class="btn btn-sm btn-danger">Remove</button></div>`;
    $("#doneList").append(syntaxPart1 + syntaxPart2 + syntaxPart3);
    $("#" + `${task._id}`).css({
      "border-left": ".5rem solid " + `${task.color}`,
    });
  }
}

function removeTask(id) {
  // Get the object
  for (let i = 0; i < myTask.length; i++) {
    let task = myTask[i];
    if (task._id == id) {
      console.log(task.title);
      task.status = 3;

      $.ajax({
        url: serverUrl + "api/tasks",
        type: "PUT",
        data: JSON.stringify(task),
        contentType: "application/json",
        success: function (res) {
          console.log("Response: " + res);

          // remove the task from the pending list
          $(`#${id}`).remove();
        },
        error: function (eDetails) {
          console.log("Error: " + eDetails);
        },
      });
    }
  }
}

function clearForm() {
  $("#txtTitle").val("");
  $("#txtDescription").val("");
  $("#selCategory").val("");
  $("#txtLocation").val("");
  $("#txtDueDate").val("");
  $("#txtColor").val("#000000");
}

function fetchTask() {
  /*
   * GET request
   * url: serverUrl + "api/task/,"
   * response will be a json string
   * parse string -> array with objects
   * travel the array send each object to display
   */

  $.ajax({
    url: serverUrl + "api/tasks",
    type: "GET",
    success: function (res) {
      console.log("Server says: ", res.data);
      let data = JSON.parse(res);
      for (let i = 0; i < data.length; i++) {
        let task = data[i];
        if (task.name == "Paola") {
          myTask.push(task);
          displayTask(task);
        }
      }
    },
    error: function (eDetails) {
      console.log("Error: ", eDetails);
    },
  });
}

function init() {
  console.log("My task Manager");
  // Load data
  index = 0;
  important = false;
  fetchTask();

  // Hook events
  $("#iconImportant").click(toogleImportant);
  $("#btnSave").click(saveTask);
}

window.onload = init;
