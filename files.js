function openFiles(evt) {
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
                let today = new Date();
                let time = today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
                fileCount++;
                var myTeacher = new Object();
                var myName = f.name.split(".")[0];
                myTeacher.id = myName;
                myTeacher.data = e.target.result;
                teachersArray.push(myTeacher);
                console.log("File " + f.name + " has finished loading " + e.loaded + " bytes at " + time + ". The data field is " + e.target.result.length + " long.");
                if (fileCount >= files.length - 1) {
                    document.getElementById("JSONfiles").style.display = "none";
                    document.getElementById("analyzeButton").style.display = "block";
                    document.getElementById("fileInput").disabled = true;
                }
            }
        })(f);

        reader.onloadstart = (function (f) {
            return function (e) {
                let today = new Date();
                let time = today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();;
                console.log("File " + f.name + " has started to load at " + time + ".");
            }
        })(f);
        reader.readAsText(f);
    }
}

function openPrePostFiles(evt) {
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
                let prefix = "";
                if (header[13].split(' ')[1] == "Post-Quiz") {
                    prefix = "Post_";
                } else if (header[13].split(' ')[1] == "Pre-Quiz") {
                    prefix = "Pre_";
                }
                header[10] = prefix + "#Correct"
                header[11] = prefix + "Last run";
                header[13] = prefix + "#Completed";
                header[14] = prefix + "%Completed";
                for (let i = 15; i < header.length; i++) {
                    header[i] = prefix + header[i].split(":")[0];
                }
                for (let j = 2; j < data.length; j++) {
                    dataRow = data[j];
                    id = dataRow[5]
                    if (typeof ppStudentsObj[id] === "undefined") {
                        ppStudent = new Object();
                        ppStudent.pre_score = 0;
                        ppStudent.post_score = 0;
                        ppStudent.pre_no_protein = 0;
                        ppStudent.post_no_protein = 0;
                    } else {
                        ppStudent = ppStudentsObj[id];
                    }
                    for (let k = 0; k < dataRow.length; k++) {
                        ppStudent[header[k]] = dataRow[k];
                        if ((k >= 15) && (k <= 42)) {
                            if (header[k].split("_")[0] === "Pre") {
                                if (dataRow[k].search("(correct)") == 1) {
                                    ppStudent.pre_score++;
                                    if ((k < 33) || ((k > 38) && (k < 42))) {
                                        ppStudent.pre_no_protein++;
                                    }
                                }
                            } else if (header[k].split("_")[0] === "Post") {
                                if (dataRow[k].search("(correct)") == 1) {
                                    ppStudent.post_score++;
                                    if ((k < 33) || ((k > 38) && (k < 42))) {
                                        ppStudent.post_no_protein++;
                                    }
                                }
                            }
                        }
                    }
                    ppStudentsObj[id] = ppStudent;
                    ppStudentsArr.push(ppStudent);
                }
                populateStudents(ppStudentsArr);
            }
        })(f);
        reader.readAsText(f);
    }
}

//Transfer pre_score, pre_no_protein, post_score, post_no_protein from each ppStudent in ppStudentsArr to the corresponding student in students. Calculate gain and no_protein_gain and set those properties in each student as well.
function populateStudents(ppStudentsArr) {
    for (pps of ppStudentsArr) {
        s = studentsObj[pps.UserID];
        if (typeof s != "undefined") {
            s.pre_score = pps.pre_score;
            s.post_score = pps.post_score;
            s.pre_no_protein = pps.pre_no_protein;
            s.post_no_protein = pps.post_no_protein;
            s.gain = s.post_score - s.pre_score;
            s.gain_no_protein = s.post_no_protein - s.pre_no_protein;
        }
    }
}

function savePPStudentsFile(ppStudentsArr) {
    let headerArr = Object.keys(ppStudentsArr[0]);
    let tblStr = headerArr.toString();
    for (let ii = 0; ii < ppStudentsArr.length; ii++) {
        stud = ppStudentsArr[ii];
        tblStr += "/n";
        for (let jj = 0; jj < headerArr.length - 1; jj++) {
            prop = headerArr[jj];
            tblStr += stud[prop] + ",";
        }
        tblStr += stud[headerArr[headerArr.length - 1]];
    }
    let fileName = prompt("Enter file name") + "_pre_post";
    saveData()(tblStr, fileName);
}

function oldOpenPrePostFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onerror = function (err) {
        console.log(err);
    };
    reader.onloadend = function (file) {
        return (function (e) {
            let csvStr = e.target.result;
            let csvArr = Papa.parse(csvStr);
            let data = csvArr.data;
            let header = data[0];
            for (let i = 1; i < data.length; i++) {
                dataRow = data[i];
                ppStudent = new Object();
                for (let j = 0; j < dataRow.length; j++) {
                    ppStudent[header[j]] = dataRow[j];
                }
                ppStudents.push(ppStudent);
            }
            for (let k = 0; k < ppStudents.length; k++) {
                let thisPpStudent = ppStudents[k];
                let thisStudent = studentsObj[thisPpStudent.UserID];
                if (thisStudent) {
                    thisStudent.preScores = countPreScores(thisPpStudent);
                    thisStudent.postScores = countPostScores(thisPpStudent);
                    var preDiff = 21 - (thisStudent.preScores[0] + thisStudent.preScores[1]);
                    var postDiff = 21 - (thisStudent.postScores[0] + thisStudent.postScores[1]);
                    if (preDiff > 0) {
                        console.log("Student " + thisStudent.id + " didn't answer " + preDiff + " of the pre-test questions.");
                    }
                    if (postDiff > 0) {
                        console.log("Student " + thisStudent.id + " didn't answer " + postDiff + " of the post-test questions.");
                    }
                    thisStudent.score_pre = thisStudent.preScores[1];
                    thisStudent.score_post = thisStudent.postScores[1];
                    thisStudent.prepost_gain = thisStudent.postScores[1] - thisStudent.preScores[1];
                }
            }
            document.getElementById("CSVfile").style.display = "none";
            document.getElementById("challengeType").style.display = "block";
        })(file);
    };
    reader.readAsText(file);
}

function makeSummaryChallengesFile(students) {
    let scoresArr = [];
    let avgsStr = "Teacher, Class, Student, pre_no_protein, post_no_protein, gain_no_protein, simpleDomPro, simpleDomEng, armorHornsPro, armorHornsEng, colorPro, colorEng, harderPro, harderEng";
    for (student of students) {
        let ppStudent = ppStudentsObj[student.id];
        if (typeof ppStudent != "undefined") {
            if ((typeof ppStudent.pre_no_protein != "undefined") && (typeof ppStudent.post_no_protein != "undefined")) {
                student.pre_no_protein = ppStudent.pre_no_protein;
                student.post_no_protein = ppStudent.post_no_protein;
                student.gain_no_protein = ppStudent.gain_no_protein;
                let scoresArr = averageChallengeScores(student),
                    simpleProAvg = scoresArr[0],
                    armorProAvg = scoresArr[1],
                    colorProAvg = scoresArr[2],
                    harderProAvg = scoresArr[3],
                    simpleEngAvg = scoresArr[4],
                    armorEngAvg = scoresArr[5],
                    colorEngAvg = scoresArr[6],
                    harderEngAvg = scoresArr[7];
                avgsStr += ("\n" + student.teacher.id + ", " + student.class.id + ", " + student.id + ", " + student.pre_no_protein + ", " + student.post_no_protein + ", " + student.gain_no_protein + ", " + simpleProAvg + ", " + simpleEngAvg + ", " + armorProAvg + ", " + armorEngAvg + ", " + colorProAvg + ", " + colorEngAvg + ", " + harderProAvg + ", " + harderEngAvg);
            }
        }
    }
    let fileName = prompt("Enter file name") + "_challenge_averages";
    saveData()(avgsStr, fileName);
}

