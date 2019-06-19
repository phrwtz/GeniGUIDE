function findFutureProbs() { //Goes through all the actions for every student, searching ahead for a tenth of a second for a new set of probs for the same student (which only happens when the future event is ITS-Data-Updated). Adds the new probs to the action.
    var actionsLength;
    console.log("In findFutureProbs. There are " + students.length + " students here.");
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
                    ((k < 6) && (index + k < actionsLength)); k++) {
                    newTime = new Date(myStudent.actions[index + k].time).getTime();
                    if (newTime - thisTime > 100) {
                        break;
                    }
                    if ((myStudent.actions[index + k].event == "ITS-Data-Updated") && (!newProbsFound)) {
                        newAction = myStudent.actions[index + k];
                        newProbsFound = true;
                    }
                }
                if (newProbsFound) {
                    myAction.newProbs = getProbs(newAction);
                } else { //Didn't find an ITS-Data-Updated event within 1/10 second
                    myAction.newProbs = [];
                }
            }
        } else {
            console.log("Student " + i + " has no actions!");
        }
    }
}


function MakeCSVFile() {
    var button = document.getElementById("toggleHintsButton");
    for (var i = 0, myStudent; myStudent = students[i]; i++) {
        for (var j = 0, myAction; myAction = myStudent.actions[j]; j++) {
            if (myAction.event == "ITS-Data-Updated") {
                addCSVRow(myStudent, myAction);
            }
        }
    }
    button.style.display = "inline";
}

