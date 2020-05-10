const clutchArray = [
    "clutch-5drakes-starterTraits",
    "clutch-5drakes-starterTraits2",
    "clutch-5drakes-starterTraits3",
    "clutch-5drakes-intermediateTraits",
    "clutch-5drakes-intermediateTraits2",
    "clutch-5drakes-harderTraits-bothParents",
    "clutch-5drakes-harderTraits-bothParents2",
    "siblings-1",
    "siblings-2",
    "siblings-3",
    "test-cross-1",
    "test-cross-2",
    "test-cross-3",
    "test-cross-nosespike-dilute-tail-1",
    "test-cross-nosespike-dilute-tail-2",
    "test-cross-nosespike-dilute-tail-3"];

//Populate a specific clutch challenge for a specific student with an array of outcomes of all the tries on that challenge.

function updateClutchChallenge(chal) {
    if (typeof chal != "undefined") {
        let elapsedTime = getElapsedTime(chal.actions) / 1000;
        /*
        console.log("Class: " + chal.student.class.id + " student " + chal.student.id + " challenge " + chal.name + ", " + chal.tries.length +  " tries, " + elapsedTime + " seconds.");
        */
        chal.elapsedTime = elapsedTime;
    }
}

function updateClutchAction(action) {
    let myStudent = action.student;
    let myActivity = myStudent.activitiesByName[action.activity];
    let tryObj = Object;
    let lastAction = myStudent.actions[action.index - 1];
    switch (action.event) {
        //Navigated events always mean a new myTry with a new drake. The clutchMoves property of the new myTry is set to zero, the minimumClutchMoves value is recovered from the event, and the remediationInProgress flag is set to false (because the student has navigated out of remediation).
        case "Navigated":
            //First check to see whether this navigated event happens very soon after another navigated event, in which case it's a computer glitch and the first action does not constitute a legitimate try. So that try should be popped off the tries array before starting a new one.
            lastAction = myStudent.actions[action.index - 1];
            if (typeof lastAction != "undefined") {
                thisTime = action.unixTime;
                lastTime = lastAction.unixTime;
                if ((lastAction.event == "Navigated") && ((thisTime - lastTime) < 100)) {
                    lastAction.glitch = true;
                    myActivity.tries.pop();
                }
            }
            myTry = new tryObj();
            myTry.startIndex = action.index;
            myTry.newDrake = true;
            myTry.actions = [];
            myTry.actions.push(action);
            myTry.drakeSubmitted = false;
            myTry.remediationInProgress = false;
            myTry.alleleChanges = 0;
            myActivity.tries.push(myTry);
            break;

            //Allele and sex changes are only counted if remediation is not in progress. If no drake has been submitted, they are treated as belonging to the current myTry and increment the targetMatchMoves property of that myTry. If a drake has been submitted on the current myTry then the change is considered the beginning of new myTry but with the same drake. The targetMatchMoves property of the old myTry is retained and used as the starting point for the new myTry. The minimumTargetMatchMoves property is transferred to the new myTry since the drake hasn't changed, but the drakeSubmitted property of the new myTry is set to false.
        case "Allele changed":
            if (!myTry.remediationInProgress) {
                if (myTry.drakeSubmitted) {
                    //Save values from old myTry
                    remediationInProgress = myTry.remediationInProgress;
                    alleleChanges = myTry.alleleChanges;
                    //New myTry
                    myTry = new tryObj();
                    myTry.startIndex = action.index;
                    myTry.newDrake = false;
                    myTry.actions = [];
                    myTry.actions.push(action);
                    myTry.drakeSubmitted = false;
                    myTry.remediationInProgress = remediationInProgress;
                    myTry.alleleChanges = alleleChanges;
                    action.alleleChanges = alleleChanges;
                    myActivity.tries.push(myTry);
                    action.newTry = true;
                } else {
                    myTry.alleleChanges++;
                    action.alleleChanges = myTry.alleleChanges;
                    action.newTry = false;
                }
            }
            break;
        case "Started remediation":
            myTry.remediationInProgress = true;
            break;
        case "Ended remediation":
            myTry.remediationInProgress = false;
            break;
        case "Drake submitted":
            if (!myTry.remediationInProgress) {
                myTry.endIndex = action.index;
                myTry.drakeSubmitted = true;
                (action.parameters.correct === "true" ? myTry.correct = true : myTry.correct = false);
                action.alleleChanges = myTry.alleleChanges;
                if (typeof myTry.actions == "undefined") {
                    elapsedTime = (action.unixTime - lastAction.unixTime) / 1000;
                    console.log("No actions for this try. Previous action was " + elapsedTime + " seconds ago.");
                }
                myTry.actions.push(action);
            }
    }
}

