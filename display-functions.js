//Loop over the IDs in objectIds to turn them into objects, then create a column of checkboxes or radio buttons for each object, labeled by the id of that object with the <countField> of the object in parentheses. Color the nameField and countField appropriately. If the buttons are already present and are being replaced, keep track of their checked status and persist it in the new buttons.

function makeButtons(objects, objectIds, counts, type, nameField, name, onchange, title, destination) {
    var string,
        count,
        id,
        statusArray = [];
    buttons = document.getElementsByName(name);
    if (buttons.length > 0) {
        for (var y = 0; y < buttons.length; y++) {
            myStatus = {
                id: buttons[y].id,
                checked: buttons[y].checked
            };
            statusArray.push(myStatus);
        }
    }

    if (title == "Guide-hint-received") {
        title = "<span style=\"color:red\">" + title + "</span>";
    }
    if (title == "Guide-remediation-requested") {
        title = "<span style=\"color:blue\">" + title + "</span>";
    }

    if (objectIds.length == 0) {
        destination.innerHTML = "";
    } else {
        destination.innerHTML = "<b>" + title + "</b><br>";
        destination.innerHTML += "<input type='checkbox' + name = " + name + " onchange='toggleSelectAll(\"" + name + "\");'></input> all/none<br>"
        for (var m = 0; m < objectIds.length; m++) {
            object = objects[m];
            id = objectIds[m];
            count = counts[m];
            string = setColorCode(object, nameField);
            for (var j = 0; j < statusArray.length; j++) {
                if (statusArray[j].id == id) {
                    buttonChecked = statusArray[j].checked;
                }
            }
            destination.innerHTML += "<input type=" + type + " id= " + id + " name=" + name + " onchange=" + onchange + "></input> " + string + " (" + counts[m] + ")<br>";
        }
        var newButtons = document.getElementsByName(name);
        for (var x = 0; x < newButtons.length; x++) {
            newButtons[x].checked = false;
            for (var y = 0; y < statusArray.length; y++) {
                if (newButtons[x].id == statusArray[y].id) {
                    newButtons[x].checked = statusArray[y].checked;
                }
            }
        }
    }
}

function toggleSelectAll(checkboxName) {
    var checkboxArray = document.getElementsByName(checkboxName);
    if (checkboxArray[0].checked) {
        for (var i = 0; i < checkboxArray.length - 1; i++) {
            checkboxArray[i + 1].checked = true;
        }
    } else {
        for (var j = 0; j < checkboxArray.length - 1; j++) {
            checkboxArray[j + 1].checked = false;
        }
    }
    setSelectedObjects();
}

function showTeachers() {
    var teachers = [],
        t,
        id,
        counts = [],
        classIds = [];
    teacherIds = Object.keys(teachersObj);
    for (var i = 0; i < teacherIds.length; i++) {
        id = teacherIds[i];
        t = teachersObj[id];
        teachers.push(t);
        classIds = Object.keys(t.classesObj);
        counts.push(classIds.length);
    }
    makeButtons(teachers, teacherIds, counts, "checkbox", "id", "teacherButton", "showClasses()", "Teachers", teachersPara);
    showClasses();
}


function showClasses() { //Sets up the classes checkboxes for all classes contained in the uploaded files. Span contains the number of students in each class; onchange runs "showStudents"
    var classes = [], //all class objects of selected teachers
        classIds = [], //all class ids of selected teachers
        counts = []; //array of student counts ofeach class
    setSelectedObjects();
    if (selectedTeachers.length == 0) {
        classesPara.innerHTML = "";
        studentsPara.innerHTML = "";
        activitiesPara.innerHTML = "";
        eventsPara.innerHTML = "";
        actionsPara.innerHTML = "";
    } else {
        for (var i = 0; i < selectedTeachers.length; i++) {
            myTeacher = selectedTeachers[i];
            for (var j = 0; j < myTeacher.classIds.length; j++) {
                myClassId = myTeacher.classIds[j];
                myClass = myTeacher.classesObj[myClassId];
                if (myClass) { //Have to check because some classes have been pruned
                    studentIds = Object.keys(myClass.studentsObj);
                    myCount = studentIds.length;
                    classIds.push(myClassId);
                    classes.push(myClass);
                    counts.push(myCount);
                }
            }
            makeButtons(classes, classIds, counts, "checkbox", "id", "classButton", "showStudents()", "Class IDs", classesPara);
        }
    }
    showStudents();
}

