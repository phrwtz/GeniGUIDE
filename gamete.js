var gameteArray = [
    "gamete-targetMatch-starterTraits", "gamete-targetMatch-starterTraits2", "gamete-targetMatch-starterTraits3", "gamete-selectSpermEgg-starterTraits", "gamete-selectSpermEgg-starterTraits2", "gamete-selectSpermEgg-starterTraits-bothParents", "gamete-selectSpermEgg-starterTraits-bothParents2", "gamete-selectSpermEgg-harderTraits", "gamete-selectSpermEgg-harderTraits-bothParents"
];

//Add description to individual actions in gamete array of challenges
function describeGameteAction(action) {
    var description = "";
    switch (action.event) {
        case "Navigated":
            var level = parseInt(action.parameters.level) + 1,
                mission = parseInt(action.parameters.mission) + 1,
                challenge = parseInt(action.parameters.challenge) + 1;
            description = "Level " + level + ", mission " + mission + " challenge " + challenge;
            break;
        case "Guide hint received":
            var data = action.parameters.data,
                conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0],
                score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000,
                trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0],
                message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0],
                level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
            if (level != 1) {
                console.log("Hint level for gamete challenge ≠ 1")
            }
            description = "Level " + level + " hint received for  " + trait + ".<br>Message = " + message + "<br>Concept = " + conceptId + ", probability learned = " + score + ".";
    }
    return description;
}

//For each gamete challenge, run through the filtered students and count up all the hints they receive. Return a promise since the process may take a while.
function getGameteResults(filteredStudents) {
    return new Promise((resolve, reject) => {
        var gameteResultsArray = [],
            numStudents = 0,
            thisStudent,
            thisActivity,
            studentHints,
            activityHints;
        //Start new activity
        for (let j = 0; j < gameteArray.length; j++) {
            numStudents = 0;
            activityHints = 0;
            thisActivity = gameteArray[j];
            //Start new student
            for (let i = 0; i < filteredStudents.length; i++) {
                thisStudent = filteredStudents[i];
                studentHints = 0;
                if (thisStudent.activitiesByName[thisActivity]) {
                    numStudents++;
                    if (thisStudent.activitiesByName[thisActivity].eventsByName["Guide-hint-received"]) {
                        studentHints = thisStudent.activitiesByName[thisActivity].eventsByName["Guide-hint-received"].actions.length;
                        activityHints += studentHints;
                        var data = thisStudent.activitiesByName[thisActivity].eventsByName["Guide-hint-received"].actions[0].parameters.data;
                        var trait = data.match(/"attribute"[=|>|"]+([^"^,]+)/)[1];
                        var conceptId = data.match(/("conceptId")([^a-zA-z]+)([^"]+)/)[3]
                        var rawScore = data.match(/("conceptScore")([^\d]+)([\d.]+)/)[3];
                        var score = Math.round((parseFloat(rawScore) * 1000)) / 1000;
                        console.log("Student " + thisStudent.id + " had " + studentHints + " on challenge " + thisActivity + ".");
                    }
                }
            } //Back for new student
            console.log("Challenge " + thisActivity + " had " + activityHints + " hints.");
            console.log("");
            gameteResults = new Object();
            gameteResults.name = thisActivity;
            gameteResults.totalStudents = numStudents;
            gameteResults.hints = Math.round(1000 * activityHints / numStudents) / 1000;
            gameteResultsArray.push(gameteResults);
        } //Back for new activity
        resolve(gameteResultsArray);
    });
}

function makeGameteTable(gameteResultsArray) {
    var gameteResult, gameteRow, gameteCell1, gameteCell2, gameteCell3, gameteCell4;
    clear(gameteBody);
    for (let i = 0; i < gameteResultsArray.length; i++) {
        gameteResult = gameteResultsArray[i];
        gameteRow = document.createElement("tr");
        gameteCell1 = document.createElement("td");
        gameteCell2 = document.createElement("td");
        gameteCell3 = document.createElement("td");
        gameteRow.appendChild(gameteCell1);
        gameteRow.appendChild(gameteCell2);
        gameteRow.appendChild(gameteCell3);
        gameteBody.appendChild(gameteRow);
        gameteCell1.innerHTML = gameteResult.name;
        gameteCell2.innerHTML = gameteResult.totalStudents;
        gameteCell3.innerHTML = gameteResult.hints;
    }
}

function makeGameteCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Gamete arrays are different sizes!")
    }
    var compTable = document.getElementById("gameteCompTable"),
        compBody = document.getElementById("gameteCompBody"),
        targetMatchTable = document.getElementById("targetMatchCompTable");
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4, compCell5;
    targetMatchTable.style.display = "none";
    compTable.style.display = "block";
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
        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compBody.appendChild(compRow);

        compCell1.style.borderTopWidth = "2px";
        compCell2.style.borderTopWidth = "2px";
        compCell3.style.borderTopWidth = "2px";
        compCell4.style.borderTopWidth = "2px";

        compCell1.innerHTML = result1.name;
        compCell2.innerHTML = 1
        compCell3.innerHTML = result1.totalStudents;
        compCell4.innerHTML = result1.hints;

        //Make row for second cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compBody.appendChild(compRow);

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.hints;
    }
}