//Create a string consisting of a header row and a row for each student in <selectedStudents> with columns corresponding to the outcome string for each target matching challenge for each student.
function makeSummaryTriesFile(students) {
    let triesStr = "Teacher, Class, Student, pre_no_protein, post_no_protein, gain_no_protein";
    for (chalName of targetMatchArray) {
        shortName = chalName.split("-")[2] + "-" + chalName.split("-")[3];
        triesStr += ", " + shortName;
    }
    for (student of students) {
        if (student.pre_no_protein == undefined) {
            student.pre_no_protein = null;
        }
        if (student.post_no_protein == undefined) {
            student.post_no_protein = null;
        }
        if (student.gain_no_protein == undefined) {
            student.gain_no_protein = null;
        }
        triesStr += ("\n" + student.teacher.id + ", " + student.class.id + ", " + student.id + ", " + student.pre_no_protein + ", " + student.post_no_protein + ", " + student.gain_no_protein);
        for (name of targetMatchArray) {
            myActivity = student.activitiesByName[name];
            if (typeof myActivity != "undefined") {
                triesStr += (", " + myActivity.outcomesStr + "; " + myActivity.score[0] + "/" + myActivity.score[1]);
            } else {
                triesStr += "";
            }
        }
    }
    let fileName = prompt("Enter file name") + "_challenge_summary";
    saveData()(triesStr, fileName);
}

//Create a string consisting of a header row and a row for each student in <selectedStudents> with columns corresponding to the numbers of tries of each type for each target matching challenge for each student.
function makeTriesCSVFile(selectedStudents) {
    let triesStr = makeTriesHeaderRow();
    for (studIndex = 0; studIndex < selectedStudents.length; studIndex++) {
        student = selectedStudents[studIndex];
        if (student.pre_no_protein == undefined) {
            student.pre_no_protein = null;
        }
        if (student.post_no_protein == undefined) {
            student.post_no_protein = null;
        }
        triesStr += ("\n" + student.teacher.id + ", " + student.class.id + ", " + student.id + ", " + student.pre_no_protein + ", " + student.post_no_protein + ", ");
        for (chalIndex = 0; chalIndex < targetMatchArray.length; chalIndex++) {
            let noOver = 0,
                noZero = 0,
                noUnder = 0,
                bad = 0,
                black = 0,
                red = 0,
                yellow = 0,
                blue = 0;
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
    let triesStr = "Teacher, Class, Student, Pre-no-protein, Post-no-protein";
    let shortChallenge;
    for (challenge of targetMatchArray) {
        shortChallenge = challenge.split("-")[2] + "-" + challenge.split("-")[3];
        triesStr += ", " + shortChallenge + "-" + "noUnder, " + shortChallenge + "-" + "noZero, " + shortChallenge + "-" + "noOver, " + shortChallenge + "-" + "bad, " + shortChallenge + "-" + "black, " + shortChallenge + "-" + "red, " + shortChallenge + "-" + "yellow, " + shortChallenge + "-" + "blue";
    }
    return triesStr;
}

function countPreScores(student) {
    var preScore0 = 0;
    var preScore1 = 0;
    var itemArr = [
        "item1pre",
        "item2pre",
        "item3pre",
        "item4pre",
        "item5pre",
        "item6pre",
        "item7pre",
        "item8pre",
        "item9pre",
        "item10pre",
        "item11pre",
        "item12pre",
        "item13pre",
        "item14pre",
        "item15pre",
        "item16pre",
        "item17pre",
        "item18pre",
        "item25pre",
        "item26pre",
        "item27pre"
    ];
    for (let i = 0; i < itemArr.length; i++) {
        switch (student[itemArr[i]]) {
            case "0":
                preScore0++;
                break;
            case "1":
                preScore1++;
                break;
        }
    }
    return [preScore0, preScore1];
}

function countPostScores(student) {
    var postScore0 = 0;
    var postScore1 = 0;
    var itemArr = [
        "item1post",
        "item2post",
        "item3post",
        "item4post",
        "item5post",
        "item6post",
        "item7post",
        "item8post",
        "item9post",
        "item10post",
        "item11post",
        "item12post",
        "item13post",
        "item14post",
        "item15post",
        "item16post",
        "item17post",
        "item18post",
        "item25post",
        "item26post",
        "item27post"
    ];
    for (let i = 0; i < itemArr.length; i++) {
        switch (student[itemArr[i]]) {
            case "0":
                postScore0++;
                break;
            case "1":
                postScore1++;
                break;
        }
    }
    return [postScore0, postScore1];
}

function openPreTestFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onerror = function (err) {
        console.log(err);
    };
    reader.onloadend = function (file) {
        return (function (e) {
            let csvStr = e.target.result;
            let csvArr = Papa.parse(csvStr);
            let data = csvArr.data;
            let header = data[0];
            for (let i = 1; i < data.length; i++) {
                dataRow = data[i];
                preStudent = new Object();
                for (let j = 0; j < dataRow.length; j++) {
                    preStudent[header[j]] = dataRow[j];
                }
                preStudents.push(preStudent);
            }
        })(file);
    };
    reader.readAsText(file);
}

function openPostTestFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    postStudentsByID = new Object();
    prePostStudents = [];
    reader.onerror = function (err) {
        console.log(err);
    };
    reader.onloadend = function (file) {
        return (function (e) {
            let csvStr = e.target.result;
            let csvArr = Papa.parse(csvStr);
            let data = csvArr.data;
            let header = data[0];
            for (let i = 1; i < data.length; i++) {
                dataRow = data[i];
                postStudent = new Object();
                for (let j = 0; j < dataRow.length; j++) {
                    postStudent[header[j]] = dataRow[j];
                }
                let id = postStudent["Student ID"];
                postStudents.push(postStudent);
                postStudentsByID[id] = postStudent;
            }
            var prePostArray = findPrePostStudents(preStudents, postStudents);
            for (k = 0; k < prePostArray.length; k++) {
                prePostStudent = postStudentsByID[prePostArray[k]];
                prePostStudents.push(prePostStudent);
            }
        })(file);
    };
    reader.readAsText(file);
}

