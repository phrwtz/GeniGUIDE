function trackStudents() {
    var myAction,
        myStudent;
    for (var i = 0; i < students.length; i++) {
        myStudent = students[i];
        if (myStudent.probs.length > 1) {
            for (var j = 1; j < myStudent.probs.length; j++) {
                oldProbs = myStudent.probs[j - 1];
                newProbs = myStudent.probs[j];
                compareProbs(oldProbs, newProbs); //Sets the changed property to true for each prob in newProbs that has a changed probability from oldProbs
            }
        }
    }
    trackProb();
}

function trackSelectedStudent() { //Tracks the probs of the selected student across all actions.
    var selectedStudentID = findSelectedStudentID();
    var myStudent = getStudentByID(selectedStudentID);
    for (var i = 0; i < myStudent.actions.length; i++) {
        myAction = myStudent.actions[i];
        if (myAction.probs.length > 0) {
            if (myAction.event == "Drake-submitted") {
                addProbsRow(myStudent, myAction);
            }
        }
    }
}

function findSelectedStudentID() {
    var studentRadioButtons = document.getElementsByName("studentButton");
    if (studentRadioButtons.length > 0) {
        for (var i = 0; i < studentRadioButtons.length; i++) {
            if (studentRadioButtons[i].checked) {
                return studentRadioButtons[i].id;
            }
        }
        return null;
    }
}

function compareProbs(oldProbs, newProbs) {
    /*
    Compares two prob arrays and sets the "changed" property to true for each prob in the second array that has a different probability learned value from the prob with the same concept id in the first array.
    */
    if (newProbs.length > 0 && oldProbs.length > 0) {
        if (oldProbs[0].action.student.id != newProbs[0].action.student.id) {
            console.log("Probs from different students being compared!");
        }
    }
    try {
        if (!oldProbs) {
            for (var k = 0; k < newProbs.length; k++) {
                newProbs[k].changed = true;
            }
        } else {
            for (var j = 0; j < newProbs.length; j++) {
                for (var i = 0; i < oldProbs.length; i++) {
                    if (newProbs[j].id == oldProbs[i].id) {
                        if (newProbs[j].prob == oldProbs[i].prob) {
                            newProbs[j].changed = false;
                        } else {
                            newProbs[j].changed = true;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log("Failed in compareProbs. Error = " + err);
    }
}

function trackProb() {
    var probLearnedArray;
    var conceptId = "LG1.P2"
    for (var k = 0; k < students.length; k++) {
        var myStudent = students[k];
        probLearnedArray = [];
        if (myStudent.probs.length > 0) {
            for (var i = 0; i < myStudent.probs.length; i++) {
                var myProb = myStudent.probs[i];
                for (var j = 0; j < myProb.length; j++) {
                    if ((myProb[j].id == conceptId) && (myProb[j].changed)) {
                        probLearnedArray.push(myProb[j].prob);
                    }
                }
            }
        }
        console.log("Probabilities for student " + myStudent.id + " for concept " + conceptId + ":");
        for (var kk = 0; kk < probLearnedArray.length; kk++) {
            console.log(probLearnedArray[kk]);
        }
    }
}

function findActionByStudent(classID, studentID, actionIndex) {
    for (var k = 0; k < classes.length; k++) {
        if (parseInt(classes[k].id) == classID) {
            var myClass = classes[k];
            for (var i = 0; i < myClass.students.length; i++) {
                if (parseInt(students[i].id) == studentID) {
                    var myStudent = students[i];
                    var myAction = myStudent.actions[actionIndex];
                }
            }
        }
    }
    return (myAction);
}

function addProbsRow(myStudent, myAction) {
    var index = myAction.index;
    var probsDiv = document.getElementById("probsDiv");
    probsDiv.style.display = "inline";
    var probRow = document.createElement("tr");
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

    probRow.appendChild(timeCell);
    probRow.appendChild(challengeCell);
    probRow.appendChild(eventCell);
    probRow.appendChild(indexCell);
    probRow.appendChild(LG99Aold);
    probRow.appendChild(LG99Anew);
    probRow.appendChild(LG1A3old);
    probRow.appendChild(LG1A3new);
    probRow.appendChild(LG1C2aold);
    probRow.appendChild(LG1C2anew);
    probRow.appendChild(LG1C2bold);
    probRow.appendChild(LG1C2bnew);
    probRow.appendChild(LG1C3old);
    probRow.appendChild(LG1C3new);
    probRow.appendChild(LG1P1old);
    probRow.appendChild(LG1P1new);
    probRow.appendChild(LG1P2old);
    probRow.appendChild(LG1P2new);
    probRow.appendChild(LG1P3old);
    probRow.appendChild(LG1P3new);
    probsTable.appendChild(probRow);

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
            console.log("In addProbRow. No old probs. Last action was " + lastAction.event);
        }
        if (newProbs) {
            if (newProbs.length > 0) {
                for (var j = 0; j < newProbs.length; j++) {
                    document.getElementById(newProbs[j].id + "new" + index).innerHTML = newProbs[j].prob;
                }
            }
        } else {
            console.log("In addProbRow. No new probs");
        }
    } catch (err) {
        console.log("In addProbRow. Can't find the array element. Error message = " + err);
    }
}