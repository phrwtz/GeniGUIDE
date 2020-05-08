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

const simpleDomArray = [
    "allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2"
];

const armorHornsArray = [
    "allele-targetMatch-visible-armorHorns",
    "allele-targetMatch-visible-armorHorns2",
    "allele-targetMatch-visible-armorHorns3",
    "allele-targetMatch-hidden-armorHorns",
    "allele-targetMatch-hidden-armorHorns2",
    "allele-targetMatch-hidden-armorHorns3"
];

const colorArray = [
    "allele-targetMatch-visible-simpleColors",
    "allele-targetMatch-visible-simpleColors2",
    "allele-targetMatch-visible-simpleColors3",
    "allele-targetMatch-visible-simpleColors4",
    "allele-targetMatch-visible-simpleColors5",
    "allele-targetMatch-hidden-simpleColors",
    "allele-targetMatch-hidden-simpleColors2",
    "allele-targetMatch-hidden-simpleColors3"
];

const harderTraitsArray = [
    "allele-targetMatch-visible-harderTraits",
    "allele-targetMatch-visible-harderTraits2",
    "allele-targetMatch-hidden-harderTraits",
    "allele-targetMatch-hidden-harderTraits2"
];

//Return the average scores for each challenge type (simpleDom, armorHorns, color, and harderTraits) for <student></student>
function averageChallengeScores(student) {
    let simpleProArr = [],
        armorProArr = [],
        colorProArr = [],
        harderProArr = [],
        simpleEngArr = [],
        armorEngArr = [],
        colorEngArr = [],
        harderEngArr = [];
    for (chal of simpleDomArray) {
        myActivity = student.activitiesByName[chal];
        if (typeof myActivity === "undefined") {
            simpleProArr.push(null);
            simpleEngArr.push(null);
        } else {
            simpleProArr.push(myActivity.score[0]);
            simpleEngArr.push(myActivity.score[1]);
        }
    }
    for (chal of armorHornsArray) {
        myActivity = student.activitiesByName[chal];
        if (typeof myActivity === "undefined") {
            armorProArr.push(null);
            armorEngArr.push(null);
        } else {
            armorProArr.push(myActivity.score[0]);
            armorEngArr.push(myActivity.score[1]);
        }
    }
    for (chal of colorArray) {
        myActivity = student.activitiesByName[chal];
        if (typeof myActivity == "undefined") {
            colorProArr.push(null);
            colorEngArr.push(null);
        } else {
            colorProArr.push(myActivity.score[0]);
            colorEngArr.push(myActivity.score[1]);
        }
    }
    for (chal of harderTraitsArray) {
        myActivity = student.activitiesByName[chal];
        if (typeof myActivity == "undefined") {
            harderProArr.push(null);
            harderEngArr.push(null);
        } else {
            harderProArr.push(myActivity.score[0]);
            harderEngArr.push(myActivity.score[1]);
        }
    }
    let simpleProAvg = Math.round(100 * meanStdDev(simpleProArr)[0]) / 100;
    let armorProAvg = Math.round(100 * meanStdDev(armorProArr)[0]) / 100;
    let colorProAvg = Math.round(100 * meanStdDev(colorProArr)[0]) / 100;
    let harderProAvg = Math.round(100 * meanStdDev(harderProArr)[0]) / 100;
    let simpleEngAvg = Math.round(100 * meanStdDev(simpleEngArr)[0]) / 100;
    let armorEngAvg = Math.round(100 * meanStdDev(armorEngArr)[0]) / 100;
    let colorEngAvg = Math.round(100 * meanStdDev(colorEngArr)[0]) / 100;
    let harderEngAvg = Math.round(100 * meanStdDev(harderEngArr)[0]) / 100;
    return [simpleProAvg, armorProAvg, colorProAvg, harderProAvg, simpleEngAvg, armorEngAvg, colorEngAvg, harderEngAvg];
}

