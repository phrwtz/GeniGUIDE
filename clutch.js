var clutchArray = [
    "clutch-5drakes-starterTraits",
    "clutch-5drakes-starterTraits2",
    "clutch-5drakes-starterTraits3",
    "clutch-5drakes-intermediateTraits",
    "clutch-5drakes-intermediateTraits2",
    "clutch-5drakes-harderTraits-bothParents",
    "clutch-5drakes-harderTraits-bothParents2"
];

//Add description to individual actions in clutch array of challenges
function describeClutchAction(action) {
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
                console.log("Hint level for clutch challenge = " + hintLevel);
            }
            description = "Level " + hintLevel + " hint received for  " + trait + ".<br>Message = " + message + "<br>Concept = " + conceptId + ", probability learned = " + score + ".";
            break;
        case "Drake submitted":
            var correct = (action.parameters.correct === "true");
            var correctStr = (correct ? "Correct" : "Wrong");
            description = correctStr + " drake submitted.";
    }
    return description;
}

//For each clutch challenge, run through the filtered students and count up all the hints they receive. Return a promise since the process may take a while.
function getClutchResults(filteredStudents) {
    if (filteredStudents.length == 0) {
        console.log("In getClutchResults. No filtered students.")
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
        for (let j = 0; j < clutchArray.length; j++) {
            thisActivity = clutchArray[j];
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

function makeClutchTable(clutchResultsArray) {
    var clutchResult, clutchRow, clutchCell1, clutchCell2, clutchCell3, clutchCell4;
    clear(clutchBody);
    for (let i = 0; i < clutchResultsArray.length; i++) {
        clutchResult = clutchResultsArray[i];
        clutchRow = document.createElement("tr");
        clutchCell1 = document.createElement("td");
        clutchCell2 = document.createElement("td");
        clutchCell3 = document.createElement("td");
        clutchCell4 = document.createElement("td");
        clutchCell5 = document.createElement("td");
        clutchCell6 = document.createElement("td");
        clutchRow.appendChild(clutchCell1);
        clutchRow.appendChild(clutchCell2);
        clutchRow.appendChild(clutchCell3);
        clutchRow.appendChild(clutchCell4);
        clutchRow.appendChild(clutchCell5);
        clutchRow.appendChild(clutchCell6);
        clutchBody.appendChild(clutchRow);
        clutchCell1.innerHTML = clutchResult.name;
        clutchCell2.innerHTML = clutchResult.totalStudents;
        clutchCell3.innerHTML = clutchResult.level1Hints;
        clutchCell4.innerHTML = clutchResult.level2Hints;
        clutchCell5.innerHTML = clutchResult.level3Hints;
        clutchCell6.innerHTML = clutchResult.hintScoreMean + " " + String.fromCharCode(177) + " " + clutchResult.hintScoreStdErr;
    }
}

function makeClutchCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Gamete arrays are different sizes!")
    }
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4, compCell5, compCell6, compCell7;
    var compBody = clutchCompBody;
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