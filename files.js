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

function open2020PrePostFiles(evt) {
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
                if (data[0][20] === "Geniventure Pre-Quiz Section") {
                    testType = "pre";
                } else if (data[0][20] === "Geniventure Post-Quiz and Survey Section") {
                    testType = "post";
                } else {
                    console.log("Neither pre nor post!");
                }
                let header = data[1];
                let id = "",
                    questionNum;
                for (let j = 3; j < data.length; j++) {
                    dataRow = data[j];
                    id = dataRow[5];
                    if (typeof newStudentsObj[id] == "undefined") {
                        newStudent = new Object;
                        newStudent.id = id;
                        newStudent["pre"] = false;
                        newStudent["post"] = false;
                    } else { //Student already exists
                        newStudent = newStudentsObj[id];
                    }
                    newStudent[testType] = true;
                    newStudent[testType + "_total_score"] = 0;
                    newStudent[testType + "_protein_score"] = 0;
                    newStudent[testType + "_allele_score"] = 0;
                    newStudent[testType + "_wrong_score"] = 0;
                    newStudent[testType + "_not_answered"] = 0;
                    newStudent[testType + "_date"] = dataRow[13];
                    for (let i = 17; i < 44; i++) {
                        questionNum = parseInt(header[i].split(":")[0]);
                        if (dataRow[i].split(" ")[0] == "(correct)") {
                            newStudent[testType + "_total_score"]++;
                            if ((questionNum >= 19) && (questionNum <= 24)) {
                                newStudent[testType + "_protein_score"]++;
                            } else {
                                newStudent[testType + "_allele_score"]++;
                            }
                        } else if (dataRow[i].split(" ")[0] == "(wrong)") {
                            newStudent[testType + "_wrong_score"]++;
                        } else if (dataRow[i].split(" ")[0] == "not answered") {
                            newStudent[testType + "_not_answered"]++;
                        }
                    }
                    newStudentsObj[id] = newStudent;
                    newStudentsArr.push(newStudent);
                }
                console.log(`File ${f.name} has finished loading. ${fileCount} files out of ${files.length} loaded so far.`);
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
                let testType = "n/a";
                let id = "",
                    questionNum;
                if (header[13].split(" ")[1] === "Pre-Quiz") {
                    testType = "pre";
                } else if (header[13].split(" ")[1] === "Post-Quiz") {
                    testType = "post";
                }
                for (let j = 2; j < data.length; j++) {
                    dataRow = data[j];
                    id = dataRow[5];
                    if (typeof newStudentsObj[id] == "undefined") {
                        newStudent = new Object;
                        newStudent.id = id;
                        newStudent["pre"] = false;
                        newStudent["post"] = false;
                    } else { //Student already exists
                        newStudent = newStudentsObj[id];
                    }
                    newStudent[testType] = true;
                    newStudent[testType + "_total_score"] = 0;
                    newStudent[testType + "_protein_score"] = 0;
                    newStudent[testType + "_allele_score"] = 0;
                    newStudent[testType + "_wrong_score"] = 0;
                    newStudent[testType + "_date"] = dataRow[13];
                    for (let i = 15; i < 42; i++) {
                        questionNum = parseInt(header[i].split(":")[0]);
                        if (dataRow[i].split(" ")[0] == "(correct)") {
                            newStudent[testType + "_total_score"]++;
                            if ((questionNum >= 19) && (questionNum <= 24)) {
                                newStudent[testType + "_protein_score"]++;
                            } else {
                                newStudent[testType + "_allele_score"]++;
                            }
                        } else {
                            newStudent[testType + "_wrong_score"]++;
                        }
                    }
                    newStudentsObj[id] = newStudent;
                    newStudentsArr.push(newStudent);
                }
            }
        })(f);
        reader.readAsText(f);
    }
}