function findPrePostStudents(preStudents, postStudents) {
    var preArray = [];
    var postArray = [];
    var prePostArray = [];
    var prePostStudents = [];
    for (let i = 0; i < preStudents.length; i++) {
        try {
            preArray.push(parseInt(preStudents[i]["Student ID"]));
        } catch (err) {
            console.log(err + " in pre. i = " + i);
        }
    }

    for (let j = 0; j < postStudents.length; j++) {
        try {
            postArray.push(parseInt(postStudents[j]["Student ID"]));
        } catch (err) {
            console.log(err + " in post. j = " + j);
        }
    }
    preArray.sort(function (a, b) {
        return a - b;
    });
    postArray.sort(function (a, b) {
        return a - b;
    });
    prePostArray = intersection(preArray, postArray);
    console.log(
        preStudents.length +
        " took the pre test, " +
        postStudents.length +
        " took the post test, and " +
        prePostArray.length +
        " took both."
    );
    return prePostArray;
}

// Make a csv file with one row for each student who took both the pre-test and the post-test with headings for the student's id, teacher, pre-test score, post-test score, and number of hints at levels 1 through 3 received for each group of target match challenges.

function makeSummaryFile() {
    let fileStr = "student, teacher, class, pre-score, post-score, gain, domLevel1, domLevel2, domLevel3, domScore, armorHornsLevel1, armorHornsLevel2, armorHornsLevel3, armorHornsScore, colorLevel1, colorLevel2, colorLevel3, colorScore, harderLevel1, harderLevel2, harderLevel3, harderScore";
    let prePostStudents = getPrePostStudents();
    let hintsArray = [];
    let newRow = "";
    for (student of prePostStudents) {
        hintsArray = getHintsByChallengeType(student);
        newRow = makeSummaryFileRow(student, hintsArray);
        fileStr += newRow;
    }
    downloadSummaryFile(fileStr);
}

function downloadSummaryFile(fileStr) {
    let fileName = "summary file";
    saveData()(fileStr, fileName);
}

