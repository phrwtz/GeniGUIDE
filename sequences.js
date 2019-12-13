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

function checkoutSelectedStudent() {
    var singleSpan = document.getElementById("singleStudentChalButton");
    if (singleSpan.innerText == "Show selected student profile") {
        infoPara.innerHTML = "Individual Student Profile<br>";
        singleSpan.innerText = "Hide selected student profile";
    } else {
        infoPara.innerHTML = "";
        singleSpan.innerHTML = "Show selected student profile";
    }
    var thisStudent,
        thisActivity,
        chalArray,
        tries,
        remediations;
    setSelectedObjects();
    if ((selectedStudents.length > 0) && (selectedActivities.length > 0)) {
        thisStudent = selectedStudents[0];
        for (let i = 0; i < selectedActivities.length; i++) {
            thisActivity = selectedActivities[i];
            chalArray = checkout(thisStudent.id, thisActivity.name);
            tries = chalArray[0];
            remediations = chalArray[1];

        }
    }
}

//Returns an array. The first element is itself an array of tries by the student with <studentId> on <thisActivity>; the second element is the number of remdiations the student had on the activity.
function checkout(studentId, thisActivity) {
    var thisStudent = findStudent(studentId),
        tries = [],
        remediations = 0, //Counts remediations for this activity
        thisAction,
        movesForThisDrake = 0,
        inRemediation = false,
        ev;
    for (var i = 0; i < thisStudent.actions.length; i++) {
        thisAction = thisStudent.actions[i];
        ev = thisAction.event;
        if (thisAction.activity == thisActivity) {
            switch (ev) {
                //Navigated events set up a new try and report the minimal moves parameter.
                case 'Navigated':
                    thisTry = new Object();
                    inRemediation = false;
                    thisTry.moves = 0;
                    thisTry.actions = [];
                    thisTry.actions.push(thisAction);
                    thisTry.level1Hints = 0;
                    thisTry.level2Hints = 0;
                    thisTry.level3Hints = 0;
                    movesForThisDrake = 0;
                    minimumMoves = parseInt(thisAction.parameters.goalMoves);
                    break;
                    //Allele and sex changes get added as moves to thisTry and to moves for this drake, unless we're in remediation.
                case ('Allele changed'):
                    if (!inRemediation) {
                        thisTry.actions.push(thisAction);
                        thisTry.moves++;
                        movesForThisDrake++;
                    }
                    break;
                case ('Sex changed'):
                    if (!inRemediation) {
                        thisTry.actions.push(thisAction);
                        thisTry.moves++;
                        movesForThisDrake++;
                    }
                    break;
                    //Hints don't interrupt tries so they just get added to the try in progress. They do happen during remediation, though, so we have to check for that.
                case ('Guide hint received'):
                    if (!inRemediation) {
                        thisTry.actions.push(thisAction);
                        data = thisAction.parameters.data;
                        level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
                        switch (level) {
                            case 1:
                                thisTry.level1Hints++;
                                break;
                            case 2:
                                thisTry.level2Hints++;
                                break;
                            case 3:
                                thisTry.level3Hints++;
                                break;
                        }
                    }
                    break;
                    //Going into a remediation stops counting of moves and drake submissions until the remediation is ended. Most of the time the current try does not end but simply continues once the remediation ends. If a Navigated event is encountered a new try is initiated and the old try (which did not result in a drake submission) is discarded. The remediations counter for this challenge gets incremented.
                case ('Started remediation'):
                    thisTry.actions.push(thisAction);
                    remediations++;
                    inRemediation = true;
                    break;
                    //Drake submitted events end a try if one is in progress (i.e., if we're not in remediation). An incorrect submission increments the movesForThisDrake counter. The crystal color is calculated from the number of moves (zero for incorrect submissions, 1 for black, 2 for red, 3 for yellow, and 4 for blue). An incorrect submission normally leads to a new try with the same drake unless the student breaks out of the loop. We create a new try (initially with zero move) but don't reset the movesForThisDrake counter. If the student interferes with the normal control flow either the activity will change or a "Navigated" event will signal the arrival of a new drake. A correct submission gives the player a choice: "Try Again" or "Continue." "Try Again" produces a "Navigated" event (same activity but different drake). The "Continue" choice leads to a different challenge and won't be counted by this function.
                case ('Drake submitted'):
                    if (!inRemediation) {
                        thisTry.actions.push(thisAction);
                        (thisAction.parameters.correct == "true" ? thisTry.correct = true : thisTry.correct = false);
                        if (thisTry.correct) {
                            thisTry.excessMoves = (movesForThisDrake - minimumMoves);
                        }
                        thisTry.crystalColor = getCrystalColor(thisTry, thisAction);
                        //Check that crystalColor is defined. If it isn't, don't log this try and wait for another Navigated plus Entered room pair to start a new try.
                        if (thisTry.crystalColor) {
                            //If this submission was incorrect we stick with the same drake. We store the try and increment movesForThisDrake.
                            if (thisTry.crystalColor == 0) {
                                movesForThisDrake++;
                            } else {
                                //If the submission was correct we reset movesForThisDrake.
                                movesForThisDrake = 0;
                            }
                            //In either case we push thisTry to the array. (A new try will be created by the next Navigated event)
                            tries.push(thisTry);
                        } //If crystal color is bad, don't log the try
                    }
                    break;
                    //For Ended remediation events just reset the inRemediation flag. If they're not followed by a Navigation event, which is the expected case, then we're still in the same try.
                case ('Ended remediation'):
                    thisTry.actions.push(thisAction);
                    inRemediation = false;
                    break;
            }
        }
    }
    return [tries, remediations];
}

