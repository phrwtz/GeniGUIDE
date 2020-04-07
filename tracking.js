NCSUStudentsArr = [];
NCSUStudentsObj = new Object();

function openNCSUFile(evt) {
    var fileCount = 0;
    var files = evt.target.files; // FileList object
    for (var i = 0, f;
        (f = files[i]); i++) {
        var reader = new FileReader();
        reader.onerror = function (err) {
            console.log(err);
        };
        //closure to capture the file information
        reader.onloadend = (function (f) {
            return function (e) {
                fileCount++;
                let csvStr = e.target.result;
                let csvArr = Papa.parse(csvStr);
                let data = csvArr.data;
                let header = data[0];
                for (let j = 1; j < data.length; j++) {
                    dataRow = data[j];
                    NCSUStudent = new Object();
                    for (let k = 0; k < dataRow.length; k++) {
                        NCSUStudent[header[k]] = dataRow[k];
                    }
                    NCSUStudentsObj[NCSUStudent.UserID] = NCSUStudent;
                    NCSUStudentsArr.push(NCSUStudent);
                }
            }
        })(f);
        reader.readAsText(f);
    }
}

function compareFiles() {
    let matches = 0;
    let preMatches = 0;
    let postMatches = 0;
    for (i = 0; i < ppStudentsArr.length; i++) {
        let ppStudent = ppStudentsArr[i];
        let NCSUStudent = NCSUStudentsObj[ppStudent.UserID];
        if (typeof NCSUStudent != "undefined") {
            matches++;
            if (NCSUStudent.pre_score == ppStudent.pre_score) {
                preMatches++;
            }
            if (NCSUStudent.post_score == ppStudent.post_score) {
                postMatches++;
            }
        }
    }
    console.log(matches + " students matched. " + preMatches + " had the same pre score and " + postMatches + " had the same post score.");
}

