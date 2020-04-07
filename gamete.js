const gameteArray = [
    "gamete-5drakes-starterTraits",
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
            description = "Level " + level + ", mission " + mission + ", challenge " + challenge;
            break;
        case "Guide hint received":
            var data = action.parameters.data,
                conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0],
                score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000,
                trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0],
                message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0],
                hintLevel = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
            if (hintLevel != 1) {
                console.log("Hint level for gamete challenge = " + hintLevel);
            }
            description = "Level " + hintLevel + " hint received for  " + trait + ".<br>Message = " + message + "<br>Concept = " + conceptId + ", probability learned = " + score + ".";
            break;
    }
    return description;
}

//For each gamete challenge, run through the filtered students and count up all the hints they receive. Return a promise since the process may take a while.
function getGameteResults(filteredStudents) {
    if (filteredStudents.length == 0) {
        console.log("In getGameteResults. No filtered students.")
    }
    return new Promise((resolve, reject) => {
        var challengeResultsArray = [],
            numStudents = 0,
            studentHintArray = [],
            studentLevel1Hints,
            studentLevel2Hints,
            studentLevel3Hints,
            activityLevel1Hints,
            activityLevel2Hints,
            activityLevel3Hints,
            studentHintScore,
            thisActivity,
            activityHintScores = [],
            hintScoreMeanStdDev = [];
        //Start new activity
        for (let j = 0; j < gameteArray.length; j++) {
            thisActivity = gameteArray[j];
            numStudents = 0;
            activityLevel1Hints = 0;
            activityLevel2Hints = 0;
            activityLevel3Hints = 0;
            activityHintScores = [];
            //Start new student
            for (let i = 0; i < filteredStudents.length; i++) {
                thisStudent = filteredStudents[i];
                studentHintArray = [0, 0, 0];
                numStudents++;
                studentHintArray = parseHints(thisStudent, thisActivity)
                studentLevel1Hints = studentHintArray[0];
                studentLevel2Hints = studentHintArray[1];
                studentLevel3Hints = studentHintArray[2];
                studentHintScore = studentLevel1Hints + 2 * studentLevel2Hints + 3 * studentLevel3Hints;
                activityLevel1Hints += studentLevel1Hints;
                activityLevel2Hints += studentLevel2Hints;
                activityLevel3Hints += studentLevel3Hints;
                activityHintScores.push(studentHintScore);
            } //New student
            //Gather results for this activity across all (filtered) students
            challengeResults = new Object();
            challengeResults.name = thisActivity;
            challengeResults.totalStudents = numStudents;
            challengeResults.level1Hints = Math.round(1000 * activityLevel1Hints / numStudents) / 1000;
            challengeResults.level2Hints = Math.round(1000 * activityLevel2Hints / numStudents) / 1000;
            challengeResults.level3Hints = Math.round(1000 * activityLevel3Hints / numStudents) / 1000;
            hintScoreMeanStdDev = meanStdDev(activityHintScores);
            challengeResults.hintScoreMean = Math.round(1000 * hintScoreMeanStdDev[0]) / 1000;
            challengeResults.hintScoreStdErr = Math.round(1000 * hintScoreMeanStdDev[2]) / 1000;
            challengeResultsArray.push(challengeResults);
        } //new Activity;
        resolve(challengeResultsArray);
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
        gameteCell4 = document.createElement("td");
        gameteCell5 = document.createElement("td");
        gameteCell6 = document.createElement("td");
        gameteRow.appendChild(gameteCell1);
        gameteRow.appendChild(gameteCell2);
        gameteRow.appendChild(gameteCell3);
        gameteRow.appendChild(gameteCell4);
        gameteRow.appendChild(gameteCell5);
        gameteRow.appendChild(gameteCell6);
        gameteBody.appendChild(gameteRow);
        gameteCell1.innerHTML = gameteResult.name;
        gameteCell2.innerHTML = gameteResult.totalStudents;
        gameteCell3.innerHTML = gameteResult.level1Hints;
        gameteCell4.innerHTML = gameteResult.level2Hints;
        gameteCell5.innerHTML = gameteResult.level3Hints;
        gameteCell6.innerHTML = gameteResult.hintScoreMean + " " + String.fromCharCode(177) + " " + gameteResult.hintScoreStdErr;
    }
}

function makeGameteCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Gamete arrays are different sizes!")
    }
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4, compCell5, compCell6, compCell7;
    var compBody = gameteCompBody;
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
        compCell5 = document.createElement("td");
        compCell6 = document.createElement("td");
        compCell7 = document.createElement("td");

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compRow.appendChild(compCell7);
        compBody.appendChild(compRow);

        compCell1.style.borderTopWidth = "2px";
        compCell2.style.borderTopWidth = "2px";
        compCell3.style.borderTopWidth = "2px";
        compCell4.style.borderTopWidth = "2px";
        compCell5.style.borderTopWidth = "2px";
        compCell6.style.borderTopWidth = "2px";
        compCell7.style.borderTopWidth = "2px";

        compCell1.innerHTML = result1.name;
        compCell2.innerHTML = 1
        compCell3.innerHTML = result1.totalStudents;
        compCell4.innerHTML = result1.level1Hints;
        compCell5.innerHTML = result1.level2Hints;
        compCell6.innerHTML = result1.level3Hints;
        compCell7.innerHTML = result1.hintScoreMean + " " + String.fromCharCode(177) + " " + result1.hintScoreStdErr;

        //Make row for second cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compCell4 = document.createElement("td");
        compCell5 = document.createElement("td");
        compCell6 = document.createElement("td");

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compBody.appendChild(compRow);

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.level1Hints;
        compCell4.innerHTML = result2.level2Hints;
        compCell5.innerHTML = result2.level3Hints;
        compCell6.innerHTML = result2.hintScoreMean + " " + String.fromCharCode(177) + " " + result2.hintScoreStdErr;
    }
}