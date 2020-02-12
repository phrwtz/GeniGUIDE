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

        /* reader.onprogress = (function (f) {
            return function (e) {
                let today = new Date();
                let time = today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();;
                console.log("File " + f.name + " has loaded " + e.loaded + " bytes out of " + e.total + " at " + time + ". the data field is " + e.target.result.length + " long.");
                if (e.target.result.length == 0) {
                    console.log("Stop!");
                }
            }
        })(f); */


        reader.readAsText(f);
    }
}

function openPrePostFile(evt) {
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
    let fileStr = "ID, teacher, pre-score, post-score, simpleDomLevel1Hints, simpleDomLevel2Hints, simpleDomLevel3Hints, armorHornsLevel1Hints, armorHornsLevel2Hints, armorHornsLevel3Hints, colorsLevel1Hints, colorsLevel2Hints, colorsLevel3Hints, harderTraitsLevel1Hints, harderTraitsLevel2Hints, harderTraitsLevel3Hints";
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
    let newRow = "\n";
    newRow += student.id + "," + student.teacher.id + "," + student.score_pre + "," + student.score_post + "," + hintsArray[0][0] + "," + hintsArray[0][1] + "," + hintsArray[0][2] + "," + hintsArray[1][0] + "," + hintsArray[1][1] + "," + hintsArray[1][2] + "," + hintsArray[2][0] + "," + hintsArray[2][1] + "," + hintsArray[2][2] + "," + hintsArray[3][0] + "," + hintsArray[3][1] + "," + hintsArray[3][2];
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