function addProbRow(myStudent, oldProbs, newProbs) {
    var index = newProbs[0].action.index;
    var date = newProbs[0].time.match(/[^T]+/)[0];
    var time = newProbs[0].time.match(/(?<=T)([^Z]+)/)[0];
    var probDiv = document.getElementById("probDiv");
    var probTable = document.getElementById("probTable");
    var probBody = document.getElementById("probBody");
    if (!probBody) {
        var probBody = document.createElement("tbody");
        probBody.id = "probBody";
    }
    probTable.appendChild(probBody);
    var probRow = document.createElement("tr");
    probBody.appendChild(probRow);
    probDiv.style.display = "inline";
    probTable.style.display = "inline";
    var studentCell = document.createElement("td");
    var indexCell = document.createElement("td");
    var timeCell = document.createElement("td");
    var challengeCell = document.createElement("td");
    var LG99Aold = document.createElement("td");
    var LG99Anew = document.createElement("td");
    var LG1A3old = document.createElement("td");
    var LG1A3new = document.createElement("td");
    var LG1C2aold = document.createElement("td");
    var LG1C2anew = document.createElement("td");
    var LG1C2bold = document.createElement("td");
    var LG1C2bnew = document.createElement("td");
    var LG1C2cold = document.createElement("td");
    var LG1C2cnew = document.createElement("td");
    var LG1C2dold = document.createElement("td");
    var LG1C2dnew = document.createElement("td");
    var LG1C2eold = document.createElement("td");
    var LG1C2enew = document.createElement("td");
    var LG1C3old = document.createElement("td");
    var LG1C3new = document.createElement("td");
    var LG1C4aold = document.createElement("td");
    var LG1C4anew = document.createElement("td");
    var LG1C4bold = document.createElement("td");
    var LG1C4bnew = document.createElement("td");
    var LG1C4cold = document.createElement("td");
    var LG1C4cnew = document.createElement("td");
    var LG1C4dold = document.createElement("td");
    var LG1C4dnew = document.createElement("td");
    var LG1C4eold = document.createElement("td");
    var LG1C4enew = document.createElement("td");
    var LG1P1old = document.createElement("td");
    var LG1P1new = document.createElement("td");
    var LG1P2old = document.createElement("td");
    var LG1P2new = document.createElement("td");
    var LG1P3old = document.createElement("td");
    var LG1P3new = document.createElement("td");
    var LG2P1old = document.createElement("td");
    var LG2P1new = document.createElement("td");
    var LG3P1old = document.createElement("td");
    var LG3P1new = document.createElement("td");
    var LG3P2old = document.createElement("td");
    var LG3P2new = document.createElement("td");
    var LG3P3old = document.createElement("td");
    var LG3P3new = document.createElement("td");
    var LG3P4old = document.createElement("td");
    var LG3P4new = document.createElement("td");

    LG99Aold.id = "LG99.Aold" + index;
    LG99Anew.id = "LG99.Anew" + index;
    LG1A3old.id = "LG1.A3old" + index;
    LG1A3new.id = "LG1.A3new" + index;
    LG1C2aold.id = "LG1.C2aold" + index;
    LG1C2anew.id = "LG1.C2anew" + index;
    LG1C2bold.id = "LG1.C2bold" + index;
    LG1C2bnew.id = "LG1.C2bnew" + index;
    LG1C2cold.id = "LG1.C2cold" + index;
    LG1C2cnew.id = "LG1.C2cnew" + index;
    LG1C2dold.id = "LG1.C2dold" + index;
    LG1C2dnew.id = "LG1.C2dnew" + index;
    LG1C2eold.id = "LG1.C2eold" + index;
    LG1C2enew.id = "LG1.C2enew" + index;
    LG1C3old.id = "LG1.C3old" + index;
    LG1C3new.id = "LG1.C3new" + index;
    LG1C4aold.id = "LG1.C4aold" + index;
    LG1C4anew.id = "LG1.C4anew" + index;
    LG1C4bold.id = "LG1.C4bold" + index;
    LG1C4bnew.id = "LG1.C4bnew" + index;
    LG1C4cold.id = "LG1.C4cold" + index;
    LG1C4cnew.id = "LG1.C4cnew" + index;
    LG1C4dold.id = "LG1.C4dold" + index;
    LG1C4dnew.id = "LG1.C4dnew" + index;
    LG1C4eold.id = "LG1.C4eold" + index;
    LG1C4enew.id = "LG1.C4enew" + index;
    LG1P1old.id = "LG1.P1old" + index;
    LG1P1new.id = "LG1.P1new" + index;
    LG1P2old.id = "LG1.P2old" + index;
    LG1P2new.id = "LG1.P2new" + index;
    LG1P3old.id = "LG1.P3old" + index;
    LG1P3new.id = "LG1.P3new" + index;
    LG2P1old.id = "LG2.P1old" + index;
    LG2P1new.id = "LG2.P1new" + index;
    LG3P1old.id = "LG3.P1old" + index;
    LG3P1new.id = "LG3.P1new" + index;
    LG3P2old.id = "LG3.P2old" + index;
    LG3P2new.id = "LG3.P2new" + index;
    LG3P3old.id = "LG3.P3old" + index;
    LG3P3new.id = "LG3.P3new" + index;
    LG3P4old.id = "LG3.P4old" + index;
    LG3P4new.id = "LG3.P4new" + index;

    LG99Aold.innerHTML = "";
    LG99Aold.style.backgroundColor = "palegreen";
    LG99Anew.innerHTML = "";
    LG99Anew.style.backgroundColor = "yellow";
    LG1A3old.innerHTML = "";
    LG1A3old.style.backgroundColor = "palegreen";
    LG1A3new.innerHTML = "";
    LG1A3new.style.backgroundColor = "yellow";
    LG1C2aold.innerHTML = "";
    LG1C2aold.style.backgroundColor = "palegreen";
    LG1C2anew.innerHTML = "";
    LG1C2anew.style.backgroundColor = "yellow";
    LG1C2bold.innerHTML = "";
    LG1C2bold.style.backgroundColor = "palegreen";
    LG1C2bnew.innerHTML = "";
    LG1C2bnew.style.backgroundColor = "yellow";
    LG1C2cold.innerHTML = "";
    LG1C2cold.style.backgroundColor = "palegreen";
    LG1C2cnew.innerHTML = "";
    LG1C2cnew.style.backgroundColor = "yellow";
    LG1C2dold.innerHTML = "";
    LG1C2dold.style.backgroundColor = "palegreen";
    LG1C2dnew.innerHTML = "";
    LG1C2dnew.style.backgroundColor = "yellow";
    LG1C2eold.innerHTML = "";
    LG1C2eold.style.backgroundColor = "palegreen";
    LG1C2enew.innerHTML = "";
    LG1C2enew.style.backgroundColor = "yellow";
    LG1C3old.innerHTML = "";
    LG1C3old.style.backgroundColor = "palegreen";
    LG1C3new.innerHTML = "";
    LG1C3new.style.backgroundColor = "yellow";
    LG1C4aold.innerHTML = "";
    LG1C4aold.style.backgroundColor = "palegreen";
    LG1C4anew.innerHTML = "";
    LG1C4anew.style.backgroundColor = "yellow";
    LG1C4bold.innerHTML = "";
    LG1C4bold.style.backgroundColor = "palegreen";
    LG1C4bnew.innerHTML = "";
    LG1C4bnew.style.backgroundColor = "yellow";
    LG1C4cold.innerHTML = "";
    LG1C4cold.style.backgroundColor = "palegreen";
    LG1C4cnew.innerHTML = "";
    LG1C4cnew.style.backgroundColor = "yellow";
    LG1C4dold.innerHTML = "";
    LG1C4dold.style.backgroundColor = "palegreen";
    LG1C4dnew.innerHTML = "";
    LG1C4dnew.style.backgroundColor = "yellow";
    LG1C4eold.innerHTML = "";
    LG1C4eold.style.backgroundColor = "palegreen";
    LG1C4enew.innerHTML = "";
    LG1C4enew.style.backgroundColor = "yellow";
    LG1P1old.innerHTML = "";
    LG1P1old.style.backgroundColor = "palegreen";
    LG1P1new.innerHTML = "";
    LG1P1new.style.backgroundColor = "yellow";
    LG1P2old.innerHTML = "";
    LG1P2old.style.backgroundColor = "palegreen";
    LG1P2new.innerHTML = "";
    LG1P2new.style.backgroundColor = "yellow";
    LG1P3old.innerHTML = "";
    LG1P3old.style.backgroundColor = "palegreen";
    LG1P3new.innerHTML = "";
    LG1P3new.style.backgroundColor = "yellow";
    LG2P1old.innerHTML = "";
    LG2P1old.style.backgroundColor = "palegreen";
    LG2P1new.innerHTML = "";
    LG2P1new.style.backgroundColor = "yellow";
    LG3P1old.innerHTML = "";
    LG3P1old.style.backgroundColor = "palegreen";
    LG3P1new.innerHTML = "";
    LG3P1new.style.backgroundColor = "yellow";
    LG3P2old.innerHTML = "";
    LG3P2old.style.backgroundColor = "palegreen";
    LG3P2new.innerHTML = "";
    LG3P2new.style.backgroundColor = "yellow";
    LG3P3old.innerHTML = "";
    LG3P3old.style.backgroundColor = "palegreen";
    LG3P3new.innerHTML = "";
    LG3P3new.style.backgroundColor = "yellow";
    LG3P4old.innerHTML = "";
    LG3P4old.style.backgroundColor = "palegreen";
    LG3P4new.innerHTML = "";
    LG3P4new.style.backgroundColor = "yellow";

    probRow.appendChild(studentCell);
    probRow.appendChild(indexCell);
    probRow.appendChild(timeCell);
    probRow.appendChild(challengeCell);
    probRow.appendChild(LG99Aold);
    probRow.appendChild(LG99Anew);
    probRow.appendChild(LG1A3old);
    probRow.appendChild(LG1A3new);
    probRow.appendChild(LG1C2aold);
    probRow.appendChild(LG1C2anew);
    probRow.appendChild(LG1C2bold);
    probRow.appendChild(LG1C2bnew);
    probRow.appendChild(LG1C2cold);
    probRow.appendChild(LG1C2cnew);
    probRow.appendChild(LG1C2dold);
    probRow.appendChild(LG1C2dnew);
    probRow.appendChild(LG1C2eold);
    probRow.appendChild(LG1C2enew);
    probRow.appendChild(LG1C3old);
    probRow.appendChild(LG1C3new);
    probRow.appendChild(LG1C4aold);
    probRow.appendChild(LG1C4anew);
    probRow.appendChild(LG1C4bold);
    probRow.appendChild(LG1C4bnew);
    probRow.appendChild(LG1C4cold);
    probRow.appendChild(LG1C4cnew);
    probRow.appendChild(LG1C4dold);
    probRow.appendChild(LG1C4dnew);
    probRow.appendChild(LG1C4eold);
    probRow.appendChild(LG1C4enew);
    probRow.appendChild(LG1P1old);
    probRow.appendChild(LG1P1new);
    probRow.appendChild(LG1P2old);
    probRow.appendChild(LG1P2new);
    probRow.appendChild(LG1P3old);
    probRow.appendChild(LG1P3new);
    probRow.appendChild(LG2P1old);
    probRow.appendChild(LG2P1new);
    probRow.appendChild(LG3P1old);
    probRow.appendChild(LG3P1new);
    probRow.appendChild(LG3P2old);
    probRow.appendChild(LG3P2new);
    probRow.appendChild(LG3P3old);
    probRow.appendChild(LG3P3new);
    probRow.appendChild(LG3P4old);
    probRow.appendChild(LG3P4new);

    //Now add the row

    studentCell.innerHTML = myStudent.id;
    indexCell.innerHTML = newProbs[0].action.index;
    timeCell.innerHTML = date + "<br>" + time;
    challengeCell.innerHTML = newProbs[0].action.activity;

    compareProbs(oldProbs, newProbs); //Sets the changed property to true for each prob in newProbs that has a changed probability from oldProbs
    if (oldProbs) {
        if (oldProbs.length > 0) {
            for (var i = 0; i < oldProbs.length; i++) {
                document.getElementById(oldProbs[i].id + "old" + index).innerHTML = oldProbs[i].prob;
            }
        }
        if (newProbs) {
            if (newProbs.length > 0) {
                for (var j = 0; j < newProbs.length; j++) {
                    document.getElementById(newProbs[j].id + "new" + index).innerHTML = newProbs[j].prob;
                }
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
    Compares two prob arrays and sets the "changed" property to true for each prob in the second array that has a different probability learned value from the prob with the same concept id in the first array. If the first array is empty then every element of the second away has changed = true.
    */
    if (newProbs.length > 0 && oldProbs.length > 0) {
        if (oldProbs[0].action.student.id != newProbs[0].action.student.id) {
            console.log("Probs from different students being compared!");
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
    } else {
        if (oldProbs.length == 0) {
            for (var k = 0; k < newProbs.length; k++) {
                oldProbs = newProbs[k].initProb;
                newProbs[k].changed = true;
            }
        }
    }
}

function trackProb() {
    var probLearnedArray;
    var conceptId = "LG1.P2";
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
    var myAction;
    for (var k = 0; k < classes.length; k++) {
        if (parseInt(classes[k].id) == classID) {
            var myClass = classes[k];
            for (var i = 0; i < myClass.students.length; i++) {
                if (parseInt(students[i].id) == studentID) {
                    var myStudent = students[i];
                    myAction = myStudent.actions[actionIndex];
                }
            }
        }
    }
    return (myAction);
}