//Score <challenge>. Return an array for proficiency and engagement.
function scoreChallenge(challenge) {
    //Rows are tries (if blue obtained before the end, later tries don't count), columns are crystal values (0 => no crystal – hard to do, must navigate to next challenge!)
    // proficiencyScore = proficiencyScoreArray[triesForBlue - 1][bestCrystal];
    const proficiencyScoreArray = [
        [0, 0, 1, 3, 5], //1 try for blue
        [0, 0, 0, 2, 4], //2 tries for yellow
        [0, 0, 0, 1, 3], //3 tries for red
        [0, 0, 0, 0, 1], //4 tries for black
        [0, 0, 0, 0, 0] //5 tries for none
        //no, black, red, yellow, blue crystal
    ];
    const engagementScoreArray = [
        [0, 0, 0, 0, null],
        [0, 1, 1, 1, 2],
        [0, 1, 2, 2, 4],
        [0, 2, 3, 3, 5],
        [0, 3, 4, 4, 5]
    ];
    let triesArr = challenge.outcomesArr;
    let subsArr = getSubmissions(triesArr);
    let subs = subsArr.length;
    if (subs > 0) {
        let posBlue = getFirstBluePosition(subsArr);
        let bestCrystal = getBestCrystal(subsArr);
        let triesForBlue;
        let proficiencyScore = null;
        let engagementScore = null;
        if (bestCrystal == 0) { //No crystal, no tries
            triesForBlue = -1;
        } else if (posBlue == 0) { //No blue, tries = total tries
            triesForBlue = subs;
        } else {
            triesForBlue = posBlue; //Got blue, tries = up to and including first blue try
        }
        if (triesForBlue < 0) { //Didn't get a crystal on challenge
            proficiencyScore = 0;
            engagementScore = 0;
        } else if (triesForBlue > 5) { //Tried really hard!
            proficiencyScore = 0;
            engagementScore = 5;
        } else {
            proficiencyScore = proficiencyScoreArray[triesForBlue - 1][bestCrystal];
            engagementScore = engagementScoreArray[triesForBlue - 1][bestCrystal];
        }
        return [proficiencyScore, engagementScore];
    } else { //No drake submissions
        return [0, 0];
    }
}

function getSubmissions(arr) {
    let subs = [];
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i] === "blue") || (arr[i] === "yellow") || (arr[i] === "red") || (arr[i] === "black") || (arr[i] === "bad")) {
            subs.push(arr[i]);
        }
    }
    return subs;
}

function getFirstBluePosition(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "blue") {
            return (i + 1);
        }
    }
    return 0;
}

function getNumericalCrystalValue(str) {
    value = 0;
    switch (str) {
        case "blue":
            value = 4;
            break;
        case "yellow":
            value = 3;
            break;
        case "red":
            value = 2;
            break;
        case "black":
            value = 1;
            break;
        case "bad":
            value = 0;
            break;
    }
    return value;
}

function getBestCrystal(arr) {
    let value = -1;
    let crystalValue = 0;
    for (let i = 0; i < arr.length; i++) {
        crystalValue = getNumericalCrystalValue(arr[i]);
        if (crystalValue > value) {
            value = crystalValue;
        }
    }
    return value;
}

//Populate a specific target match challenge for a specific student with an array of outcomes of all the tries on that challenge. Then give the challenge a category and a score.

