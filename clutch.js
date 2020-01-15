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
    }
    return description;
}

//For each clutch challenge, run through the filtered students and count up all the hints they receive. Return a promise since the process may take a while.
function getClutchResults(filteredStudents) {
    return new Promise((resolve, reject) => {
        var clutchResultsArray = [],
            numStudents = 0,
            thisStudent,
            thisActivity,
            studentHints,
            activityHints;
        //Start new activity
        for (let j = 0; j < clutchArray.length; j++) {
            numStudents = 0;
            activityHints = 0;
            thisActivity = clutchArray[j];
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
            clutchResults = new Object();
            clutchResults.name = thisActivity;
            clutchResults.totalStudents = numStudents;
            clutchResults.hints = Math.round(1000 * activityHints / numStudents) / 1000;
            clutchResultsArray.push(clutchResults);
        } //Back for new activity
        resolve(clutchResultsArray);
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
        clutchRow.appendChild(clutchCell1);
        clutchRow.appendChild(clutchCell2);
        clutchRow.appendChild(clutchCell3);
        clutchBody.appendChild(clutchRow);
        clutchCell1.innerHTML = clutchResult.name;
        clutchCell2.innerHTML = clutchResult.totalStudents;
        clutchCell3.innerHTML = clutchResult.hints;
    }
}

function makeClutchCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Clutch arrays are different sizes!");
    }
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4;
    clear(clutchCompBody);
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
        clutchCompBody.appendChild(compRow);

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
        clutchCompBody.appendChild(compRow);

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.hints;
    }
}