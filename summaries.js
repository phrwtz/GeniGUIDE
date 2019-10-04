function summarizeHints(students) {
    //summarizes hints for concepts LG1.C2a and LG1.c2b for activities "allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", and "allele-targetMatch-hidden-simpleDom2". Returns total number of students in each activity and number in each hint category (no hints, highest hint level = 1,2,3) 
    document.getElementById("hintTable").style.display = "block";
    clear(document.getElementById("hintBody"));
    var conceptIds = ["LG1.C2a", "LG1.C2b"];
    for (var i = 0; i < teachers.length; i++) {
        var myTeacher = teachers[i];
        addHintRow(myTeacher.name);
        var myStudents = []
        var myHint;
        hintTotals = new Object;
        hintTotals["avw1"] = 0;
        hintTotals["avw2"] = 0;
        hintTotals["avw3"] = 0;
        hintTotals["ava1"] = 0;
        hintTotals["ava2"] = 0;
        hintTotals["ava3"] = 0;
        hintTotals["avl1"] = 0;
        hintTotals["avl2"] = 0;
        hintTotals["avl3"] = 0;
        hintTotals["ahw1"] = 0;
        hintTotals["ahw2"] = 0;
        hintTotals["ahw3"] = 0;
        hintTotals["aha1"] = 0;
        hintTotals["aha2"] = 0;
        hintTotals["aha3"] = 0;
        hintTotals["ahl1"] = 0;
        hintTotals["ahl2"] = 0;
        hintTotals["ahl3"] = 0;

        hintTotals["bvw1"] = 0;
        hintTotals["bvw2"] = 0;
        hintTotals["bvw3"] = 0;
        hintTotals["bva1"] = 0;
        hintTotals["bva2"] = 0;
        hintTotals["bva3"] = 0;
        hintTotals["bvl1"] = 0;
        hintTotals["bvl2"] = 0;
        hintTotals["bvl3"] = 0;
        hintTotals["bhw1"] = 0;
        hintTotals["bhw2"] = 0;
        hintTotals["bhw3"] = 0;
        hintTotals["bha1"] = 0;
        hintTotals["bha2"] = 0;
        hintTotals["bha3"] = 0;
        hintTotals["bhl1"] = 0;
        hintTotals["bhl2"] = 0;
        hintTotals["bhl3"] = 0;

        var conceptStr,
            challengeStr,
            traitStr,
            levelStr,
            cellId;
        for (var j = 0; j < myTeacher.studentIds.length; j++) {
            if (myTeacher.studentsObj[myTeacher.studentIds[j]]) {
                //      console.log("Working on teacher " + myTeacher.name);
                myStudent = myTeacher.studentsObj[myTeacher.studentIds[j]];
                if (myStudent) {
                    //         console.log("Working on student " + myStudent.id); 
                    for (var k = 0; k < myStudent.hints.length; k++) {
                        myHint = myStudent.hints[k];
                        if ((myHint.activity.indexOf("simpleDom") != -1) && ((myHint.conceptId === "LG1.C2a") || (myHint.conceptId === "LG1.C2b"))) {
                            switch (myHint.conceptId) {
                                case "LG1.C2a": {
                                    conceptStr = "a";
                                    break;
                                }
                                case "LG1.C2b": {
                                    conceptStr = "b";
                                    break;
                                }
                            }
                            if (myHint.activity.indexOf("visible") != -1) {
                                challengeStr = "v";
                            } else if (myHint.activity.indexOf("hidden") != -1) {
                                challengeStr = "h";
                            } else {
                                alert("Challenge is neither visible nor hidden!");
                            }
                            switch (myHint.trait) {
                                case "wings": {
                                    traitStr = "w";
                                    break;
                                }
                                case "forelimbs": {
                                    traitStr = "a";
                                    break;
                                }
                                case "hindlimbs": {
                                    traitStr = "l";
                                    break;
                                }
                            }
                            switch (myHint.level) {
                                case 1: {
                                    levelStr = "1";
                                    break;
                                }
                                case 2: {
                                    levelStr = "2";
                                    break;
                                }
                                case 3: {
                                    levelStr = "3";
                                    break;
                                }
                            }
                            cellId = conceptStr + challengeStr + traitStr + levelStr;
                            hintTotals[cellId]++;
                        }
                    }
                    //        console.log("Done with student " + myStudent.id);
                }
            }
        }
        //    console.log("Inserting totals for teacher " + myTeacher.name);
        var myKey;
        var myId;
        try {
            for (myKey in hintTotals) {
                myId = myTeacher.name + myKey
                document.getElementById(myId).innerHTML = hintTotals[myKey];
            }
        } catch (err) {
            console.log(err + myKey);
        }
    }
}

function addHintRow(teacherName) {
    var hintTable = document.getElementById("hintTable");
    var hintBody = document.getElementById("hintBody");
    var hintIdArray = ["avw1",
        "avw2",
        "avw3",
        "ava1",
        "ava2",
        "ava3",
        "avl1",
        "avl2",
        "avl3",
        "ahw1",
        "ahw2",
        "ahw3",
        "aha1",
        "aha2",
        "aha3",
        "ahl1",
        "ahl2",
        "ahl3",
        "bvw1",
        "bvw2",
        "bvw3",
        "bva1",
        "bva2",
        "bva3",
        "bvl1",
        "bvl2",
        "bvl3",
        "bhw1",
        "bhw2",
        "bhw3",
        "bha1",
        "bha2",
        "bha3",
        "bhl1",
        "bhl2",
        "bhl3"
    ]
    var hintRow = document.createElement("tr");
    hintBody.appendChild(hintRow);
    var newCell = document.createElement("td");
    newCell.id = teacherName;
    newCell.style.backgroundColor = "blanchedalmond";
    newCell.style.borderWidth = "2px";
    newCell.innerHTML = "<b>" + teacherName + "</b>";
    hintRow.appendChild(newCell);
    for (var i = 0; i < hintIdArray.length; i++) {
        hintId = hintIdArray[i];
        newCell = document.createElement("td");
        newCell.id = teacherName + hintId;
        if (hintId.substring(hintId.length - 1) === "3") {
                newCell.style.borderRightWidth = "3px";
        }
        if (hintId.substring(hintId.length - 2, 1) === "v") {
            newCell.style.backgroundColor = "#ffffb3";
        } else if (hintId.substring(hintId.length - 2, 1) === "h") {
            newCell.style.backgroundColor = "#ffe6ff";
        }
        hintRow.appendChild(newCell);
    }
}

function parseHint(row) {
    var hint = new Object();
    var data = row.parameters.data;
    hint.conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0];
    hint.score = parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0]);
    hint.activity = data.match(/(?<="challengeId"=>")([^"]+)/g)[0];
    hint.trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0];
    hint.dialog = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0];
    hint.level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
    return hint;
}