function updateTargetMatchChallenge(chal) {
    if (typeof chal != "undefined") {
        let outcomesStr = "";
        chal.noSubmissionUnder = 0;
        chal.noSubmissionOver = 0;
        chal.noSubmissionZero = 0;
        chal.badSubmission = 0;
        chal.blackSubmission = 0;
        chal.redSubmission = 0;
        chal.yellowSubmission = 0;
        chal.blueSubmission = 0;
        chal.outcomesArr = [];
        chal.outcomesStr = "";
        chal.score = 0;
        chal.elapsedTime = getElapsedTime(chal.actions) / 1000;
        for (let i = 0; i < chal.tries.length; i++) {
            myTry = chal.tries[i];
            (myTry.newDrake ? newStr = " New drake. " : newStr = " Old drake. ")
            if (myTry.drakeSubmitted) {
                if (!myTry.correct) { //Incorrect submission
                    outcomesStr = "Student submitted an incorrect drake.";
                    myTry.outcome = "bad";
                } else { //Correct submission. Find crystal color
                    outcomesStr = "Student submitted a correct drake and earned a " + myTry.crystalColor + " crystal (index = " + myTry.crystalIndex + ").";
                    switch (myTry.crystalColor) {
                        case "black":
                            myTry.outcome = "black";
                            chal.blackSubmission++;
                            break;
                        case "red":
                            myTry.outcome = "red";
                            chal.redSubmission++;
                            break;
                        case "yellow":
                            myTry.outcome = "yellow";
                            chal.yellowSubmission++;
                            break;
                        case "blue":
                            myTry.outcome = "blue";
                            chal.blueSubmission++;
                            break;
                    }
                }
            } else { //No submission.
                outcomesStr = "Student retried without submitting a drake.";
                if (myTry.targetMatchMoves >= myTry.minimumTargetMatchMoves) {
                    myTry.outcome = "noOver";
                    chal.noSubmissionOver++;
                } else if (myTry.targetMatchMoves == 0) {
                    myTry.outcome = "noZero";
                    chal.noSubmissionZero++;
                } else {
                    myTry.outcome = "noUnder";
                    chal.noSubmissionUnder++;
                }
            }
            outcomesStr += myTry.outcome + "-";
            chal.outcomesArr.push(myTry.outcome);
        }
        chal.outcomesStr = outcomesStr.slice(0, outcomesStr.length - 1);
        chal.category = categorizeChallenge(chal);
        chal.score = scoreChallenge(chal);
        return [chal.noSubmissionOver, chal.noSubmissionZero, chal.noSubmissionUnder, chal.badSubmission, chal.blackSubmission, chal.redSubmission, chal.yellowSubmission, chal.blueSubmission];
    }
}

//Based on the outcomesArray of <challenge>, give it a category as follows: "perfect" if blue crystal on first try, "not bad" if blue crystal on second or third try, "OK" if more than three tries to get blue crystal, "moved on" if quit after first successful submission and it didn't get a blue crystal, "gave up" if quit after two or more successful submissions none of which got a blue crystal, " (struggled)" added to category if three or more bad submissions.