//For each challenge, find the number of students who have any tries on the challenge, the average number of tries for those students for that challenge, and the average numerical crystal score for that challenge.
function getAverageOverStudents(filteredStudents) {
    var chalSpan = document.getElementById("chalSpan"),
        chalBody = document.getElementById("challengeBody"),
        chalTable = document.getElementById("challengeTable"),
        chalButton = document.getElementById("chalDownloadButton"),
        mySelect = document.getElementById("chalFilter"),
        myOption = mySelect.options[mySelect.selectedIndex].text;
    chalTable.style.display = "block";
    if (myOption != "Select filter") {
        chalButton.style.display = "inline";
    } else {
        chalButton.style.display = "none";
    }
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
    for (let j = 0; j < activitiesArray.length; j++) {
        thisActivity = activitiesArray[j];
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
    makeChallengeResultsTable(challengeResultsArray);
    //makeChallengeResultsBoxPlot(challengeResultsArray);
    makeChallengeResultsBarGraph(challengeResultsArray);
}

function meanStdDev(array) {
    var sum = 0,
        mean,
        squareSum = 0,
        stdDev,
        stdErr;
    for (let i = 0; i < array.length; i++) {
        sum = sum + array[i];
    }
    mean = sum / array.length;
    for (let j = 0; j < array.length; j++) {
        squareSum = squareSum + (array[j] - mean) ** 2;
    }
    stdDev = Math.sqrt(squareSum / (array.length - 1));
    stdErr = stdDev / Math.sqrt(array.length);
    return [mean, stdDev, stdErr];
}


function makeChallengeResultsTable(challengeResultsArray) {
    var chalBody = document.getElementById("challengeBody"),
        challengeResult,
        chalRow,
        chalCell;
    clear(chalBody);
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
        chalBody.appendChild(chalRow);
    }
}

