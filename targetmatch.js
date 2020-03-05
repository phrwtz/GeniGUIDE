const targetMatchArray = [
    "allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2",
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

//Go through all the students in <students> and look at all the actions for each. For each action that is in a target match challenge, add the appropriate info.
function updateTargetMatchForAllStudents(students) {
    for (student of students) {
        for (action of student.actions) {
            if (targetMatchArray.includes(action.activity)) {
                updateTargetMatchMoves(action);
                describeTargetMatch(action);
            }
        }
    }
}

function updateTargetMatchMoves(action) {
    let myStudent = action.student;
    let myActivity = myStudent.activitiesByName[action.activity];
    let tryObj = Object;
    if ((myStudent.id == 273326) && (myActivity.name == "allele-targetMatch-hidden-simpleDom")) {
        console.log("stop");
    }
    switch (action.event) {
        //Navigated events always mean a new myTry with a new drake. The targetMatchMoves property of the new myTry is set to zero, the minimumTargetMatchMoves value is recovered from the event, and the remediationInProgress flag is set to false (because the student has navigated out of remediation).
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
            myTry.targetMatchMoves = 0;
            myTry.minimumTargetMatchMoves = parseInt(action.parameters.goalMoves);
            myActivity.tries.push(myTry);
            break;

            //Allele and sex changes are only counted if remediation is not in progress. If no drake has been submitted, they are treated as belonging to the current myTry and increment the targetMatchMoves property of that myTry. If a drake has been submitted on the current myTry then the change is considered the beginning of new myTry but with the same drake. The targetMatchMoves property of the old myTry is retained and used as the starting point for the new myTry. The minimumTargetMatchMoves property is transferred to the new myTry since the drake hasn't changed, but the drakeSubmitted property of the new myTry is set to false.
        case "Allele changed":
            if (!myTry.remediationInProgress) {
                if (myTry.drakeSubmitted) {
                    //Save values from old myTry
                    targetMatchMoves = myTry.targetMatchMoves;
                    minimumTargetMatchMoves = myTry.minimumTargetMatchMoves;
                    remediationInProgress = myTry.remediationInProgress;
                    //New myTry
                    myTry = new tryObj();
                    myTry.startIndex = action.index;
                    myTry.newDrake = false;
                    myTry.actions = [];
                    myTry.actions.push(action);
                    myTry.drakeSubmitted = false;
                    myTry.targetMatchMoves = targetMatchMoves + 1;
                    myTry.minimumTargetMatchMoves = minimumTargetMatchMoves;
                    myTry.remediationInProgress = remediationInProgress;
                    myActivity.tries.push(myTry);
                    action.newTry = true;
                } else {
                    myTry.targetMatchMoves++;
                    action.newTry = false;
                }
            }
            break;
        case "Sex changed":
            if (!myTry.remediationInProgress) {
                if (myTry.drakeSubmitted) {
                    targetMatchMoves = myTry.targetMatchMoves;
                    minimumTargetMatchMoves = myTry.minimumTargetMatchMoves;
                    remediationInProgress = myTry.remediationInProgress;
                    myTry = new tryObj();
                    myTry.startIndex = action.index;
                    myTry.newDrake = false;
                    myTry.actions = [];
                    myTry.actions.push(action);
                    myTry.drakeSubmitted = false;
                    myTry.targetMatchMoves = targetMatchMoves + 1;
                    myTry.minimumTargetMatchMoves = minimumTargetMatchMoves;
                    myTry.remediationInProgress = remediationInProgress;
                    myActivity.tries.push(myTry);
                    action.newTry = true;
                } else {
                    myTry.targetMatchMoves++;
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
                myTry.excessMoves = myTry.targetMatchMoves - myTry.minimumTargetMatchMoves;
                action.excessMoves = myTry.excessMoves;
                action.crystalIndex = getCrystalIndex(myTry, action);
                myTry.crystalIndex = action.crystalIndex;
                myTry.crystalColor = getCrystalColor(myTry.crystalIndex);
                if (typeof myTry.actions == "undefined") {
                    console.log("No actions for this try.")
                }
                myTry.actions.push(action);
            }
    }
}
//Run through all the students and all the target match challenges, populating the challenges with the six different try outcomes,
function updateAllChallenges(students) {
    let noOver = 0,
        noZero = 0,
        noUnder = 0,
        bad = 0,
        black = 0,
        red = 0,
        yellow = 0,
        blue = 0,
        outcomeArr = [];
    for (i = 0; i < students.length; i++) {
        for (j = 0; j < targetMatchArray.length; j++) {
            outcomeArr = summarizeTries(i, j);
            noOver += outcomeArr[0];
            noZero += outcomeArr[1];
            noUnder += outcomeArr[2];
            bad += outcomeArr[3];
            black += outcomeArr[4];
            red += outcomeArr[5];
            yellow += outcomeArr[6];
            blue += outcomeArr[7];
        }
    }
    let totalTries = noOver + noZero + noUnder + bad + black + red + yellow + blue;
    let percentOver = Math.round((noOver / totalTries) * 100);
    let percentUnder = Math.round((noUnder / totalTries) * 100);
    let percentZero = Math.round((noZero / totalTries) * 100);
    let percentBad = Math.round((bad / totalTries) * 100);
    let percentBlack = Math.round((black / totalTries) * 100);
    let percentRed = Math.round((red / totalTries) * 100);
    let percentYellow = Math.round((yellow / totalTries) * 100);
    let percentBlue = Math.round((blue / totalTries) * 100);

    console.log("Total tries = " + totalTries);
    console.log("noOver = " + noOver + ", noZero = " + noZero + ", noUnder = " + noUnder + ", bad = " + bad + ", black = " + black + ", red = " + red + ", yellow = " + yellow + ", blue = " + blue);
    console.log("noOver% = " + percentOver + ", noZero% = " + percentZero + ", noUnder% = " + percentUnder + ", bad% = " + percentBad + ", black% = " + percentBlack + ", red% = " + percentRed + ", yellow% = " + percentYellow + ", blue% = " + percentBlue);
}

//Summarize all the tries on a particular challenge for a particular student
function summarizeTries(studentIndex, challengeIndex) {
    let outcomeStr = "";
    let newStr = "";
    let myTries = [];
    student = students[studentIndex];
    challenge = targetMatchArray[challengeIndex];
    myActivity = student.activitiesByName[challenge];
    if (typeof myActivity == "undefined") {
  //      console.log("Student " + student.id + " hasn't done anything on challenge " + challenge);
        return [0, 0, 0, 0, 0, 0, 0, 0];
    } else {
        try {
            myTries = myActivity.tries;
        } catch (err) {
            console.log("no tries");
        };
        myActivity.outcomes = [];
        myActivity.noSubmissionUnder = 0;
        myActivity.noSubmissionOver = 0;
        myActivity.noSubmissionZero = 0;
        myActivity.badSubmission = 0;
        myActivity.blackSubmission = 0;
        myActivity.redSubmission = 0;
        myActivity.yellowSubmission = 0;
        myActivity.blueSubmission = 0;

        //     console.log("Working on student " + student.id + "(" + studentIndex + ") in class " + student.class.id + ", challenge " + challenge + "(" + challengeIndex + ")");
        for (let i = 0; i < myTries.length; i++) {
            myTry = myTries[i];
            (myTry.newDrake ? newStr = " New drake. " : newStr = " Old drake. ")
            if (myTry.drakeSubmitted) {
                if (!myTry.correct) { //Incorrect submission
                    outcomeStr = "Student submitted an incorrect drake.";
                    myTry.outcome = "bad";
                    myActivity.badSubmission++;
                } else { //Correct submission. Find crystal color
                    outcomeStr = "Student submitted a correct drake and earned a " + myTry.crystalColor + " crystal (index = " + myTry.crystalIndex + ").";
                    switch (myTry.crystalColor) {
                        case "black":
                            myTry.outcome = "black";
                            myActivity.blackSubmission++;
                            break;
                        case "red":
                            myTry.outcome = "red";
                            myActivity.redSubmission++;
                            break;
                        case "yellow":
                            myTry.outcome = "yellow";
                            myActivity.yellowSubmission++;
                            break;
                        case "blue":
                            myTry.outcome = "blue";
                            myActivity.blueSubmission++;
                            break;
                    }
                    //     console.log("Try number " + (i + 1) + " started on action " + myTry.startIndex + ". " + newStr + outcomeStr);
                }
            } else { //No submission.
                outcomeStr = "Student retried without submitting a drake.";
                if (myTry.targetMatchMoves >= myTry.minimumTargetMatchMoves) {
                    myTry.outcome = "noOver";
                    myActivity.noSubmissionOver++;
                } else if (myTry.targetMatchMoves == 0) {
                    myTry.outcome = "noZero";
                    myActivity.noSubmissionZero++;
                } else {
                    myTry.outcome = "noUnder";
                    myActivity.noSubmissionUnder++;
                }
            }
            myActivity.outcomes.push(myTry.outcome);
        }
        return [myActivity.noSubmissionOver, myActivity.noSubmissionZero, myActivity.noSubmissionUnder, myActivity.badSubmission, myActivity.blackSubmission, myActivity.redSubmission, myActivity.yellowSubmission, myActivity.blueSubmission];
        //     console.log("No = " + myActivity.noSubmission + ", bad = " + myActivity.badSubmission + ", black = " + myActivity.blackSubmission + ", red = " + myActivity.redSubmission + ", yellow = " + myActivity.yellowSubmission + ", blue = " + myActivity.blueSubmission);
    }
}

//Create a string consisting of a header row and a row for each student in <selectedStudents> with columns corresponding to the numbers of tries of each type for each target matching challenge for each student.
function makeTriesCSVFile(selectedStudents) {
    let triesStr = makeTriesHeaderRow();
    for (studIndex = 0; studIndex < selectedStudents.length; studIndex++) {
        student = selectedStudents[studIndex];
        if (student.score_pre == undefined) {
            student.score_pre = null;
        }
        if (student.score_post == undefined) {
            student.score_post = null;
        }
        triesStr += ("\n" + student.teacher.id + ", " + student.class.id + ", " + student.id + ", " + student.score_pre + ", " + student.score_post + ", ");
        for (chalIndex = 0; chalIndex < targetMatchArray.length; chalIndex++) {
            let noOver = 0, noZero = 0,  noUnder = 0, bad = 0, black = 0, red = 0,yellow = 0,blue = 0;
            chalName = targetMatchArray[chalIndex];
            myActivity = student.activitiesByName[chalName];
            if (typeof myActivity != "undefined") {
                summarizeTries(studIndex, chalIndex);
                noUnder = myActivity.noSubmissionUnder;
                noOver = myActivity.noSubmissionOver;
                noZero = myActivity.noSubmissionZero;
                bad = myActivity.badSubmission;
                black = myActivity.blackSubmission;
                red = myActivity.redSubmission;
                yellow = myActivity.yellowSubmission;
                blue = myActivity.blueSubmission;
            }
            triesStr += (", " + noUnder + ", " + noZero + ", " + noOver + ", " + bad + ", " + black + ", " + red + ", " + yellow + ", " + blue);
        }
    }
    let fileName = prompt("Enter file name");
    (saveData)()(triesStr, fileName);
};

function makeTriesHeaderRow() {
    const tryTypes = ["noUnder", "noZero", "noOver", "bad", "black", "red", "yellow", "blue"];
    let triesStr = "Teacher, Class, Student, Pre-score, Post-score";
    let shortChallenge;
    for (challenge of targetMatchArray) {
        shortChallenge = challenge.split("-")[2] + "-" + challenge.split("-")[3];
        triesStr += ", " + shortChallenge + "-" + "noUnder, " + shortChallenge + "-" + "noZero, " + shortChallenge + "-" + "noOver, " + shortChallenge + "-" + "bad, " + shortChallenge + "-" + "black, " + shortChallenge + "-" + "red, " + shortChallenge + "-" + "yellow, " + shortChallenge + "-" + "blue";
    }
    return triesStr;
}


//Add description to individual actions in target match array of challenges
function describeTargetMatch(action) {
    var myFields = Object.keys(action),
        myActivity = action.student.activitiesByName[action.activity],
        myTry = myActivity.tries[myActivity.tries.length - 1],
        data,
        conceptId,
        score,
        trait,
        practice,
        message,
        tab4 = "&#9;",
        description = "",
        targetGenotype,
        selectedGenotype,
        initialGenotype,
        initialSex,
        target,
        selected,
        targetSex,
        targetSexInteger,
        initialSexInteger,
        ig,
        tg,
        moveStr;
    action.description = "";
    switch (action.event) {
        case "Guide hint received":
            data = action.parameters.data;
            conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0];
            score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000;
            trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0];
            message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0];
            level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
            action.description += "<pre>" + tab4 + "<b>Level " + level + "</b> hint received for <b>" + trait + ".<br>" + tab4 + "Message = </b>" + message + "<br>" + tab4 + "<b>Concept = </b>" + conceptId + ", <b>probability learned =</b> " + score + ".</pre>";
            break;
        case "Allele changed":
            chromosome = action.parameters.chromosome;
            side = action.parameters.side;
            previousAllele = action.parameters.previousAllele;
            newAllele = action.parameters.newAllele;
            if (typeof myTry == "undefined") {
                console.log("No try defined for student " + action.student.id + " of teacher " + action.student.teacher.id + ", on action number " + action.index + " in challenge " + action.activity + ". The event is " + action.event);
                action.description = "No try defined for this action."
            } else {
                (myTry.targetMatchMoves == 1 ? moveStr = " move" : moveStr = " moves");
                (myActivity.tries.length == 1 ? triesStr = " try " : triesStr = " tries ");
                action.description += "Old allele = <b>" + previousAllele + "</b>, new Allele = <b>" + newAllele + "</b>, side = " + side + ".<br>That's " + myTry.targetMatchMoves + moveStr + " on this challenge so far.<br>";
                if (myTry.remediationInProgress) {
                    action.description += "<b>Remediation in progress. Action doesn't count.</b><br>";
                } else if (action.newTry) {
                    action.description += "This is the start of a new try with the same drake. " + myActivity.tries.length + triesStr + "so far.<br>";
                }
            }
            break;
        case "Sex changed":
            (myTry.targetMatchMoves == 1 ? moveStr = " move" : moveStr = " moves");
            (myTry.targetMatchMoves == 1 ? moveStr = " move" : moveStr = " moves");
            (action.parameters.newSex == "1" ? action.description += "Changed sex from male to female." : action.description += "Changed sex from female to male.");
            action.description += "<br>That makes " + myTry.targetMatchMoves + moveStr + " on this challenge so far.<br>";
            (myActivity.tries.length == 1 ? triesStr = " try " : triesStr = " tries ");
            if (myTry.remediationInProgress) {
                action.description += "<b>Remediation in progress. Action doesn't count.</b><br>";
            } else if (action.newTry) {
                action.description += "This is the start of a new try with the same drake. " + myActivity.tries.length + triesStr + "so far.<br>";
                break;
            }
            break;
        case "Navigated":
            if (typeof myTry == "undefined") {
                console.log("No try defined for student " + action.student.id + " of teacher " + action.student.teacher.id + ", on action number " + action.index + " in challenge " + action.activity + ". The event is " + action.event);
                action.description = "No try defined for this action."
            } else {
                level = parseInt(action.parameters.level) + 1;
                mission = parseInt(action.parameters.mission) + 1;
                targetGenotype = action.parameters.targetDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
                initialGenotype = action.parameters.initialDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
                //Get rid of that pesky comma and quotation mark at the end
                tg = targetGenotype.slice(0, targetGenotype.length - 2);
                ig = initialGenotype.slice(0, initialGenotype.length - 2);
                targetSexInteger = action.parameters.targetDrake.match(/(?<="sex"=>)([\d])/)[1];
                initialSexInteger = action.parameters.initialDrake.match(/(?<="sex"=>)([\d])/)[1];
                (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
                (initialSexInteger == "1" ? initialSex = "female" : initialSex = "male");
                action.description += "Level " + level + " mission " + mission + ".<br>Target genotype = " + tg + "<br>Initial genotype = " + ig + "<br>Target sex = " + targetSex + ", initial sex = " + initialSex + ".<br>" + "Minimum moves = " + myTry.minimumTargetMatchMoves + ".<br>";
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
            }
            break;
        case "Drake submitted":
            if (typeof myTry == "undefined") {
                console.log("No try defined for student " + action.student.id + " of teacher " + action.student.teacher.id + ", on action number " + action.index + " in challenge " + action.activity + ". The event is " + action.event);
                action.description = "No try defined for this action."
            } else {
                target = action.parameters.target;
                selected = action.parameters.selected;
                selectedGenotype = selected.match(/(?<=alleles"=>")([^"]+)/)[1];
                targetSexInteger = target.match(/(?<="sex"=>)([\d])/)[1];
                (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
                selectedSexInteger = parseInt(selected.match(/(?<="sex"=>)([\d])/)[1]);
                (selectedSexInteger == "1" ? selectedSex = "female" : selectedSex = "male");
                targetPhenotype = "\'" + target.match(/(?<="phenotype"=>{")([^}]+)/)[1] + "\'";
                tp = targetPhenotype.match(/(?<="=>")([^"]+)/g);
                selectedGenotype = selected.match(/(?<="alleles"=>")([^\s]+)/)[1];
                sg = selectedGenotype.slice(0, selectedGenotype.length - 2);
                selectedOrg = new BioLogica.Organism(BioLogica.Species.Drake, sg, selectedSexInteger);
                sp = selectedOrg.phenotype.allCharacteristics;
                let correct = action.parameters.correct;
                (correct == "true" ? correctStr = "<b>good</b>" : correctStr = "<b>bad</b>");
                (myTry.targetMatchMoves == 1 ? moveStr = " move" : moveStr = " moves");
                action.description += "Target phenotype = " + tp + "<br>Selected phenotype = " + sp + "<br>Selected genotype = " + sg + "<br>Target sex = " + targetSex + ", selected sex = " + selectedSex + "<br>" + myTry.targetMatchMoves + moveStr + "  taken. The minimum was " + myTry.minimumTargetMatchMoves + "<br>The submission is " + correctStr + ". The crystal index is " + myTry.crystalIndex + ".<br>";
                if (myTry.remediationInProgress) {
                    action.description += "<b>Remediation in progress. Crystal index doesn't count.</b><br>";
                }
            }
            break;
        case "ITS Data Updated":
            action.description += action.parameters.studentModel;
            break;
        case "Guide remediation requested":
            trait = action.parameters.attribute;
            practice = action.parameters.practiceCriteria;
            action.description += practice + " remediation has been called for on trait " + trait + ".<br>";
    }
}

//For each target match challenge, find the number of students who have any tries on the challenge, the average number of tries for those students for that challenge, and the average numerical crystal score for that challenge.
function getTargetMatchResults(filteredStudents) {
    if (filteredStudents.length == 0) {
        console.log("In getTargetMatchResults. No filtered students.")
    }
    return new Promise((resolve, reject) => {
        var challengeResultsArray = [];
        var numStudents = 0,
            chalArray = [],
            activityTries = 0,
            tries,
            totalExcessMoves = 0,
            totalCorrect = 0,
            studentLevel1Hints,
            studentLevel2Hints,
            studentLevel3Hints,
            activityLevel1Hints,
            activityLevel2Hints,
            activityLevel3Hints,
            hintScoreArray = [],
            hintScoreMean,
            hintScoreStdDev,
            hintScoreMeanStdDev = [],
            totalRemediations,
            totalNumericalCrystals = 0,
            thisActivity;
        //Start new activity
        for (let j = 0; j < targetMatchArray.length; j++) {
            thisActivity = targetMatchArray[j];
            numStudents = 0;
            activityTries = 0;
            totalNumericalCrystals = 0;
            totalMoves = 0;
            studentLevel1Hints = 0;
            studentLevel2Hints = 0;
            studentLevel3Hints = 0;
            activityLevel1Hints = 0;
            activityLevel2Hints = 0;
            activityLevel3Hints = 0;
            studentActivityHintScores = [];
            totalRemediations = 0;
            //Start new student
            for (let i = 0; i < filteredStudents.length; i++) {
                thisStudent = filteredStudents[i];
                chalArray = checkout(thisStudent.id, thisActivity);
                tries = chalArray[0];
                totalRemediations += chalArray[1];
                //Only count student if s/he tried the activity at least once
                if (tries.length > 0) {
                    studentLevel1Hints = 0;
                    studentLevel2Hints = 0;
                    studentLevel3Hints = 0;
                    numStudents++;
                    var colorIndexArray = [];
                    for (let j = 0; j < tries.length; j++) {
                        thisTry = tries[j];
                        if (thisTry.correct) {
                            totalCorrect++;
                            totalExcessMoves += thisTry.excessMoves;
                        }
                        studentLevel1Hints += thisTry.level1Hints;
                        studentLevel2Hints += thisTry.level2Hints;
                        studentLevel3Hints += thisTry.level3Hints;
                        colorIndexArray.push(thisTry.crystalColor);
                    }
                    studentActivityHintScores.push((studentLevel1Hints + 2 * studentLevel2Hints + 3 * studentLevel3Hints) / tries.length);
                    maxColorIndex = colorIndexArray.reduce(function (a, b) {
                        return Math.max(a, b);
                    });
                    activityTries += tries.length;
                    if (isNaN(maxColorIndex)) {
                        console.log("Stop! Bad crystal!");
                    }
                    totalNumericalCrystals += maxColorIndex;
                }
                activityLevel1Hints += studentLevel1Hints;
                activityLevel2Hints += studentLevel2Hints;
                activityLevel3Hints += studentLevel3Hints;
            } //new student
            challengeResults = new Object();
            challengeResults.hintScores = [];
            challengeResults.name = thisActivity;
            challengeResults.totalStudents = numStudents;
            challengeResults.totalTries = activityTries;
            challengeResults.averageTries = Math.round(100 * activityTries / numStudents) / 100;
            challengeResults.averageExcessMoves = Math.round(100 * totalExcessMoves / totalCorrect) / 100;
            challengeResults.level1Hints = Math.round(1000 * activityLevel1Hints / activityTries) / 1000;
            challengeResults.level2Hints = Math.round(1000 * activityLevel2Hints / activityTries) / 1000;
            challengeResults.level3Hints = Math.round(1000 * activityLevel3Hints / activityTries) / 1000;
            challengeResults.hintScores = studentActivityHintScores;
            hintScoreMeanStdDev = meanStdDev(studentActivityHintScores);
            challengeResults.hintScoreMean = Math.round(1000 * hintScoreMeanStdDev[0]) / 1000;
            challengeResults.hintScoreStdDev = Math.round(1000 * hintScoreMeanStdDev[1]) / 1000;
            challengeResults.hintScoreStdErr = Math.round(1000 * hintScoreMeanStdDev[2]) / 1000;
            challengeResults.totalRemediations = totalRemediations;
            challengeResults.totalNumericalCrystals = totalNumericalCrystals;
            challengeResults.averageNumericalCrystal = Math.round(100 * totalNumericalCrystals / numStudents) / 100;
            challengeResultsArray.push(challengeResults);
        } //newActivity;
        resolve(challengeResultsArray);
    });
}

/* function makeTargetMatchTriesTable(challengeResultsArray) {
    if (typeof targetMatchTable != "undefined") {
        clear(targetMatchTable);
    }
    let targetMatchTable = document.createElement(table);
    let headerRow = document.createElement(th);
    let 

} */

function makeTargetMatchTable(challengeResultsArray) {
    let challengeResult,
        chalRow,
        chalCell;
    clear(targetMatchBody);
    for (let i = 0; i < challengeResultsArray.length; i++) {
        challengeResult = challengeResultsArray[i];
        chalRow = document.createElement("tr");
        chalCell1 = document.createElement("td");
        chalCell2 = document.createElement("td");
        chalCell3 = document.createElement("td");
        chalCell4 = document.createElement("td");
        chalCell5 = document.createElement("td");
        chalCell6 = document.createElement("td");
        chalCell7 = document.createElement("td");
        chalCell8 = document.createElement("td");
        chalCell9 = document.createElement("td");
        chalCell10 = document.createElement("td");

        chalCell6.style.backgroundColor = "cornsilk";
        chalCell7.style.backgroundColor = "cornsilk";
        chalCell8.style.backgroundColor = "cornsilk";
        chalCell9.style.backgroundColor = "cornsilk";
        chalCell10.style.backgroundColor = "azure";

        chalCell1.innerHTML = challengeResult.name;
        chalCell2.innerHTML = challengeResult.totalStudents;
        chalCell3.innerHTML = challengeResult.averageTries;
        chalCell4.innerHTML = challengeResult.averageExcessMoves;
        chalCell5.innerHTML = challengeResult.averageNumericalCrystal;
        chalCell6.innerHTML = challengeResult.level1Hints;
        chalCell7.innerHTML = challengeResult.level2Hints;
        chalCell8.innerHTML = challengeResult.level3Hints;
        chalCell9.innerHTML = challengeResult.hintScoreMean + " " + String.fromCharCode(177) + " " + challengeResult.hintScoreStdErr;
        chalCell10.innerHTML = challengeResult.totalRemediations;
        chalRow.appendChild(chalCell1);
        chalRow.appendChild(chalCell2);
        chalRow.appendChild(chalCell3);
        chalRow.appendChild(chalCell4);
        chalRow.appendChild(chalCell5);
        chalRow.appendChild(chalCell6);
        chalRow.appendChild(chalCell7);
        chalRow.appendChild(chalCell8);
        chalRow.appendChild(chalCell9);
        chalRow.appendChild(chalCell10);
        targetMatchBody.appendChild(chalRow);
    }
}

function makeTargetMatchCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Target match arrays are different sizes!")
    }
    var compTable = document.getElementById("targetMatchCompTable"),
        compBody = document.getElementById("targetMatchCompBody");
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4, compCell5, compCell6, compCell7, compCell8, compCell9, compCell10, compCell11;
    clear(compBody);
    compTable.style.display = "block";
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
        compCell8 = document.createElement("td");
        compCell9 = document.createElement("td");
        compCell10 = document.createElement("td");
        compCell11 = document.createElement("td");

        compCell1.style.borderTopWidth = "2px";
        compCell2.style.borderTopWidth = "2px";
        compCell3.style.borderTopWidth = "2px";
        compCell4.style.borderTopWidth = "2px";
        compCell5.style.borderTopWidth = "2px";
        compCell6.style.borderTopWidth = "2px";
        compCell7.style.borderTopWidth = "2px";
        compCell8.style.borderTopWidth = "2px";
        compCell9.style.borderTopWidth = "2px";
        compCell10.style.borderTopWidth = "2px";
        compCell11.style.borderTopWidth = "2px";

        compCell7.style.backgroundColor = "cornsilk";
        compCell8.style.backgroundColor = "cornsilk";
        compCell9.style.backgroundColor = "cornsilk";
        compCell10.style.backgroundColor = "cornsilk";
        compCell11.style.backgroundColor = "azure";

        compCell1.innerHTML = result1.name;
        compCell2.innerHTML = 1
        compCell3.innerHTML = result1.totalStudents;
        compCell4.innerHTML = result1.averageTries;
        compCell5.innerHTML = result1.averageExcessMoves;
        compCell6.innerHTML = result1.averageNumericalCrystal;
        compCell7.innerHTML = result1.level1Hints;
        compCell8.innerHTML = result1.level2Hints;
        compCell9.innerHTML = result1.level3Hints;
        compCell10.innerHTML = result1.hintScoreMean + " " + String.fromCharCode(177) + " " + result1.hintScoreStdErr;
        compCell11.innerHTML = result1.totalRemediations;

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compRow.appendChild(compCell7);
        compRow.appendChild(compCell8);
        compRow.appendChild(compCell9);
        compRow.appendChild(compCell10);
        compRow.appendChild(compCell11);
        compBody.appendChild(compRow);

        //Make row from second cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compCell4 = document.createElement("td");
        compCell5 = document.createElement("td");
        compCell6 = document.createElement("td");
        compCell7 = document.createElement("td");
        compCell8 = document.createElement("td");
        compCell9 = document.createElement("td");
        compCell10 = document.createElement("td");

        compCell6.style.backgroundColor = "cornsilk";
        compCell7.style.backgroundColor = "cornsilk";
        compCell8.style.backgroundColor = "cornsilk";
        compCell9.style.backgroundColor = "cornsilk";
        compCell10.style.backgroundColor = "azure";

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.averageTries;
        compCell4.innerHTML = result2.averageExcessMoves;
        compCell5.innerHTML = result2.averageNumericalCrystal;
        compCell6.innerHTML = result2.level1Hints;
        compCell7.innerHTML = result2.level2Hints;
        compCell8.innerHTML = result2.level3Hints;
        compCell9.innerHTML = result2.hintScoreMean + " " + String.fromCharCode(177) + " " + result2.hintScoreStdErr;
        compCell10.innerHTML = result2.totalRemediations;

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compRow.appendChild(compCell7);
        compRow.appendChild(compCell8);
        compRow.appendChild(compCell9);
        compRow.appendChild(compCell10);
        compBody.appendChild(compRow);
    }
}