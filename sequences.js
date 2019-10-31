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



function makeIndividualProfile(studentId, activityName) {
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
function filterActions(studentId, activity) {
    var arr = [],
        act,
        student = findStudent(studentId);
    if (student.actions) {
        for (var i = 0; i < student.actions.length; i++) {
            if (student.actions[i].activity === activity) {
                act = student.actions[i];
                arr.push(student.actions[i]);
                console.log(act.time + ": " + act.event);
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
                    crystalColor = getCrystalColor(excessChanges);
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

function getCrystalColor(thisTry, thisAction) {
    if (thisAction.parameters.correct == "false") {
        return 0;
    } else if (thisTry.excessMoves > 2) {
        return 1;
    } else {
        switch (thisTry.excessMoves) {
            case 0:
                return 4;
            case 1:
                return 3;
            case 2:
                return 2;
        }
    }
}

//Report on all the challenges <thisStudent> did. Number of tries, highest crystal achieved.
function makeProfile(studentId) {
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
    var thisActivity,
        thisStudent = findStudent(studentId),
        clas = thisStudent.class,
        tries = [],
        colorIndexArray = [],
        thisTry;
    infoPara.style.display = "block";
    infoPara.innerHTML = ("Class " + clas.id + ", student " + thisStudent.id + "<br>");
    for (var j = 0; j < activitiesArray.length; j++) {
        thisActivity = activitiesArray[j];
        tries = findTries(studentId, thisActivity);
        colorIndexArray = [];
        for (var i = 0; i < tries.length; i++) {
            thisTry = tries[i];
            colorIndexArray.push(thisTry.crystalColor);
        }
        maxColorIndex = colorIndexArray.reduce(function (a, b) {
            return Math.max(a, b);
        });
        maxColor = getColorFromIndex(maxColorIndex);
        infoPara.innerHTML += (thisActivity + ": " + tries.length + " tries. Best crystal: " + maxColor + ".<br>")
    }
}


//A "try" is defined as a sequence of actions starting with a "navigated" event signalling entry into <thisActivity> followed by an "Entered challenge from room" event and ending with either another "navigated" event (signalling getting a new target drake and a new initial drake without submitting a drake) or a "drake submitted" event, which enables us to tag the try with the type of crystal (or none) received. A successful submission triggers a "challenge completed" event and may be followed by a "challenge retried" event, itself followed by a navigation event and a new try for the same challenge.
function findTries(studentId, thisActivity) {
    var thisStudent = findStudent(studentId),
        tries = [],
        successes = [],
        failures = [],
        thisAction,
        movesForThisDrake,
        inRemediation = false,
        ev;
    for (var i = 0; i < thisStudent.actions.length; i++) {
        thisAction = thisStudent.actions[i];
        ev = thisAction.event;
        if (thisAction.activity == thisActivity) {
            if (!inRemediation) {
                if (ev == "Navigated") {
                    minimumMoves = parseInt(thisAction.parameters.goalMoves);
                    movesForThisDrake = 0,
                        thisTry = new Object();
                    thisTry.moves = 0;
                    thisTry.hints = 0;
                    thisTry.remediations = 0;
                } else if ((ev == "Allele changed") || (ev == "Sex changed")) {
                    thisTry.moves++;
                    movesForThisDrake++;
                } else if (ev == 'Guide hint received') {
                    thisTry.hints++
                } else if (ev == 'Started remediation') {
                    thisTry.remediations++;
                    inRemediation = true;
                 
                //Drake submitted event always ends a try. The drake is either "correct" or "incorrect" (in which case the crystalColor is set to "none"). An incorrect submission necessarily leads to additional moves on the same drake. A correct submission leads to a "Challenge completed" event which then gives the player a choice: "Try Again" or "Continue." "Try Again" produces a "Challenge retried" event, followed by a Navigated (to the same challenge but a different drake). We create a new try but keep the same challenge. "Continue" leads to a Navigated event that points to a different challenge. We create a new try but assign it to a different challenge (if the challenge is among the set we are examining).
            } else if (ev == 'Drake submitted') {
                thisTry.excessMoves = (movesForThisDrake - minimumMoves);
                thisTry.crystalColor = getCrystalColor(thisTry, thisAction);
                if (thisTry.crystalColor == "none") {
                    thisTry.moves++;
                    movesForThisDrake++;
                }
                tries.push(thisTry);
                thisTry = new Object();
                thisTry.moves = 0;
                thisTry.hints = 0;
                thisTry.remediations = 0;
            }
            } 
        } if (ev == 'Ended remediation') {
            inRemediation = false;
        }   
    }
    return tries;
}

function getColorFromIndex(colorIndex) {
    switch (colorIndex) {
        case 0:
            return "none";
        case 1:
            return ("black");
        case 2:
            return ("red");
        case 3:
            return ("yellow");
        case 4:
            return ("blue");
    }
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