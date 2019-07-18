function findFutureProbs() { //Goes through all the actions for every student, searching ahead for a tenth of a second for a new set of probs for the same student (which only happens when the future event is ITS-Data-Updated). Adds the new probs to the action.
    var actionsLength;
    for (var i = 0; i < students.length; i++) {
        myStudent = students[i];
        actionsLength = myStudent.actions.length;
        if (actionsLength > 0) {
            for (var j = 0; j < actionsLength; j++) {
                myAction = myStudent.actions[j];
                var index = myAction.index,
                    thisTime = new Date(myAction.time).getTime(),
                    newTime,
                    newProbs = [],
                    newProbsFound = false;
                for (var k = 1;
                    ((k < 16) && (index + k < actionsLength)); k++) {
                    newTime = new Date(myStudent.actions[index + k].time).getTime();
                    if (newTime - thisTime > 500) {
                        break;
                    }
                    if ((myStudent.actions[index + k].event == "ITS-Data-Updated") && (!newProbsFound)) {
                        newAction = myStudent.actions[index + k];
                        newProbsFound = true;
                        break;
                    }
                }
                if (newProbsFound) {
                    myAction.newProbs = getProbs(newAction);
                    //                console.log("Action got new probs!");
                } else { //Didn't find an ITS-Data-Updated event within 1/10 second
                    myAction.newProbs = [];
                }
            }
        } else {
            console.log("Student " + i + " has no actions!");
        }
    }
}


function makeCSVFile() {
    var selectedStudents = getSelectedStudents();
    for (var i = 0; i < selectedStudents.length; i++) {
        myStudent = selectedStudents[i];
        var actIds = myStudent.activityIds
        actIds.sort(function (a, b) {
            var acts = myStudent.activitiesObj;
            return acts[a].startTime - acts[b].startTime;
        });
        for (var j = 0; j < actIds.length; j++) {
            myActivityID = actIds[j];
            myActivity = myStudent.activitiesObj[myActivityID];
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
    challengeCell.innerHTML = myActivity.id;
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

function tableToCSV(table) { //Converts an HTML table to a csv file
    var returnCSV = ""
    var tableHead = table.children[0];
    var headerRow = tableHead.children[0];
    var myRow;
    var myCell;
    var headerCell;
    var text;
    var contents;
    for (var i = 0; i < headerRow.children.length; i++) {
        headerCell = headerRow.children[i];
        text = headerCell.innerText;
        contents = text.match(/([\s]*)([A-Za-z]+[\s]?[A-Za-z]+)/)[2];
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

function downloadHints() {
    var hintsTable = document.getElementById("hintsTable");
    var hintsCSV = tableToCSV(hintsTable);
    filename = "MC3PA_hints_data.csv"
    saveData()(hintsCSV, filename);
}

function saveData(data) {
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