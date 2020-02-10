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

        reader.onprogress = (function (f) {
            return function (e) {
                let today = new Date();
                let time = today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();;
                console.log("File " + f.name + " has loaded " + e.loaded + " bytes out of " + e.total + " at " + time + ". the data field is " + e.target.result.length + " long.");
         //       if (e.target.result.length == 0) {
         //           console.log("Stop!");
         //       }
            }
        })(f);

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