function makeSummaryFileRow(student, hintsArray) {
    let gain = student.score_post - student.score_pre;
    let domScore = hintsArray[0][0] + 2 * hintsArray[0][1] + 3 * hintsArray[0][2];
    let armorHornsScore = hintsArray[1][0] + 2 * hintsArray[1][1] + 3 * hintsArray[1][2];
    let colorScore = hintsArray[2][0] + 2 * hintsArray[2][1] + 3 * hintsArray[2][2];
    let harderScore = hintsArray[3][0] + 2 * hintsArray[3][1] + 3 * hintsArray[3][2];
    let newRow = "\n";
    newRow += student.id + "," + student.teacher.id + "," + student.class.id + "," + student.score_pre + "," + student.score_post + "," + gain + "," + hintsArray[0][0] + "," + hintsArray[0][1] + "," + hintsArray[0][2] + "," + domScore + "," + hintsArray[1][0] + "," + hintsArray[1][1] + "," + hintsArray[1][2] + "," + armorHornsScore + "," + hintsArray[2][0] + "," + hintsArray[2][1] + "," + hintsArray[2][2] + "," + colorScore + "," + hintsArray[3][0] + "," + hintsArray[3][1] + "," + hintsArray[3][2] + "," + harderScore;
    return newRow;
}

//Count the number of hints at levels 1 through 3 received by <student> for each group of target match challenges
function getHintsByChallengeType(student) {
    let simpleDomArray = [
        "allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2"
    ];
    let armorHornsArray = [
        "allele-targetMatch-visible-armorHorns",
        "allele-targetMatch-visible-armorHorns2",
        "allele-targetMatch-visible-armorHorns3",
        "allele-targetMatch-hidden-armorHorns",
        "allele-targetMatch-hidden-armorHorns2",
        "allele-targetMatch-hidden-armorHorns3"
    ];
    let simpleColorsArray = [
        "allele-targetMatch-visible-simpleColors",
        "allele-targetMatch-visible-simpleColors2",
        "allele-targetMatch-visible-simpleColors3",
        "allele-targetMatch-visible-simpleColors4",
        "allele-targetMatch-visible-simpleColors5",
        "allele-targetMatch-hidden-simpleColors",
        "allele-targetMatch-hidden-simpleColors2",
        "allele-targetMatch-hidden-simpleColors3"
    ];
    let harderTraitsArray = [
        "allele-targetMatch-visible-harderTraits",
        "allele-targetMatch-visible-harderTraits2",
        "allele-targetMatch-hidden-harderTraits",
        "allele-targetMatch-hidden-harderTraits2"
    ];
    let challengesArray = [];
    let hintsArray = [];
    let hints = [];
    challengesArray.push(simpleDomArray);
    challengesArray.push(armorHornsArray);
    challengesArray.push(simpleColorsArray);
    challengesArray.push(harderTraitsArray);
    let prePostStudents = getPrePostStudents();
    for (let i = 0; i < challengesArray.length; i++) {
        challenges = challengesArray[i];
        hints = getHints(student, challenges);
        hintsArray[i] = hints;
        //     console.log("Student " + student.id + " had " + hints[0] + " level 1 hints, " + hints[1] + " level 2 hints, and " + hints[2] + " level 3 hints on the " + challenges[0] + "challenges.");
    }
    return hintsArray;
}

//Return an array with the total level 1, level 2, and level 3 hints received by <student> on any of the challenges in the array <challenges>
function getHints(student, challenges) {
    hints = [];
    levelHints = [0, 0, 0];
    for (thisChallenge of challenges) {
        if (student.activitiesByName[thisChallenge]) {
            hints = student.activitiesByName[thisChallenge].hints;
            for (thisHint of hints) {
                index = thisHint.level - 1;
                levelHints[index]++;
            }
        } else {
            console.log("Student " + student.id + " didn't do challenge " + thisChallenge + ".");
            levelHints[0] = "n/a";
            levelHints[1] = "n/a";
            levelHints[2] = "n/a";
        };
    }
    return levelHints;
}

//Return an array of all students who took both the pre-test and the post-test
function getPrePostStudents() {
    let prePostStudents = [];
    for (let i = 0; i < students.length; i++) {
        thisStudent = students[i];
        if (thisStudent.score_pre > 0) {
            if (thisStudent.score_post > 0) {
                prePostStudents.push(thisStudent);
            }
        }
    }
    return prePostStudents;
}