function categorizeChallenge(chal) {
    let out = chal.outcomesArr;
    let len = out.length;
    let bluePos = -1; //position of first blue crystal in chal
    let numNotBlue = 0; //number of non-blue crystals received
    let numBad = 0;
    let cat = ""; //string for challenge category

    for (let i = 0; i < len; i++) {
        if (out[i] == "blue") {
            bluePos = i;
        } else if ((out[i] == "black") || (out[i] == "red") || (out[i] == "yellow")) {
            numNotBlue++;
        } else if (out[i] == "bad") {
            numBad++;
        }
    }
    if (bluePos != -1) {
        switch (bluePos) {
            case 0:
                cat = "perfect";
                break;
            case 1:
                cat = "not bad";
                break;
            case 2:
                cat = "OK";
                break;
        }
        if (bluePos > 2) {
            cat = "barely";
        }
    } else { //No blue crystal
        if (numNotBlue == 1) {
            cat = "moved on";
        } else if (numNotBlue >= 2) {
            cat = "gave up";
        }
    }
    if (numBad > 2) {
        cat += " (struggled)";
    }
    let recentColor = "";
    let improvedAdded = false;
    for (let j = 0; j < len; j++) {
        if ((out[j] == "black") || (out[j] == "red") || (out[j] == "yellow")) {
            recentColor = out[j];
            for (let k = j; k < len; k++) {
                if ((recentColor != "") && (out[k] == "noOver")) {
                    for (let l = k; l < len; l++) {
                        if (((recentColor == "black") && ((out[l] == "red") || (out[l] == "yellow") || (out[l] == "blue"))) || ((recentColor == "red") && ((out[l] == "yellow") || (out[l] == "blue"))) || ((recentColor == "yellow") && (out[l] == "blue"))) {
                            if (!improvedAdded) {
                                cat += " improved";
                                improvedAdded = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return cat;
}

function updateTargetMatchAction(action) {
    let myStudent = action.student;
    let myActivity = myStudent.activitiesByName[action.activity];
    let tryObj = Object;
    let lastAction = myStudent.actions[action.index - 1];
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
                    myTry.actions.push(action);
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
                    elapsedTime = (action.unixTime - lastAction.unixTime) / 1000;
                    console.log("No actions for this try. Previous action was " + elapsedTime + " seconds ago.");
                }
                myTry.actions.push(action);
            }
    }
}

//Add description to individual actions in target match array of challenges
function describeTargetMatchAction(action) {
    let myFields = Object.keys(action),
        myActivity = action.student.activitiesByName[action.activity],
        myTry = myActivity.tries[myActivity.tries.length - 1],
        data,
        conceptId,
        score,
        trait,
        practice,
        message,
        tab4 = "&#9;",
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
            if (data.sequence == "*** PARSE ERROR #1: MISSING VALUE") {
                action.description = "Parse error: hint not logged."
            } else {
                conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0];
                score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000;
                trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0];
                message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0];
                level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
                action.description += "<pre>" + tab4 + "<b>Level " + level + "</b> hint received for <b>" + trait + ".<br>" + tab4 + "Message = </b>" + message + "<br>" + tab4 + "<b>Concept = </b>" + conceptId + ", <b>probability learned =</b> " + score + ".</pre>";
            }
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
            if (typeof myTry === "undefined") {
                console.log("myTry.targetMatchMoves is undefined.");
            } else {
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
            }
            break;
        case "Navigated":
            if (typeof myTry == "undefined") {
     //           console.log("No try defined for student " + action.student.id + " of teacher " + action.student.teacher.id + ", on action number " + action.index + " in challenge " + action.activity + ". The event is " + action.event);
                action.description = "No try defined for this action."
            } else {
                level = parseInt(action.parameters.level) + 1;
                mission = parseInt(action.parameters.mission) + 1;
                if (typeof action.parameters.targetDrake.alleleString != "undefined") { //2020 student
                    ig = action.parameters.initialDrake.alleleString;
                    if (typeof action.parameters.initialDrake.secondXAlleles != "undefined") {
                        initialSex = "female";
                        initialSexInteger = 1;
                    } else {
                        initialSex = "male";
                        initialSexInteger = 0;
                    }
                    tg = action.parameters.targetDrake.alleleString;
                    if (typeof action.parameters.targetDrake.secondXAlleles != "undefined") {
                        targetSex = "female";
                        targetSexInteger = 1;
                    } else {
                        targetSex = "male";
                        targetSexInteger = 0;
                    }
                } else {
                    targetGenotype = action.parameters.targetDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
                    initialGenotype = action.parameters.initialDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
                    //Get rid of that pesky comma and quotation mark at the end
                    tg = targetGenotype.slice(0, targetGenotype.length - 2);
                    ig = initialGenotype.slice(0, initialGenotype.length - 2);
                    targetSexInteger = action.parameters.targetDrake.match(/(?<="sex"=>)([\d])/)[1];
                    initialSexInteger = action.parameters.initialDrake.match(/(?<="sex"=>)([\d])/)[1];
                    (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
                    (initialSexInteger == "1" ? initialSex = "female" : initialSex = "male");
                }
                myTry.targetGenotype = tg;
                myTry.targetSexInteger = targetSexInteger;
                myTry.targetSex = targetSex;
                myTry.initialGenotype = ig;
                myTry.initialSex = initialSex;
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
      //          console.log("No try defined for student " + action.student.id + " of teacher " + action.student.teacher.id + ", on action number " + action.index + " in challenge " + action.activity + ". The event is " + action.event);
                action.description = "No try defined for this action."
            } else {
                target = action.parameters.target;
                selected = action.parameters.selected;
                if (target.sex === "*** PARSE ERROR #1: MISSING VALUE") {
                    sg = selected.alleles;
                    if (selected.alleles.length == 92) {
                        selectedSex = "male";
                        selectedSexInteger = 0;
                    } else {
                        selectedSex = "female";
                        selectedSexInteger = 1;
                    }
                    selectedOrg = new BioLogica.Organism(BioLogica.Species.Drake, sg, selectedSexInteger);
                    sp = selectedOrg.phenotype.allCharacteristics;
                    targetGenotype = myTry.targetGenotype;
                    targetSexInteger = myTry.targetSexInteger;
                    targetSex = myTry.targetSex;
                    selectedOrg = new BioLogica.Organism(BioLogica.Species.Drake, targetGenotype, targetSexInteger);
                    tp = selectedOrg.phenotype.allCharacteristics;
                } else {
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
                }
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