function showStudents() { //Sets up the students checkboxes which are labeled with the ids of the students. Eventually there will be one checkbox for each student enrolled in at least one of the selected classes. The span fields contain the number of activities engaged in by each student; onchange runs "showActivities"

    var students = [], //all student objects of selected classes
        studentIds = [], //all student ids of selected classes
        counts = [];
    setSelectedObjects();
    if (selectedClasses.length == 0) {
        studentsPara.innerHTML = "";
        activitiesPara.innerHTML = "";
        eventsPara.innerHTML = "";
        actionsPara.innerHTML = "";
    } else {
        for (var i = 0; i < selectedClasses.length; i++) {
            myClass = selectedClasses[i];
            for (var j = 0; j < myClass.studentIds.length; j++) {
                myStudentId = myClass.studentIds[j];
                myStudent = myClass.studentsObj[myStudentId];
                myCount = myStudent.activityIds.length;
                studentIds.push(myStudentId);
                students.push(myStudent);
                counts.push(myCount);
            }
        }
        makeButtons(students, studentIds, counts, "checkbox", "id", "studentButton", "showActivities()", "Student IDs", studentsPara);
    }
    showActivities();
}

function showActivities() { //Sets up the activites checkboxes, which are labeled with the names of the intersection of the activities engaged by all the selected students. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
    var tableButton = document.getElementById("tableButton");
    var intersectingActivityNames = [],
        intersectingActivities = [],
        activityNamesByStudent = [],
        counts = [];
    setSelectedObjects();
    if (selectedStudents.length == 0) {
        activitiesPara.innerHTML = "";
        eventsPara.innerHTML = "";
        actionsPara.innerHTML = "";
        tableButton.style.display = "none";
    } else {
        //Run over the activities fields for those students and collect the intersection of the names of those activities
        tableButton.style.display = "block";
        for (var i = 0; i < selectedStudents.length; i++) {
            myStudent = selectedStudents[i];
            activityNamesByStudent[i] = myStudent.activityNames;
            activityNamesByStudent[i].sort(function (a, b) {
                var x = a.toLowerCase();
                var y = b.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            })
        }
        intersectingActivityNames = activityNamesByStudent[0]; //Start with the first element and iteratively compare to all the others in names
        for (var j = 1; j < activityNamesByStudent.length; j++) { //start with the second element
            intersectingActivityNames = intersection(intersectingActivityNames, activityNamesByStudent[j]);
        }
        for (var k = 0; k < intersectingActivityNames.length; k++) {
            intersectingActivities[k] = myStudent.activitiesObj[intersectingActivityNames[k]];
            counts[k] = intersectingActivities[k].eventNames.length;
        }
        makeButtons(intersectingActivities, intersectingActivityNames, counts, "checkbox", "name", "activityButton", "showEvents()", "Activities", activitiesPara);
    }
    showEvents();
}