//Add description to individual actions in clutch array of challenges
function describeClutchAction(action) {
    let myFields = Object.keys(action),
        myActivity = action.student.activitiesByName[action.activity],
        myTry = myActivity.tries[myActivity.tries.length - 1],
        data,
        conceptId,
        score,
        trait,
        message,
        description = "";
    switch (action.event) {
        case "Navigated":
            var level = parseInt(action.parameters.level) + 1,
                mission = parseInt(action.parameters.mission) + 1,
                challenge = parseInt(action.parameters.challenge) + 1;
            description = "Level " + level + ", mission " + mission + ", challenge " + challenge;
            (myActivity.tries.length == 1 ? triesStr = " try " : triesStr = " tries ");
            action.description += "This is the start of a new try with a new drake. " + myActivity.tries.length + triesStr + "so far.<br>";
            if (action.index > 0) {
                lastAction = action.student.actions[action.index - 1];
                if (typeof lastAction.glitch != "undefined") {
                    if (lastAction.glitch) {
                        lastAction.description = "<b>This action is a computer glitch and won't be counted!</b>"
                    }
                }
            }
            break;
        case "Guide hint received":
            if (action.parameters.data.sequence) {
                data = action.parameters.data;
                conceptId = data.context.conceptId;
                score = Math.round(1000 * parseFloat(data.context.conceptScore)) / 1000;
                trait = data.context.attribute;
                message = data.context.hintDialog;
                hintLevel = data.context.hintLevel;
            } else {
                data = action.parameters.data;
                conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0];
                score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000;
                trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0];
                message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0];
                hintLevel = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
            }
            description = "Level " + hintLevel + " hint received for  " + trait + ".<br>Message = " + message + "<br>Concept = " + conceptId + ", probability learned = " + score + ".";    
            break;
        case "Drake submitted":
            var correct = (action.parameters.correct === "true");
            var correctStr = (correct ? "Correct" : "Wrong");
            description = correctStr + " drake submitted after " + action.alleleChanges + " allele changes.";
            break;
        case "Allele changed":
            var side = action.parameters.side,
                index = action.parameters.index,
                previousAllele = action.parameters.previousAllele,
                newAllele = action.parameters.newAllele;
            if (index == "1") {
                description = "Allele changed on mother drake, side " +
                    side + ". Allele changed from " + previousAllele + " to " +
                    newAllele + ".";
            } else if (index == "0") {
                description = "Allele changed on father drake, side " +
                    side + ". Allele changed from " + previousAllele + " to " +
                    newAllele + ".<br>";
                description += action.alleleChanges + " allele changes so far on this try.";
            } else {
                description = "Allele changed on side " +
                    side + " from " + previousAllele + " to " +
                    newAllele + ".";
            }
            if (typeof myTry == "undefined") {
                console.log("No tries for this challenge. Class = " + student.class.id + ", student = " + action.student.id + ", challenge = " + myActivity.name);
                console.log("Event = " + action.event + ", index = " + action.index);
            } else if (myTry.remediationInProgress) {
                action.description += "<b>Remediation in progress. Action doesn't count.</b><br>";
            } else if (action.newTry) {
                action.description += "This is the start of a new try with the same drake. " + myActivity.tries.length + triesStr + "so far.<br>";
            }
            break;
        case "Allele selected":
            var gene = action.parameters.gene,
                side = action.parameters.side,
                newAllele = action.parameters.newAllele,
                previousAllele = action.parameters.previousAllele;
            description = "For gene \"" + gene + "\" on chromosome side " + side + ", selected the " + newAllele + " allele.";
            break;
        case "Ready to answer":
            var ready = action.parameters.ready;
            description = "Ready = " + ready + ".";
            break;
        case "Clutch bred":
            description = "Clutch bred; clutch size is " + action.parameters.clutchSize + ".";
            break;
        case "Entered challenge from room":
            description = "Entered challenge.";
            break;
        case "Challenge completed":
            description = "Challenge completed.";
            break;
        case "ITS Data Updated":
            description = action.parameters.studentModel;
            break;

    }
    action.description = description;
}

