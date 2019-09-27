//Loop over the IDs in objectIds to turn them into objects, then create a column of checkboxes or radio buttons for each object, labeled by the id of that object with the <countField> of the object in parentheses. Color the nameField and countField appropriately. If the buttons are already present and are being replaced, keep track of their checked status and persist it in the new buttons.

function makeButtons(objects, objectIds, counts, type, nameField, name, onchange, title, destination) {
    var string,
        count,
        id,
        statusArray = [];
    if (title == "Guide-hint-received") {
        title = "<span style=\"color:red\">" + title + "</span>";
    }
    if (title == "Guide-remediation-requested") {
        title = "<span style=\"color:blue\">" + title + "</span>";
    }

    if (objectIds.length == 0) {
        destination.innerHTML = "";
    } else {
        destination.innerHTML = "<b>" + title + "</b><br><br>";
        //      destination.innerHTML += "<input type='checkbox' + name = " + name + " onchange='toggleSelectAll(\"" + name + "\");'></input> all/none<br>";
        for (var m = 0; m < objects.length; m++) {
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
    showTeachers();
}

function toggleShowChanges() {
    infoPara.innerHTML = "";
    var span = document.getElementById("showChangesSpan");
    if (span.innerText == "Show changed probs only") {
        span.innerText = "Show all probs";
        showAllProbs = true;
        showConcepts();
        makeGraph();
    } else {
        span.innerText = "Show changed probs only";
        showAllProbs = false;
        showConcepts();
        makeGraph();
    }
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











function showActions() {
    var acts = [],
        myEvent,
        myFields,
        myActions,
        myAction;

    setSelectedObjects();
    if (selectedEvents.length == 0) {
        actionsPara.innerHTML = "";
    } else if (selectedStudents.length != 1) {
        actionsPara.innerHTML = "<b>Actions can only be shown for one student at a time.</b>";
    } else {
        actionsPara.innerHTML = "<b>Actions</b><br>";
        acts = [];
        for (var i = 0; i < selectedEvents.length; i++) {
            myEvent = selectedEvents[i];
            for (var j = 0; j < myEvent.actions.length; j++) {
                acts.push(myEvent.actions[j]);
            }
        }
        acts.sort(function (a, b) {
            return a.index - b.index;
        });
        for (var k = 0; k < acts.length; k++) {
            myAction = acts[k];
            myFields = [];
            if (myAction.parameters) {
                myParameters = myAction.parameters;
                myFields = Object.getOwnPropertyNames(myParameters);
            }
            actionsPara.innerHTML += ("<br><b>" + myAction.index + ": " + myAction.event + " at " + myAction.time + "</b><br>");
            //      if (myAction.description) {
            //        actionsPara.innerHTML += myAction.description;
            //  } else {
            for (var l = 0; l < myFields.length; l++) {
                myField = myFields[l];
                actionsPara.innerHTML += (myField + ":" + myParameters[myField] + "<br>");
            }
        }
    }
}

function toggleTable() {
    var table = document.getElementById("probTable");
    var tableSpan = document.getElementById("tableSpan");
    if (tableSpan.textContent == "Show table") {
        tableSpan.textContent = "Hide table";
    } else {
        tableSpan.textContent = "Show table";
    }
    makeProbTable();
}

//Check the tableSpan text field. If it displays "Show table" hide the table and the div; otherwise set the div and the table to "inline"
function makeProbTable() {
    var div = document.getElementById("probDiv");
    var table = document.getElementById("probTable");
    var body = document.getElementById("probTableBody");
    clear(body);
    var tableSpan = document.getElementById("tableSpan");
    if (tableSpan.textContent == "Show table") {
        div.style.display = "none";
        table.style.display = "none";
    } else {
        div.style.display = "inline";
        table.style.display = "inline";
    }
    var ss = [];
    setSelectedObjects();
    ss = selectedStudents;
    //For the time being there's only one selected student but just in case...
    for (var i = 0; i < ss.length; i++) {
        myStudent = ss[i];
        var actions = myStudent.actions;
        actions.sort(function (a, b) {
            return a.unixTime - b.unixTime;
        });
        for (var j = 0; j < actions.length; j++) {
            myAction = actions[j];
            myActivity = myAction.activity;
            myEvent = myAction.event;
            if (myEvent) {
                if (myEvent == "ITS Data Updated") {
                    addCSVRow(myStudent, myActivity, myEvent, myAction);
                }
            }
        }
    }
}

function addCSVRow(myStudent, myActivity, myEvent, myAction) {
    var index = myAction.index,
        myClass = myStudent.class,
        myTeacher = myClass.teacher,
        probDiv = document.getElementById("probDiv"),
        probTableBody = document.getElementById("probTableBody");
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
    probTableBody.appendChild(probRow);

    teacherCell.innerHTML = myTeacher.id;
    classCell.innerHTML = myClass.id;
    studentCell.innerHTML = myStudent.id;
    dateCell.innerHTML = myAction.time.split("T")[0];
    timeCell.innerHTML = myAction.time.match(/(?<=T)([^Z]+)/)[0];
    challengeCell.innerHTML = myActivity;
    indexCell.innerHTML = myAction.index;
    var priorAction = myStudent.actions[index - 1];
    if (priorAction) {
        priorActionCell.innerHTML = priorAction.event;
    }
    if (myAction.probs.length > 0) {
        for (var j = 0; j < myAction.probs.length; j++) {
            var myProb = myAction.probs[j];
            document.getElementById(myProb.id + index).innerHTML = myProb.value;
        }
    }
}

function tableToCSV(headerRow, body) { //Converts an HTML table to a csv file
    var returnCSV = "";
    var bodyRow;
    var headerCell;
    var text;
    var contents;
    for (var i = 0; i < headerRow.children.length; i++) {
        headerCell = headerRow.children[i];
        text = headerCell.innerText;
        contents = text.match(/[^"^\s]+/)[0];
        returnCSV += contents;
        if (i != headerRow.children.length - 1) {
            returnCSV += ",";
        } else {
            returnCSV += "\n";
        }
    }
    for (var j = 0; j < body.children.length; j++) {
        bodyRow = body.children[j];
        for (var k = 0; k < bodyRow.children.length; k++) {
            contents = bodyRow.children[k].innerText;
            returnCSV += contents;
            if (k != bodyRow.children.length - 1) {
                returnCSV += ",";
            } else {
                returnCSV += "\n";
            }
        }
    }
    return (returnCSV);
}

function clear(element) { //Have to work backwards otherwise the loop doesn't work!
    var children = element.childNodes;
    if (children.length > 3) {
        for (var i = children.length; i > 0; i--) {
            element.removeChild(children[i - 1]);
        }
    }
}

function downloadFile() {
    var nameInput = document.getElementById("csvFileName");
    var fileName = nameInput.value;
    var header = document.getElementById("probHeaderRow");
    var table = document.getElementById("probTable");
    var body = document.getElementById("probTableBody");
    makeProbTable();
    csvFile = tableToCSV(header, body);
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
    };
}