function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
    var intersectingEventNames = [],
        intersectingEvents = [],
        eventNamesByStudent = [],
        counts = [];
    setSelectedObjects();
    if (selectedActivities.length == 0) {
        eventsPara.innerHTML = "";
        actionsPara.innerHTML = "";
    } else {
        for (var i = 0; i < selectedActivities.length; i++) {
            myActivity = selectedActivities[i];
            eventNamesByStudent[i] = myActivity.eventNames;
            eventNamesByStudent[i].sort(function (a, b) {
                var x = a.toLowerCase();
                var y = b.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
        }
        intersectingEventNames = eventNamesByStudent[0]; //Start with the first element and iteratively compare to all the others in names
        for (var j = 1; j < eventNamesByStudent.length; j++) { //start with the second element
            intersectingEventNames = intersection(intersectingEventNames, eventNamesByStudent[j]);
        }
        for (var k = 0; k < intersectingEventNames.length; k++) {
            intersectingEvents[k] = myActivity.eventsObj[intersectingEventNames[k]];
            counts[k] = intersectingEvents[k].actions.length;
        }
        makeButtons(intersectingEvents, intersectingEventNames, counts, "checkbox", "name", "eventButton", "showActions()", "Events", eventsPara);
    }
    showActions();
}

function showActions() {
    var myEvent,
        myAction,
        myFields;
    setSelectedObjects();
    if (selectedEvents.length == 0) {
        actionsPara.innerHTML = "";
    } else {
        actionsPara.innerHTML = "<b>Actions</b><br>";
        selectedActions = [];
        for (var i = 0; i < selectedEvents.length; i++) {
            myEvent = selectedEvents[i];
            for (var j = 0; j < myEvent.actions.length; j++) {
                myAction = myEvent.actions[j];
                myAction.unixTime = new Date(myAction.time).getTime();
                selectedActions.push(myAction);
            }
        }
        selectedActions.sort(function (a, b) {
            return a.unixTime - b.unixTime;
        })
        for (var k = 0; k < selectedActions.length; k++) {
            myAction = selectedActions[k];
            myParameters = myAction.parameters;
            myFields = Object.getOwnPropertyNames(myParameters);
            actionsPara.innerHTML += ("<br><b>" + myAction.index + ": " + myAction.event + " at " + myAction.time + "</b><br>");
            //      if (myAction.description) {
            //        actionsPara.innerHTML += myAction.description;
            //  } else {
            for (var l = 0; l < myFields.length; l++) {
                myField = myFields[l];
                actionsPara.innerHTML += (myField + ":" + myParameters[myField] + "<br>");
            }
            actionsPara.innerHTML += probsList(myAction) + "<br>";
        }
    }
}

function toggleTable() {
    var tableButton = document.getElementById("tableButton");
    var table = document.getElementById("probTable");
    var tableSpan = document.getElementById("tableSpan");
    if (tableSpan.textContent == "Show table") {
        tableSpan.textContent = "Hide table";
        table.style.display = "inline";
        makeProbTable("selected");
    } else {
        tableSpan.textContent = "Show table";
        table.style.display = "none";
    }
}

function makeProbTable(string) {
    if (string == "all") {
        var ss = students;
    } else {
        setSelectedObjects();
        var ss = selectedStudents;
    }
    for (var i = 0; i < ss.length; i++) {
        myStudent = ss[i];
        console.log("Working on student " + i + " of " + ss.length);
        var actNames = myStudent.activityNames
        actNames.sort(function (a, b) {
            var acts = myStudent.activitiesObj;
            return acts[a].startTime - acts[b].startTime;
        });
        for (var j = 0; j < actNames.length; j++) {
            myActivityName = actNames[j];
            myActivity = myStudent.activitiesObj[myActivityName];
            myEvent = myActivity.eventsObj["ITS-Data-Updated"];
            if (myEvent) { //Some activities – e.g., the tutorial – don't have events
                myActions = myEvent.actions;
                for (var k = 0; k < myActions.length; k++) {
                    myAction = myActions[k];
                    addCSVRow(myStudent, myActivity, myEvent, myAction);
                }
            }
        }
    }
}

function downloadFile() {
    var nameInput = document.getElementById("csvFileName");
    var fileName = nameInput.value;
    var header = document.getElementById("probHeaderRow");
    var table = document.getElementById("probTable");
    makeProbTable("all");
    csvFile = tableToCSV(header, table);
    saveData()(csvFile, fileName);
}

function saveData(data, name) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {
            type: "text/csv;encoding:utf-8"
        });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