function countNewStudents() {
    let countPre = 0;
    let countPost = 0;
    let countBoth = 0;
    let gainPositive = 0;
    let gainNegative = 0;
    let gainZero = 0;
    for (student of newStudentsArr) {
        if ((student.pre) && !(student.post)) {
            countPre++;
        }
        if (!(student.pre) && (student.post)) {
            countPost++;
        }
        if ((student.pre) && (student.post)) {
            countBoth++;
            if (student.post_score < student.pre_score) {
                gainNegative++;
            } else if (student.post_score > student.pre_score) {
                gainPositive++;
            } else if (student.post_score == student.pre_score) {
                gainZero++;
            }
        }
    }
    return [newStudentsArr.length, countPre, countPost, countBoth, gainPositive, gainNegative, gainZero];
}

//Transfer pre_score, pre_no_protein, post_score, post_no_protein from each ppStudent in ppStudentsArr to the corresponding student in students. Calculate gain and no_protein_gain and set those properties in each student as well.
function populateStudents() {
    for (let i = 0; i < newStudentsArr.length; i++) {
        pps = newStudentsArr[i];
        s = studentsObj[pps.UserID];
        if (typeof s != "undefined") {
            s.pre_perm_form = pps.pre_perm_form;
            s.post_perm_form = pps.post_perm_form;
            s.pre_score = parseInt(pps.pre_score);
            s.post_score = parseInt(pps.post_score);
            s.pre_no_protein = parseInt(pps.pre_no_protein);
            s.post_no_protein = parseInt(pps.post_no_protein);
            s.gain = s.post_score - s.pre_score;
            s.gain_no_protein = s.post_no_protein - s.pre_no_protein;
            s.pre_completed = pps.pre_completed;
            s.post_completed = pps.post_completed;
            if (s.pre_completed == 0) {
                console.log("Student " + s.id + " completed zero pre test items.");
            }
            if (s.post_completed == 0) {
                console.log("Student " + s.id + " completed zero post test items.");
            }
            if (s.pre_score == 0) {
                console.log("Student " + s.id + " has zero pre score.");
            }
            if (s.post_score == 0) {
                console.log("Student " + s.id + " has zero post score.");
            }
            if (s.gain < 0) {
                console.log("Student " + s.id + " has negative gain.");
            }
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

//Create a csv table that reports on the proficiency score each student got on the target match challenges and compares them to the pre- and post-test scores and gains.
function makeTargetMatchChallengesFile() {
    let totalScore = 0,
        head = '',
        tableStr,
        testStr,
        chalFound;
    head = 'Teacher,Class,Student,Pre-total,Pre-allele,Pre-protein,Post-total,Post-allele,Post-protein,Gain-total,Gain-allele,Gain-protein';
    for (name of targetMatchArray) {
        head += ',' + name;
    }
    head += ", Total score";
    tableStr = head;
    for (s of students) {
        n = newStudentsObj[s.id];
        if (typeof n != "undefined") {
            if (n.pre && n.post && (n.pre_not_answered < 15) && (n.post_not_answered < 15)) {
                testStr = '\n'
                testStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + n.pre_total_score + ',' + n.pre_allele_score + ',' + n.pre_protein_score + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score + ',' + (n.post_total_score - n.pre_total_score) + ',' + (n.post_allele_score - n.pre_allele_score) + ',' + (n.post_protein_score - n.pre_protein_score));
                totalScore = 0;
                chalFound = true;
                //We don't want to include students who have not completed all the target match challenges so we populate a test string and only add that to the table if all the challenges are there. So the first time a challenge is missing we set chalFound false and don't reset it until we move to another student.
                for (name of targetMatchArray) {
                    chal = s.activitiesByName[name]
                    if (typeof chal === "undefined") {
                        chalFound = false;
                    } else {
                        testStr += ',' + chal.score[0];
                        totalScore += chal.score[0];
                    }
                } //New challenge
                if (chalFound) {
                    tableStr += testStr + ',' + totalScore;
                }
            } else {
                //console.log("No pre-post info for student " + s.id + " of teacher " + s.teacher.id + " in class " + s.class.id + ".");
            }
        } else {
            //console.log("Student " + n.id + " of teacher " + s.teacher.id + " in class " + s.class.id + " did not do the pre- and post-tests.");
        }
    } //New student
    let fileName = prompt('Enter file name') + '_challenge_scores';
    saveData()(tableStr, fileName);
}

//Create a csv table that reports on the proficiency score each student got on the target match challenges and keeps track of just the post-test score.
function makePostTestOnlyChallengesFile() {
    let totalScore = 0,
        head = '',
        tableStr,
        testStr,
        chalFound;
    head = 'Teacher,Class,Student,Post-total, Post-allele, Post-protein';
    for (name of targetMatchArray) {
        head += ',' + name;
    }
    head += ", Total score";
    tableStr = head;
    for (s of students) {
        n = newStudentsObj[s.id];
        if (typeof n != "undefined") {
            if (n.post && (n.post_not_answered < 15)) {
                testStr = '\n'
                testStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score);
                totalScore = 0;
                chalFound = true;
                //We don't want to include students who have not completed all the target match challenges so we populate a test string and only add that to the table if all the challenges are there. So the first time a challenge is missing we set chalFound false and don't reset it until we move to another student.
                for (name of targetMatchArray) {
                    chal = s.activitiesByName[name]
                    if (typeof chal === "undefined") {
                        chalFound = false;
                    } else {
                        testStr += ',' + chal.score[0];
                        totalScore += chal.score[0];
                    }
                } //New challenge
                if (chalFound) {
                    tableStr += testStr + ',' + totalScore;
                }
            } else {
            }
        } else {
        }
    } //New student
    let fileName = prompt('Enter file name') + 'post_and_challenge_scores';
    saveData()(tableStr, fileName);
}

//Create a csv table that reports on the differences between proficiency scores each student got on the first and last target match challenges in each category. Aimed at detecting learning.
function makeChallengeDiffsFile() {
    let totalScore = 0,
        head = '',
        tableStr,
        testStr,
        totalDiffs,
        chalFound;
    head = 'Teacher,Class,Student,Pre-total,Pre-allele,Pre-protein,Post-total,Post-allele,Post-protein,Gain-total,Gain-allele,Gain-protein,simpleDomVisible,simpleDomHidden,armorHornsVisible,armorHornsHidden,simpleColorVisible,simpleColorHidden,harderTraitsVisible,harderTraitsHidden,Total diffs';
    tableStr = head;
    for (s of students) {
        n = newStudentsObj[s.id];
        if (typeof n != "undefined") {
            if (n.pre && n.post) {
                diff = [];
                testStr = '\n'
                testStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + n.pre_total_score + ',' + n.pre_allele_score + ',' + n.pre_protein_score + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score + ',' + (n.post_total_score - n.pre_total_score) + ',' + (n.post_allele_score - n.pre_allele_score) + ',' + (n.post_protein_score - n.pre_protein_score));
                totalScore = 0;
                chalFound = true;
                c = new Object();
                //We don't want to include students who have not completed all the target match challenges so we populate a test string and only add that to the table if all the challenges are there. So the first time a challenge is missing we set chalFound false and don't reset it until we move to another student.
                for (name of targetMatchArray) {
                    chal = s.activitiesByName[name]
                    if (typeof chal === "undefined") {
                        chalFound = false;
                    } else {
                        c[chal.name] = chal;
                    }
                }
                if (chalFound) {
                    try {
                        diff.push(c["allele-targetMatch-visible-simpleDom2"].score[0] - c["allele-targetMatch-visible-simpleDom"].score[0]);

                        diff.push(c["allele-targetMatch-hidden-simpleDom2"].score[0] - c["allele-targetMatch-hidden-simpleDom"].score[0]);

                        diff.push(c["allele-targetMatch-visible-armorHorns3"].score[0] - c["allele-targetMatch-visible-armorHorns"].score[0]);

                        diff.push(c["allele-targetMatch-hidden-armorHorns3"].score[0] - c["allele-targetMatch-hidden-armorHorns"].score[0]);

                        diff.push(c["allele-targetMatch-visible-simpleColors5"].score[0] - c["allele-targetMatch-visible-simpleColors"].score[0])

                        diff.push(c["allele-targetMatch-hidden-simpleColors3"].score[0] - c["allele-targetMatch-hidden-simpleColors"].score[0]);

                        diff.push(c["allele-targetMatch-visible-harderTraits2"].score[0] - c["allele-targetMatch-visible-harderTraits"].score[0])

                        diff.push(c["allele-targetMatch-hidden-harderTraits2"].score[0] - c["allele-targetMatch-hidden-harderTraits"].score[0]);
                    } catch (err) {
                        console.log(err);
                    }
                    tableStr += testStr;
                    totalDiffs = 0;
                    for (d of diff) {
                        tableStr += "," + d;
                        totalDiffs += d;
                    }
                    tableStr += "," + totalDiffs;
                }
            } else {
                //console.log("No pre-post info for student " + s.id + " of teacher " + s.teacher.id + " in class " + s.class.id + ".");
            }
        } else {
            //console.log("Student " + n.id + " of teacher " + s.teacher.id + " in class " + s.class.id + " did not do the pre- and post-tests.");
        }
    } //New student
    let fileName = prompt('Enter file name') + '_challenge_scores';
    saveData()(tableStr, fileName);
}

