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

//Returns an array. The first element is an array of tries by the student with <studentId> on <thisActivity>; the second element is the number of remdiations the student had on the activity.
function checkout(studentId, thisActivity) {
    var thisStudent = findStudent(studentId),
        tries = [],
        remediations = 0, //Counts remediations for this activity
        thisAction,
        movesForThisDrake = 0,
        remediationInProgress = false,
        ev;
    for (var i = 0; i < thisStudent.actions.length; i++) {
        thisAction = thisStudent.actions[i];
        ev = thisAction.event;
        if (thisAction.activity == thisActivity) {
            switch (ev) {
                //Navigated events set up a new try and report the minimal moves parameter.
                case 'Navigated':
                    thisTry = new Object();
                    remediationInProgress = false;
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
                    if (!remediationInProgress) {
                        thisTry.actions.push(thisAction);
                        thisTry.moves++;
                        movesForThisDrake++;
                    }
                    break;
                case ('Sex changed'):
                    if (!remediationInProgress) {
                        thisTry.actions.push(thisAction);
                        thisTry.moves++;
                        movesForThisDrake++;
                    }
                    break;
                    //Hints don't interrupt tries so they just get added to the try in progress. They do happen during remediation, though, so we have to check for that.
                case ('Guide hint received'):
                    if (!remediationInProgress) {
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
                    remediationInProgress = true;
                    break;
                    //Drake submitted events end a try if one is in progress (i.e., if we're not in remediation). An incorrect submission increments the movesForThisDrake counter. The crystal color is calculated from the number of moves (zero for incorrect submissions, 1 for black, 2 for red, 3 for yellow, and 4 for blue). An incorrect submission normally leads to a new try with the same drake unless the student breaks out of the loop. We create a new try (initially with zero move) but don't reset the movesForThisDrake counter. If the student interferes with the normal control flow either the activity will change or a "Navigated" event will signal the arrival of a new drake. A correct submission gives the player a choice: "Try Again" or "Continue." "Try Again" produces a "Navigated" event (same activity but different drake). The "Continue" choice leads to a different challenge and won't be counted by this function.
                case ('Drake submitted'):
                    if (!remediationInProgress) {
                        thisTry.actions.push(thisAction);
                        (thisAction.parameters.correct == "true" ? thisTry.correct = true : thisTry.correct = false);
                        if (thisTry.correct) {
                            thisTry.excessMoves = (movesForThisDrake - minimumMoves);
                        }
                        thisTry.crystalColor = getCrystalIndex(thisTry, thisAction);
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
                    //For Ended remediation events just reset the remediationInProgress flag. If they're not followed by a Navigation event, which is the expected case, then we're still in the same try.
                case ('Ended remediation'):
                    thisTry.actions.push(thisAction);
                    remediationInProgress = false;
                    break;
            }
        }
    }
    return [tries, remediations];
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

function makeHintGraph() {
    document.getElementById("graphType").style.display = "block";
    var myDiv = document.getElementById("graphDiv");
    var chalFilter1 = document.getElementById("chalFilter1");
    var chalFilter2 = document.getElementById("chalFilter2");
    var maxSlider1 = document.getElementById("maxrange1");
    var minSlider1 = document.getElementById("minrange1");
    var challengeType = document.getElementById("challengeType").value;
    var graphType = document.getElementById("graphType").value;
    var filter1 = chalFilter1.value,
        filter2 = chalFilter2.value,
        max1 = parseInt(maxSlider1.value),
        min1 = parseInt(minSlider1.value),
        max2 = parseInt(maxSlider2.value),
        min2 = parseInt(minSlider2.value),
        fs1, fs2, cr1, cr2;
    setUIVisibility(challengeType, graphType, filter1, filter2);
    if (challengeType === "targetMatch") {
        if (graphType === "singleCohort") {
            filterStudents(filter1, max1, min1)
                .then(getTargetMatchResults)
                .then(function (result) {
                    makeTargetMatchTable(result);
                    makeSingleTargetMatchGraph(result);
                });
        } else if (graphType === "twoCohorts") {
            var cr1 = filterStudents(filter1, max1, min1)
                .then(getTargetMatchResults)
            var cr2 = filterStudents(filter2, max2, min2)
                .then(getTargetMatchResults);
            Promise.all([cr1, cr2]).then(function (values) {
                makeTargetMatchCompTable(values[0], values[1]);
                makeTwoCohortTargetMatchGraph(values[0], values[1]);
            });
        }
    } else if (challengeType === "eggDrop") {
        if (graphType === "singleCohort") {
            filterStudents(filter1, max1, min1)
                .then(getEggdropResults)
                .then(function (result) {
                    makeEggdropTable(result);
                    makeSingleEggDropGraph(result);
                });
        } else if (graphType === "twoCohorts") {
            var cr1 = filterStudents(filter1, max1, min1)
                .then(getEggdropResults)
            var cr2 = filterStudents(filter2, max2, min2)
                .then(getEggdropResults);
            Promise.all([cr1, cr2]).then(function (values) {
                makeEggDropCompTable(values[0], values[1]);
                makeTwoCohortEggDropGraph(values[0], values[1])
            });
        }
    } else if (challengeType === "gamete") {
        if (graphType === "singleCohort") {
            filterStudents(filter1, max1, min1)
                .then(getGameteResults)
                .then(function (result) {
                    makeGameteTable(result);
                    makeSingleGameteGraph(result);
                });
        } else if (graphType === "twoCohorts") {
            var cr1 = filterStudents(filter1, max1, min1)
                .then(getGameteResults)
            var cr2 = filterStudents(filter2, max2, min2)
                .then(getGameteResults);
            Promise.all([cr1, cr2]).then(function (values) {
                makeGameteCompTable(values[0], values[1]);
                makeTwoCohortGameteGraph(values[0], values[1])
            });
        }
    } else if (challengeType === "clutch") {
        if (graphType === "singleCohort") {
            filterStudents(filter1, max1, min1)
                .then(getClutchResults)
                .then(function (result) {
                    makeClutchTable(result);
                    makeSingleClutchGraph(result);
                });
        } else if (graphType === "twoCohorts") {
            var cr1 = filterStudents(filter1, max1, min1)
                .then(getClutchResults)
            var cr2 = filterStudents(filter2, max2, min2)
                .then(getClutchResults);
            Promise.all([cr1, cr2]).then(function (values) {
                makeClutchCompTable(values[0], values[1]);
                makeTwoCohortClutchGraph(values[0], values[1])
            });
        }
    }
}

function setUIVisibility(challengeType, graphType, filter1, filter2) {
    setFilterParameters(filter1, filter2);
    //set table visibility according to challenge and graph type
    switch (challengeType) {
        case "null":
            targetMatchTable.style.display = "none";
            targetMatchCompTable.style.display = "none";
            eggDropTable.style.display = "none";
            eggDropCompTable.style.display = "none";
            gameteTable.style.display = "none";
            gameteCompTable.style.display = "none";
            clutchTable.style.display = "none";
            clutchCompTable.style.display = "none";
            graphDiv.style.display = "none";
            filterDiv.style.display = "none";
            break;
        case "targetMatch":
            filterDiv.style.display = "block";
            switch (graphType) {
                case "null":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    graphDiv.style.display = "none";
                    break;
                case "singleCohort":
                    targetMatchTable.style.display = "block";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    break;
                case "twoCohorts":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "block";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    break;
            }
            break;
        case "eggDrop":
            filterDiv.style.display = "block";
            switch (graphType) {
                case "null":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    graphDiv.style.display = "none";
                    break;
                case "singleCohort":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "block";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    break;
                case "twoCohorts":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "block";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    break;
            }
            break;
        case "gamete":
            filterDiv.style.display = "block";
            switch (graphType) {
                case "null":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    graphDiv.style.display = "none";
                    break;
                case "singleCohort":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "block";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    break;
                case "twoCohorts":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "block";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    break;
            }
            break;
        case "clutch":
            filterDiv.style.display = "block";
            switch (graphType) {
                case "null":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "none";
                    graphDiv.style.display = "none";
                    break;
                case "singleCohort":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "block";
                    clutchCompTable.style.display = "none";
                    break;
                case "twoCohorts":
                    targetMatchTable.style.display = "none";
                    targetMatchCompTable.style.display = "none";
                    eggDropTable.style.display = "none";
                    eggDropCompTable.style.display = "none";
                    gameteTable.style.display = "none";
                    gameteCompTable.style.display = "none";
                    clutchTable.style.display = "none";
                    clutchCompTable.style.display = "block";
                    break;
            }
            break;
    }
    //Set graph type selector and slider visibility according to graph type
    switch (graphType) {
        case "null":
            chalFilter1.style.display = "none";
            chalFilter2.style.display = "none";
            break;
        case "singleCohort":
            chalFilter1.style.display = "block";
            chalFilter2.style.display = "none";
            maxSlider1.style.display = "none";
            minSlider1.style.display = "none";
            maxOutput1.style.display = "none";
            minOutput1.style.display = "none";
            maxSlider2.style.display = "none";
            minSlider2.style.display = "none";
            maxOutput2.style.display = "none";
            minOutput2.style.display = "none";
            sliderTable.style.display = "none";
            maxSlider1.style.display = "none";
            minSlider1.style.display = "none";
            maxOutput1.style.display = "none";
            minOutput1.style.display = "none";
            maxSlider2.style.display = "none";
            minSlider2.style.display = "none";
            maxOutput2.style.display = "none";
            minOutput2.style.display = "none";
            if ((filter1 === "filter by prescore") || (filter1 === "filter by postscore") || (filter1 === "filter by gain")) {
                sliderTable.style.display = "block";
                maxSlider1.style.display = "block";
                minSlider1.style.display = "block";
                maxOutput1.style.display = "block";
                minOutput1.style.display = "block";
            }
            break;
        case "twoCohorts":
            chalFilter1.style.display = "block";
            chalFilter2.style.display = "block";
            sliderTable.style.display = "none";
            infoPara.style.display = "none";
            graphDiv.style.display = "none";
            maxSlider1.style.display = "none";
            minSlider1.style.display = "none";
            maxOutput1.style.display = "none";
            minOutput1.style.display = "none";
            maxSlider2.style.display = "none";
            minSlider2.style.display = "none";
            maxOutput2.style.display = "none";
            minOutput2.style.display = "none";
            if ((filter1 === "filter by prescore") || (filter1 === "filter by postscore") || (filter1 === "filter by gain")) {
                sliderTable.style.display = "block";
                maxSlider1.style.display = "block";
                minSlider1.style.display = "block";
                maxOutput1.style.display = "block";
                minOutput1.style.display = "block";
                infoPara.style.display = "block";
                graphDiv.style.display = "block";
            }
            if ((filter2 === "filter by prescore") || (filter2 === "filter by postscore") || (filter2 === "filter by gain")) {
                sliderTable.style.display = "block";
                maxSlider2.style.display = "block";
                minSlider2.style.display = "block";
                maxOutput2.style.display = "block";
                minOutput2.style.display = "block";
                infoPara.style.display = "block";
                graphDiv.style.display = "block";
            }
            break;
    }
}

function filterStudents(filterValue, maxValue, minValue) {
    return new Promise((resolve, reject) => {
        var filteredStudents = [];
        if (filterValue === "null") { //Don't do anything if no filter has been set
            return filteredStudents;
        } else {
            var thisStudent,
                allStudents = [],
                lowLowStudents = [],
                lowHighStudents = [],
                highHighStudents = [],
                highLowStudents = [],
                gain,
                gainArray = [],
                preScore,
                postScore,
                keys,
                thisKey,
                filteredStudents = [];
            var gainHistogram = Object();
            var allSpan = document.getElementById("allSpan");populateStudents();
            for (let i = 0; i < students.length; i++) {
                thisStudent = students[i];
                try {
                    if (thisStudent.pre_score && thisStudent.post_score && thisStudent.pre_perm_form && thisStudent.post_perm_form) {
                        gain = (thisStudent.post_score - thisStudent.pre_score);
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
                return a.pre_score - b.pre_score;
            });
            preScoreMedian = allStudents[Math.round((allStudents.length - 1) / 2)].pre_score;
            allStudents.sort(function (a, b) {
                return a.post_score - b.post_score;
            });
            postScoreMedian = allStudents[Math.round((allStudents.length - 1) / 2)].post_score;
            for (let j = 0; j < allStudents.length; j++) {
                let thisStudent = allStudents[j];
                if (thisStudent.pre_score < preScoreMedian) {
                    if (thisStudent.post_score <= postScoreMedian) {
                        lowLowStudents.push(thisStudent);
                    } else {
                        lowHighStudents.push(thisStudent);
                    }
                } else {
                    if (thisStudent.post_score < postScoreMedian) {
                        highLowStudents.push(thisStudent);
                    } else {
                        highHighStudents.push(thisStudent);
                    }
                }
            }
            if ((filterValue === "filter by gain") || (filterValue === "filter by prescore") || (filterValue === "filter by postscore")) {
                for (let m = 0; m < allStudents.length; m++) {
                    thisStudent = allStudents[m];
                    gain = thisStudent.post_score - thisStudent.pre_score;
                    effectSize = parseFloat(thisStudent.prepost_gain);
                    switch (filterValue) {
                        case "filter by gain":
                            if ((gain <= maxValue) && (gain >= minValue)) {
                                filteredStudents.push(thisStudent);
                            }
                            break;
                        case "filter by prescore":
                            if ((thisStudent.pre_score <= maxValue) && (thisStudent.pre_score >= minValue)) {
                                filteredStudents.push(thisStudent);
                            }
                            break;
                        case "filter by postscore":
                            if ((thisStudent.post_score <= maxValue) && (thisStudent.post_score >= minValue)) {
                                filteredStudents.push(thisStudent);
                            }
                            break;
                    }
                }
            } else {
                switch (filterValue) {
                    case "all students":
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
        }
        resolve(filteredStudents);
    });
}

function setFilterParameters(filter1, filter2) {
    if (filter1 === "filter by gain") {
        maxSlider1.min = -30;
        maxSlider1.max = 30;
        //     maxSlider1.value = 30;
        minSlider1.min = -30;
        minSlider1.max = 30;
        //    minSlider1.value = -30;
    } else {
        maxSlider1.min = 0;
        maxSlider1.max = 30;
        //     maxSlider1.value = 30;
        minSlider1.min = 0;
        minSlider1.max = 30;
        //     minSlider1.value = 0;
    }
    if (filter2 === "filter by gain") {
        maxSlider2.min = -30;
        maxSlider2.max = 30;
        //      maxSlider2.value = 30;
        minSlider2.min = -30;
        minSlider2.max = 30;
        //     minSlider2.value = -30;
    } else {
        maxSlider2.min = 0;
        maxSlider2.max = 30;
        //     maxSlider2.value = 30;
        minSlider2.min = 0;
        minSlider2.max = 30;
        //     minSlider2.value = 0;
    }
    minOutput1.innerHTML = "Cohort 1 minimum = " + minSlider1.value;
    minOutput2.innerHTML = "Cohort 2 minimum = " + minSlider2.value;
    maxOutput1.innerHTML = "Cohort 1 maximum = " + maxSlider1.value;
    maxOutput2.innerHTML = "Cohort 2 maximum = " + maxSlider2.value;
}

function getCrystalIndex(thisTry, thisAction) {
    if (thisTry.remediationInProgress) {
        return -1;
    } else if (thisAction.parameters.correct == "false") {
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
 //   console.log("Something wrong with crystal color. Teacher = " + thisAction.student.teacher.id + ",class = " + thisAction.class_id + ", student = " + thisAction.student.id + ", challenge " + thisAction.activity + ", action index + " + thisAction.index + ", " + thisTry.targetMatchMoves + " moves, " + thisTry.excessMoves + " excess moves.");
}

function getCrystalColor(colorIndex) {
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