function addCSVRow(myStudent, myActivity, myEvent, myAction) {
    var index = myAction.index
    var myClass = myStudent.class,
        myTeacher = myClass.teacher;
    var probDiv = document.getElementById("probDiv");
    probDiv.style.display = "block";
    probTable = document.getElementById("probTable");
    var probRow = document.createElement("tr");
    var teacherCell = document.createElement("td");
    var classCell = document.createElement("td");
    var studentCell = document.createElement("td");
    var dateCell = document.createElement("td");
    var timeCell = document.createElement("td");
    var challengeCell = document.createElement("td");
    var indexCell = document.createElement("td");
    var priorActionCell = document.createElement("td");
    var LG99A = document.createElement("td");
    var LG1A3 = document.createElement("td");
    var LG1C2a = document.createElement("td");
    var LG1C2b = document.createElement("td");
    var LG1C2c = document.createElement("td");
    var LG1C2d = document.createElement("td");
    var LG1C2e = document.createElement("td");
    var LG1C3 = document.createElement("td");
    var LG1C4a = document.createElement("td");
    var LG1C4b = document.createElement("td");
    var LG1C4c = document.createElement("td");
    var LG1C4d = document.createElement("td");
    var LG1C4e = document.createElement("td");
    var LG1P1 = document.createElement("td");
    var LG1P2 = document.createElement("td");
    var LG1P3 = document.createElement("td");
    var LG2P1 = document.createElement("td");
    var LG3P1 = document.createElement("td");
    var LG3P2 = document.createElement("td");
    var LG3P3 = document.createElement("td");
    var LG3P4 = document.createElement("td");

    LG99A.id = "LG99.A" + index;
    LG1A3.id = "LG1.A3" + index;
    LG1C2a.id = "LG1.C2a" + index;
    LG1C2b.id = "LG1.C2b" + index;
    LG1C2c.id = "LG1.C2c" + index;
    LG1C2d.id = "LG1.C2d" + index;
    LG1C2e.id = "LG1.C2e" + index;
    LG1C3.id = "LG1.C3" + index;
    LG1C4a.id = "LG1.C4a" + index;
    LG1C4b.id = "LG1.C4b" + index;
    LG1C4c.id = "LG1.C4c" + index;
    LG1C4d.id = "LG1.C4d" + index;
    LG1C4e.id = "LG1.C4e" + index;
    LG1P1.id = "LG1.P1" + index;
    LG1P2.id = "LG1.P2" + index;
    LG1P3.id = "LG1.P3" + index;
    LG2P1.id = "LG2.P1" + index;
    LG3P1.id = "LG3.P1" + index;
    LG3P2.id = "LG3.P2" + index;
    LG3P3.id = "LG3.P3" + index;
    LG3P4.id = "LG3.P4" + index;

    LG1A3.innerHTML = "";
    LG1C2a.innerHTML = "";
    LG1C2b.innerHTML = "";
    LG1C2c.innerHTML = "";
    LG1C2d.innerHTML = "";
    LG1C2e.innerHTML = "";
    LG1C3.innerHTML = "";
    LG1P1.innerHTML = "";
    LG1P2.innerHTML = "";
    LG1P3.innerHTML = "";
    LG1C4a.innerHTML = "";
    LG1C4b.innerHTML = "";
    LG1C4c.innerHTML = "";
    LG1C4d.innerHTML = "";
    LG1C4e.innerHTML = "";
    LG2P1.innerHTML = "";
    LG3P1.innerHTML = "";
    LG3P2.innerHTML = "";
    LG3P3.innerHTML = "";
    LG3P4.innerHTML = "";

    probRow.appendChild(teacherCell);
    probRow.appendChild(classCell);
    probRow.appendChild(studentCell);
    probRow.appendChild(dateCell);
    probRow.appendChild(timeCell);
    probRow.appendChild(challengeCell);
    probRow.appendChild(indexCell);
    probRow.appendChild(priorActionCell);
    probRow.appendChild(LG99A);
    probRow.appendChild(LG1P1);
    probRow.appendChild(LG1P2);
    probRow.appendChild(LG1A3);
    probRow.appendChild(LG1C2a);
    probRow.appendChild(LG1C2b);
    probRow.appendChild(LG1C2c);
    probRow.appendChild(LG1C2d);
    probRow.appendChild(LG1C2e);
    probRow.appendChild(LG1C3);
    probRow.appendChild(LG1P3);
    probRow.appendChild(LG1C4a);
    probRow.appendChild(LG1C4b);
    probRow.appendChild(LG1C4c);
    probRow.appendChild(LG1C4d);
    probRow.appendChild(LG1C4e);
    probRow.appendChild(LG2P1);
    probRow.appendChild(LG3P1);
    probRow.appendChild(LG3P2);
    probRow.appendChild(LG3P3);
    probRow.appendChild(LG3P4);
    probTable.appendChild(probRow);

    teacherCell.innerHTML = myTeacher.id;
    classCell.innerHTML = myClass.id;
    studentCell.innerHTML = myStudent.id;
    dateCell.innerHTML = myAction.time.split("T")[0]
    timeCell.innerHTML = myAction.time.match(/(?<=T)([^Z]+)/)[0];
    challengeCell.innerHTML = myActivity.name;
    indexCell.innerHTML = myAction.index;
    var priorAction = myStudent.actions[index - 1];
    priorActionCell.innerHTML = priorAction.event;
    if (myAction.probs.length > 1) {
        for (var j = 1; j < myAction.probs.length; j++) {
            var myProb = myAction.probs[j];
            document.getElementById(myProb.id + index).innerHTML = myProb.prob;
        }
    }
}

function tableToCSV(headerRow, table) { //Converts an HTML table to a csv file
    var returnCSV = ""
    var myRow;
    var myCell;
    var headerCell;
    var text;
    var contents;
    for (var i = 0; i < headerRow.children.length; i++) {
        headerCell = headerRow.children[i];
        text = headerCell.innerText;
        contents = text.match(/[^"]+/)[0];
        returnCSV += contents;
        if (i != headerRow.children.length - 1) {
            returnCSV += ",";
        } else {
            returnCSV += "\n";
        }
    }
    for (var j = 1; j < table.children.length; j++) {
        myRow = table.children[j];
        for (var k = 0; k < myRow.children.length; k++) {
            contents = myRow.children[k].innerText;
            returnCSV += contents;
            if (k != myRow.children.length - 1) {
                returnCSV += ",";
            } else {
                returnCSV += "\n";
            }
        }
    }
    return (returnCSV);
}