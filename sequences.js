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



function downloadTable(table) {
    var hintsTable = document.getElementById("hintsTable");
    var hintsCSV = tableToCSV(hintsTable);
    filename = "MC3PA_hints_data.csv";
    saveData()(hintsCSV, filename);
}


function makeProfile() {
    var activitiesArray = ["allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2",
        "allele-targetMatch-visible-armorHorns",
        "allele-targetMatch-visible-armorHorns2",
        "allele-targetMatch-visible-armorHorns3",
        "allele-targetMatch-hidden-armorHorns",
        "allele-targetMatch-hidden-armorHorns2",
        "allele-targetMatch-hidden-armorHorns3",
        "allele-targetMatch-visible-simpleColors",
        "allele-targetMatch-visible-simpleColors2",
        "allele-targetMatch-visible-simpleColors3",
        "allele-targetMatch-visible-simpleColors4",
        "allele-targetMatch-visible-simpleColors5",
        "allele-targetMatch-hidden-simpleColors",
        "allele-targetMatch-hidden-simpleColors2",
        "allele-targetMatch-hidden-simpleColors3",
        "allele-targetMatch-visible-harderTraits",
        "allele-targetMatch-visible-harderTraits2",
        "allele-targetMatch-hidden-harderTraits",
        "allele-targetMatch-hidden-harderTraits2"
    ];
    var activity,
        student,
        clas,
        profile;
    for (var i = 0; i < students.length; i++) {
        student = students[i];
        clas = student.class;
        console.log("Class " + clas.id + ", student " + student.id);
        for (var j = 0; j < activitiesArray.length; j++) {
            activity = activitiesArray[j];
            var arr = filterActions(student, activity);
            var profile = aggregateActions(arr);
            console.log("Activity " + activity);
            console.log(profile);
        }
    }
}

function makeIndividualProfile(studentId, activityName) {
    var activitiesArray = ["allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2",
        "allele-targetMatch-visible-armorHorns",
        "allele-targetMatch-visible-armorHorns2",
        "allele-targetMatch-visible-armorHorns3",
        "allele-targetMatch-hidden-armorHorns",
        "allele-targetMatch-hidden-armorHorns2",
        "allele-targetMatch-hidden-armorHorns3",
        "allele-targetMatch-visible-simpleColors",
        "allele-targetMatch-visible-simpleColors2",
        "allele-targetMatch-visible-simpleColors3",
        "allele-targetMatch-visible-simpleColors4",
        "allele-targetMatch-visible-simpleColors5",
        "allele-targetMatch-hidden-simpleColors",
        "allele-targetMatch-hidden-simpleColors2",
        "allele-targetMatch-hidden-simpleColors3",
        "allele-targetMatch-visible-harderTraits",
        "allele-targetMatch-visible-harderTraits2",
        "allele-targetMatch-hidden-harderTraits",
        "allele-targetMatch-hidden-harderTraits2"
    ];
    var student = findStudent(studentId),
        clas = student.class,
        arr,
        profile;
    console.log("Class " + clas.id + ", student " + student.id + ", activity " + activityName);
    arr = filterActions(student, activityName);
    profile = aggregateActions(arr);
    console.log(profile);
}

//Returns an array of all the actions <student> took while engaged in <activity></activity>
function filterActions(student, activity) {
    var arr = [],
        act;
    if (student.actions) {
        for (var i = 0; i < student.actions.length; i++) {
            if (student.actions[i].activity === activity) {
                act = student.actions[i];
                arr.push(student.actions[i]);
                //          console.log(act.time + ": " + act.event);
            }
        }
    }
    return arr;
}

//Returns an aggregated array of actions in the order in which they appear. (No hints or remediations yet.)
function aggregateActions(arr) {
    var profile = "",
        act,
        changes = 0,
        hints = 0,
        remediations = 0,
        retries = 0,
        minimumChanges = -1,
        excessChanges = -1,
        outcomeStr,
        returnArr = [];
    for (var i = 0; i < arr.length; i++) {
        act = arr[i];
        switch (act.event) {
            case 'Navigated':
                minimumChanges = parseInt(act.parameters.goalMoves);
                returnArr.push("[" + act.index + "] Navigated(" + minimumChanges + " moves minimum)");
                break;
            case 'Allele changed':
                changes++;
                break;
            case 'Sex changed':
                changes++;
                break;
            case 'Guide hint received':
                returnArr.push("[" + act.index + "] Hint");
                hints++;
                break;
            case 'Guide remediation requested':
                returnArr.push("[" + act.index + "] Remdiation");
                remediations++;
                break;
            case 'Drake submitted':
                excessChanges = (changes - minimumChanges);
                if (act.parameters.correct == "true") {
                    outcomeStr = "correct";
                    crystalColor = getCrystalColor(excessChanges, outcomeStr);
                    returnArr.push("[" + act.index + "] Correct drake submitted after " + changes + " changes, " + excessChanges + " of them excess. Crystal color = " + crystalColor);
                    changes = 0;
                } else {
                    returnArr.push(changes + " changes plus another for incorrect submission");
                    changes++;
                    outcomeStr = "incorrect";
                };
                break;
            case 'Challenge retried':
                returnArr.push("[" + act.index + "] Challenge retried, new dragon.");
                changes = 0;
                break;
        }
    }
    return returnArr;
}

function getCrystalColor(excessChanges, outcomeStr) {
    if ((excessChanges >= 0) && (outcomeStr == "correct")) {
        if (excessChanges > 2) {
            return "black";
        } else {
            switch (excessChanges) {
                case 0:
                    return "blue";
                case 1:
                    return "yellow";
                case 2:
                    return "red";
            }
        }
    } else {
        return "no";
    }
}

function makeSummary(profile) {
    for (var i = 0; i < profile.length; i++) {}
}

function findStudent(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            return students[i];
        }
    }
    return null;
}

function findActionsByActivity(studentId, activityName) {
    var s = findStudent(studentId),
        acts = s.actions,
        act,
        returnArr = [];
    for (let i = 0; i < acts.length; i++) {
        act = acts[i];
        if (act.activity == activityName) {
            returnArr.push(act);
            console.log("[" + act.index + "] " + act.time + ": " + act.event);
        }
    }
    return returnArr;
}

function lookForSequence(activityName) {
    var s,
        acts
    act,
    returnStudents = [];
    for (let i = 0; i < students.length; i++) {
        s = students[i];
        acts = findActionsByActivity(s.id, activityName);
        for (let j = 0; j < acts.length; j++) {
            act = acts[j];
            if (act.event == "Navigated") {}
        }
    }
}