//Create a csv table that reports on target match and clutch challenges, but just the length of time the student spent on them.
function makeElapsedTimeFile() {
    let allChallengesArr = targetMatchArray.concat(eggDropArray.concat(gameteArray.concat(clutchArray)));
    let tableStr = '';
    let n, s, chal;
    let numStudents = 0;
    let head = 'Teacher,Class,Student,Pre-total,Pre-allele,Pre-protein,Post-total,Post-allele,Post-protein,Gain-total,Gain-allele,Gain-protein';
    for (name of allChallengesArr) {
        head += ',' + name;
    }
    head += ", Total time";
    tableStr += head;
    for (s of students) {
        if (s.activityNames.length == 65) {
            s.totalTime = 0;
            n = newStudentsObj[s.id];
            if (typeof n != "undefined") {
                if (n.pre && n.post) {
                    numStudents++;
                    tableStr += '\n'
                    tableStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + n.pre_total_score + ',' + n.pre_allele_score + ',' + n.pre_protein_score + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score + ',' + (n.post_total_score - n.pre_total_score) + ',' + (n.post_allele_score - n.pre_allele_score) + ',' + (n.post_protein_score - n.pre_protein_score));
                    for (name of allChallengesArr) {
                        chal = s.activitiesByName[name]
                        if (typeof chal != "undefined") {
                            tableStr += ',' + chal.elapsedTime;
                            s.totalTime += chal.elapsedTime;
                        } else {
                            tableStr += ',N/A';
                        }
                    }
                    tableStr += ", " + s.totalTime;
                    //                console.log(numStudents + " in table.");
                } else {
                    //                        console.log("Student " + n.id + " of teacher " + s.teacher.id + " in class " + s.class.id + " did not do the pre- and post-tests.");
                }
            } else {
                //            console.log("No pre-post info for student " + s.id + " of teacher " + s.teacher.id + " in class " + s.class.id + ".");
            }
        } else {
            //        console.log("Student " + s.id + " of teacher " + s.teacher.id + " in class " + s.class.id + " didn't do all the challenges.");
        }
    }
    let fileName = prompt('Enter file name') + '_elapsed_times';
    saveData()(tableStr, fileName);
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
                summarizeTries(myActivity);
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