//For each clutch challenge, run through the filtered students and count up all the hints they receive. Return a promise since the process may take a while.
function getClutchResults(filteredStudents) {
    if (filteredStudents.length == 0) {
        console.log("In getClutchResults. No filtered students.")
    }
    return new Promise((resolve, reject) => {
        var challengeResultsArray = [],
            numStudents = 0,
            studentHintArray = [],
            studentLevel1Hints,
            studentLevel2Hints,
            studentLevel3Hints,
            activityLevel1Hints,
            activityLevel2Hints,
            activityLevel3Hints,
            studentHintScore,
            thisActivity,
            activityHintScores = [],
            hintScoreMeanStdDev = [];
        //Start new activity
        for (let j = 0; j < clutchArray.length; j++) {
            thisActivity = clutchArray[j];
            numStudents = 0;
            activityLevel1Hints = 0;
            activityLevel2Hints = 0;
            activityLevel3Hints = 0;
            activityHintScores = [];
            //Start new student
            for (let i = 0; i < filteredStudents.length; i++) {
                thisStudent = filteredStudents[i];
                studentHintArray = [0, 0, 0];
                numStudents++;
                studentHintArray = parseHints(thisStudent, thisActivity)
                studentLevel1Hints = studentHintArray[0];
                studentLevel2Hints = studentHintArray[1];
                studentLevel3Hints = studentHintArray[2];
                studentHintScore = studentLevel1Hints + 2 * studentLevel2Hints + 3 * studentLevel3Hints;
                activityLevel1Hints += studentLevel1Hints;
                activityLevel2Hints += studentLevel2Hints;
                activityLevel3Hints += studentLevel3Hints;
                activityHintScores.push(studentHintScore);
            } //New student
            //Gather results for this activity across all (filtered) students
            challengeResults = new Object();
            challengeResults.name = thisActivity;
            challengeResults.totalStudents = numStudents;
            challengeResults.level1Hints = Math.round(1000 * activityLevel1Hints / numStudents) / 1000;
            challengeResults.level2Hints = Math.round(1000 * activityLevel2Hints / numStudents) / 1000;
            challengeResults.level3Hints = Math.round(1000 * activityLevel3Hints / numStudents) / 1000;
            hintScoreMeanStdDev = meanStdDev(activityHintScores);
            challengeResults.hintScoreMean = Math.round(1000 * hintScoreMeanStdDev[0]) / 1000;
            challengeResults.hintScoreStdErr = Math.round(1000 * hintScoreMeanStdDev[2]) / 1000;
            challengeResultsArray.push(challengeResults);
        } //new Activity;
        resolve(challengeResultsArray);
    });
}