function addCSVRow(myStudent, myAction) {
    var index = myAction.index;
    var hintsDiv = document.getElementById("hintsDiv");
    hintsDiv.style.display = "inline";
    var hintRow = document.createElement("tr");
    var classCell = document.createElement("td");
    var studentCell = document.createElement("td");
    var timeCell = document.createElement("td");
    var challengeCell = document.createElement("td");
    var eventCell = document.createElement("td");
    var indexCell = document.createElement("td");
    var LG99Aold = document.createElement("td");
    var LG99Anew = document.createElement("td");
    var LG1A3old = document.createElement("td");
    var LG1A3new = document.createElement("td");
    var LG1C2aold = document.createElement("td");
    var LG1C2anew = document.createElement("td");
    var LG1C2bold = document.createElement("td");
    var LG1C2bnew = document.createElement("td");
    var LG1C3old = document.createElement("td");
    var LG1C3new = document.createElement("td");
    var LG1P1old = document.createElement("td");
    var LG1P1new = document.createElement("td");
    var LG1P2old = document.createElement("td");
    var LG1P2new = document.createElement("td");
    var LG1P3old = document.createElement("td");
    var LG1P3new = document.createElement("td");

    LG99Aold.id = "LG99.Aold" + index;
    LG99Anew.id = "LG99.Anew" + index;
    LG1A3old.id = "LG1.A3old" + index;
    LG1A3new.id = "LG1.A3new" + index;
    LG1C2aold.id = "LG1.C2aold" + index;
    LG1C2anew.id = "LG1.C2anew" + index;
    LG1C2bold.id = "LG1.C2bold" + index;
    LG1C2bnew.id = "LG1.C2bnew" + index;
    LG1C3old.id = "LG1.C3old" + index;
    LG1C3new.id = "LG1.C3new" + index;
    LG1P1old.id = "LG1.P1old" + index;
    LG1P1new.id = "LG1.P1new" + index;
    LG1P2old.id = "LG1.P2old" + index;
    LG1P2new.id = "LG1.P2new" + index;
    LG1P3old.id = "LG1.P3old" + index;
    LG1P3new.id = "LG1.P3new" + index;

    LG99Aold.innerHTML = "N/A";
    LG99Aold.style.backgroundColor = "palegreen";
    LG99Anew.innerHTML = "N/A";
    LG99Anew.style.backgroundColor = "yellow";
    LG1A3old.innerHTML = "N/A";
    LG1A3old.style.backgroundColor = "palegreen";
    LG1A3new.innerHTML = "N/A";
    LG1A3new.style.backgroundColor = "yellow";
    LG1C2aold.innerHTML = "N/A";
    LG1C2aold.style.backgroundColor = "palegreen";
    LG1C2anew.innerHTML = "N/A";
    LG1C2anew.style.backgroundColor = "yellow";
    LG1C2bold.innerHTML = "N/A";
    LG1C2bold.style.backgroundColor = "palegreen";
    LG1C2bnew.innerHTML = "N/A";
    LG1C2bnew.style.backgroundColor = "yellow";
    LG1C3old.innerHTML = "N/A";
    LG1C3old.style.backgroundColor = "palegreen";
    LG1C3new.innerHTML = "N/A";
    LG1C3new.style.backgroundColor = "yellow";
    LG1P1old.innerHTML = "N/A";
    LG1P1old.style.backgroundColor = "palegreen";
    LG1P1new.innerHTML = "N/A";
    LG1P1new.style.backgroundColor = "yellow";
    LG1P2old.innerHTML = "N/A";
    LG1P2old.style.backgroundColor = "palegreen";
    LG1P2new.innerHTML = "N/A";
    LG1P2new.style.backgroundColor = "yellow";
    LG1P3old.innerHTML = "N/A";
    LG1P3old.style.backgroundColor = "palegreen";
    LG1P3new.innerHTML = "N/A";
    LG1P3new.style.backgroundColor = "yellow";

    hintRow.appendChild(classCell);
    hintRow.appendChild(studentCell);
    hintRow.appendChild(timeCell);
    hintRow.appendChild(challengeCell);
    hintRow.appendChild(eventCell);
    hintRow.appendChild(indexCell);
    hintRow.appendChild(LG99Aold);
    hintRow.appendChild(LG99Anew);
    hintRow.appendChild(LG1A3old);
    hintRow.appendChild(LG1A3new);
    hintRow.appendChild(LG1C2aold);
    hintRow.appendChild(LG1C2anew);
    hintRow.appendChild(LG1C2bold);
    hintRow.appendChild(LG1C2bnew);
    hintRow.appendChild(LG1C3old);
    hintRow.appendChild(LG1C3new);
    hintRow.appendChild(LG1P1old);
    hintRow.appendChild(LG1P1new);
    hintRow.appendChild(LG1P2old);
    hintRow.appendChild(LG1P2new);
    hintRow.appendChild(LG1P3old);
    hintRow.appendChild(LG1P3new);
    hintsTable.appendChild(hintRow);

    classCell.innerHTML = myStudent.class.id;
    studentCell.innerHTML = myStudent.id;
    timeCell.innerHTML = myAction.time.match(/(?<=T)([^Z]+)/)[0];
    challengeCell.innerHTML = myAction.activity;
    eventCell.innerHTML = myAction.event;
    indexCell.innerHTML = index;

    if (myStudent.probsArray.length > 1) {
        for (var j = 1; j < myStudent.probsArray.length; j++) {
            oldProbs = myStudent.probsArray[j - 1];
            newProbs = myStudent.probsArray[j];
            compareProbs(oldProbs, newProbs); //Sets the changed property to true for each prob in newProbs that has a changed probability from oldProbs
        }
    }
    try {
        if (oldProbs) {
            if (oldProbs.length > 0) {
                for (var i = 0; i < oldProbs.length; i++) {
                    document.getElementById(oldProbs[i].id + "old" + index).innerHTML = oldProbs[i].prob;
                }
            }
        } else {
            console.log("No old probs. Last action was " + lastAction.event);
        }
        if (newProbs) {
            if (newProbs.length > 0) {
                for (var j = 0; j < newProbs.length; j++) {
                    document.getElementById(newProbs[j].id + "new" + index).innerHTML = newProbs[j].prob;
                }
            }
        } else {
            console.log("No new probs");
        }
    } catch (err) {
        console.log("Can't find the array element. Error message = " + err);
    }
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