function downloadChallengeFile() {
    var maxSlider = document.getElementById("maxrange"),
        minSlider = document.getElementById("minrange"),
        mySelect = document.getElementById("chalFilter"),
        maxGain = maxSlider.value,
        minGain = minSlider.value,
        body = document.getElementById("challengeBody"),
        header = document.getElementById("chalHeaderRow"),
        csvFile = tableToCSV(header, body),
        fileName = mySelect.options[mySelect.selectedIndex].text;
    if (fileName === "Set filter") {
        fileName = "gains_from_" + minGain + "_to_" + maxGain;
    }
    saveData()(csvFile, fileName + ".csv");
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

function filterStudents(filterValue) {
    if (filterValue) {
        var thisStudent,
            allStudents = [],
            lowLowStudents = [],
            lowHighStudents = [],
            highHighStudents = [],
            highLowStudents = [],
            gain,
            gainArray = [],
            preScore,
            preScoreArray,
            postScore,
            postScoreArray,
            keys,
            thisKey,
            filteredStudents = [];
        var gainHistogram = Object();
        var allSpan = document.getElementById("allSpan");
        for (let i = 0; i < students.length; i++) {
            thisStudent = students[i];
            try {
                if (thisStudent.score_pre && thisStudent.score_post) {
                    gain = (thisStudent.score_post - thisStudent.score_pre);
                    gainStr = gain.toString()
                    if (gainHistogram[gainStr]) {
                        gainHistogram[gainStr]++;
                    } else {
                        gainHistogram[gainStr] = 1;
                    };
                    allStudents.push(thisStudent);
                }
            } catch (err) {
                console.log("Something wrong with thisStudent");
            }
        }
        keys = Object.keys(gainHistogram);
        for (let g = 0; g < keys.length; g++) {
            thisKey = keys[g];
            gainArray.push([parseInt(thisKey), gainHistogram[thisKey]]);
        }
        gainArray.sort(function (a, b) {
            return (a[0] - b[0]);
        });
        allStudents.sort(function (a, b) {
            return a.score_pre - b.score_pre;
        });
        preScoreMedian = allStudents[Math.round((allStudents.length - 1) / 2)].score_pre;
        allStudents.sort(function (a, b) {
            return a.score_post - b.score_post;
        });
        postScoreMedian = allStudents[Math.round((allStudents.length - 1) / 2)].score_post;
        //       console.log("Pre-score median = " + preScoreMedian + ", post-score median = " + postScoreMedian);

        for (let j = 0; j < allStudents.length; j++) {
            let thisStudent = allStudents[j];
            if (thisStudent.score_pre < preScoreMedian) {
                if (thisStudent.score_post <= postScoreMedian) {
                    lowLowStudents.push(thisStudent);
                } else {
                    lowHighStudents.push(thisStudent);
                }
            } else {
                if (thisStudent.score_post < postScoreMedian) {
                    highLowStudents.push(thisStudent);
                } else {
                    highHighStudents.push(thisStudent);
                }
            }
        }
        var slideDiv = document.getElementById("slideDiv");
        var maxSlider = document.getElementById("maxrange");
        var minSlider = document.getElementById("minrange");
        var maxOutput = document.getElementById("maxPara");
        var minOutput = document.getElementById("minPara");
        var maxValue, minValue;
        if ((filterValue === "filter by gain") || (filterValue === "filter by prescore") || (filterValue === "filter by postscore")) {
            if (filterValue === "filter by gain") {
                minSlider.min = -30;
                minSlider.max = 30;
                maxSlider.min = -30;
                maxSlider.max = 30;
            } else {
                minSlider.min = 0;
                minSlider.max = 30;
                maxSlider.min = 0;
                maxSlider.max = 30;
            }
            minValue = minSlider.value;
            maxValue = maxSlider.value;
            slideDiv.style.display = "inline";
            minPara.innerText = "Minimum = " + minSlider.value;
            maxPara.innerText = "Maximum = " + maxSlider.value;
            for (let m = 0; m < allStudents.length; m++) {
                thisStudent = allStudents[m];
                preScore = parseInt(thisStudent.score_pre);
                postScore = parseInt(thisStudent.score_post);
                gain = postScore - preScore;
                effectSize = parseFloat(thisStudent.prepost_gain);
                switch (filterValue) {
                    case "filter by gain":
                        if ((gain <= maxValue) && (gain >= minValue)) {
                            filteredStudents.push(thisStudent);
                        }
                        break;
                    case "filter by prescore":
                        if ((preScore <= maxValue) && (preScore >= minValue)) {
                            filteredStudents.push(thisStudent);
                        }
                        break;
                    case "filter by postscore":
                        if ((postScore <= maxValue) && (postScore >= minValue)) {
                            filteredStudents.push(thisStudent);
                        }
                        break;
                }
            }
        } else {
            slideDiv.style.display = "none";
            switch (filterValue) {
                case "all":
                    filteredStudents = allStudents;
                    break;
                case "lower-to-lower":
                    filteredStudents = lowLowStudents;
                    break;
                case "lower-to-higher":
                    filteredStudents = lowHighStudents;
                    break;
                case "higher-to-higher":
                    filteredStudents = highHighStudents;
                    break;
                case "higher-to-lower":
                    filteredStudents = highLowStudents;
                    break;
            }
        }
        getAverageOverStudents(filteredStudents);
    }
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
    console.log("Something wrong with crystal color. Teacher = " + thisAction.student.teacher.id + ", student = " + thisAction.student.id + ", action index + " + thisAction.index + ", " + thisTry.moves + " moves, " + thisTry.excessMoves + " excess moves.");
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