function makeClutchTable(clutchResultsArray) {
    var clutchResult, clutchRow, clutchCell1, clutchCell2, clutchCell3, clutchCell4;
    clear(clutchBody);
    for (let i = 0; i < clutchResultsArray.length; i++) {
        clutchResult = clutchResultsArray[i];
        clutchRow = document.createElement("tr");
        clutchCell1 = document.createElement("td");
        clutchCell2 = document.createElement("td");
        clutchCell3 = document.createElement("td");
        clutchCell4 = document.createElement("td");
        clutchCell5 = document.createElement("td");
        clutchCell6 = document.createElement("td");
        clutchRow.appendChild(clutchCell1);
        clutchRow.appendChild(clutchCell2);
        clutchRow.appendChild(clutchCell3);
        clutchRow.appendChild(clutchCell4);
        clutchRow.appendChild(clutchCell5);
        clutchRow.appendChild(clutchCell6);
        clutchBody.appendChild(clutchRow);
        clutchCell1.innerHTML = clutchResult.name;
        clutchCell2.innerHTML = clutchResult.totalStudents;
        clutchCell3.innerHTML = clutchResult.level1Hints;
        clutchCell4.innerHTML = clutchResult.level2Hints;
        clutchCell5.innerHTML = clutchResult.level3Hints;
        clutchCell6.innerHTML = clutchResult.hintScoreMean + " " + String.fromCharCode(177) + " " + clutchResult.hintScoreStdErr;
    }
}

function makeClutchCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Gamete arrays are different sizes!")
    }
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4, compCell5, compCell6, compCell7;
    var compBody = clutchCompBody;
    clear(compBody);
    for (let i = 0; i < resultArray1.length; i++) {
        result1 = resultArray1[i];
        result2 = resultArray2[i];
        //Make row for first cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell1.rowSpan = 2;
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compCell4 = document.createElement("td");
        compCell5 = document.createElement("td");
        compCell6 = document.createElement("td");
        compCell7 = document.createElement("td");

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compRow.appendChild(compCell7);
        compBody.appendChild(compRow);

        compCell1.style.borderTopWidth = "2px";
        compCell2.style.borderTopWidth = "2px";
        compCell3.style.borderTopWidth = "2px";
        compCell4.style.borderTopWidth = "2px";
        compCell5.style.borderTopWidth = "2px";
        compCell6.style.borderTopWidth = "2px";
        compCell7.style.borderTopWidth = "2px";

        compCell1.innerHTML = result1.name;
        compCell2.innerHTML = 1
        compCell3.innerHTML = result1.totalStudents;
        compCell4.innerHTML = result1.level1Hints;
        compCell5.innerHTML = result1.level2Hints;
        compCell6.innerHTML = result1.level3Hints;
        compCell7.innerHTML = result1.hintScoreMean + " " + String.fromCharCode(177) + " " + result1.hintScoreStdErr;

        //Make row for second cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compCell4 = document.createElement("td");
        compCell5 = document.createElement("td");
        compCell6 = document.createElement("td");

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compBody.appendChild(compRow);

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.level1Hints;
        compCell4.innerHTML = result2.level2Hints;
        compCell5.innerHTML = result2.level3Hints;
        compCell6.innerHTML = result2.hintScoreMean + " " + String.fromCharCode(177) + " " + result2.hintScoreStdErr;
    }
}

function checkoutClutchBothParentsHints() {
    for (student of students) {
        if (student) {
            if (student.activitiesByName[
                    "clutch-5drakes-harderTraits-bothParents"]) {
                var numHints = student.activitiesByName[
                    "clutch-5drakes-harderTraits-bothParents"].hints.length;
                if (numHints > 50) {
                    console.log("Student " + student.id + " of teacher " + student.teacher.id + " of class " + student.class.id + " got " + numHints + " hints on both parents challenge.");
                }
            }
            if (student.activitiesByName[
                    "clutch-5drakes-harderTraits-bothParents2"]) {
                var numHints = student.activitiesByName[
                    "clutch-5drakes-harderTraits-bothParents2"].hints.length;
                if (numHints > 50) {
                    console.log("Student " + student.id + " of teacher " + student.teacher.id + ", class " + student.class.id + " got " + numHints + " hints on both parents 2 challenge.");
                }
            }
        }
    }
}