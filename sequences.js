function followStudent() {
    var button = document.getElementById("toggleHintsButton");
    for (var i = 0, myStudent; myStudent = students[i]; i++) {
        for (var j = 0, myAction; myAction = myStudent.actions[j]; j++) {
            if ((myAction.event == "Guide-hint-received") || (myAction.event == "Drake-submitted")) {
                addCSVRow(myStudent, myAction);
            }
        }
    }
    button.style.display = "inline";
}

function addCSVRow(myStudent, myAction) {
    var correctSubmission = "";
    if (myAction.event == "Drake-submitted") {
        correctSubmission = myAction.parameters.correct;
    }
    var hintsDiv = document.getElementById("hintsDiv");
    hintsDiv.style.display = "inline";
    var hintRow = document.createElement("tr");
    var classCell = document.createElement("td");
    var studentCell = document.createElement("td");
    var timeCell = document.createElement("td");
    var challengeCell = document.createElement("td");
    var eventCell = document.createElement("td");
    var hintLevelCell = document.createElement("td");
    var traitCell = document.createElement("td");
    var submissionCell = document.createElement("td");
    var LG99ACell = document.createElement("td");
    var LG1A3Cell = document.createElement("td");
    var LG1C2aCell = document.createElement("td");
    var LG1C2bCell = document.createElement("td");
    var LG1P2Cell = document.createElement("td");
    classCell.innerHTML = myStudent.class.id;
    studentCell.innerHTML = myStudent.id;
    timeCell.innerHTML = myAction.time;
    challengeCell.innerHTML = myAction.activity;
    eventCell.innerHTML = myAction.event;
    (myAction.hintLevel ? hintLevelCell.innerHTML = myAction.hintLevel : hintLevelCell.innerHTML = "");
    if (myAction.attribute) {
        traitCell.innerHTML = myAction.attribute;
    } else if (myAction.parameters.attribute) {
        myAction.parameters.attribute;
    } else {
        traitCell.innerHTML = "";
    }
    submissionCell.innerHTML = correctSubmission;
    hintRow.appendChild(classCell);
    hintRow.appendChild(studentCell);
    hintRow.appendChild(timeCell);
    hintRow.appendChild(challengeCell);
    hintRow.appendChild(eventCell);
    hintRow.appendChild(hintLevelCell);
    hintRow.appendChild(traitCell);
    hintRow.appendChild(submissionCell);
    hintRow.appendChild(LG99ACell);
    hintRow.appendChild(LG1A3Cell);
    hintRow.appendChild(LG1C2aCell);
    hintRow.appendChild(LG1C2bCell);
    hintRow.appendChild(LG1P2Cell);
    hintsTable.appendChild(hintRow);
}

function toggleHintsTable() {
    var hintsTable = document.getElementById("hintsTable");
    var hintsSpan = document.getElementById("hintsSpan");
    var toggleHintsButton = document.getElementById("toggleHintsButton");
    if (hintsTable.style.display == "none") {
        hintsTable.style.display = "inline";
        hintsSpan.innerHTML = "Hide Hints Table";
    } else {
        hintsTable.style.display = "none";
        hintsSpan.innerHTML = "Show Hints Table";
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