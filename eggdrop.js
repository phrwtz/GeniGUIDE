var eggDropArray = [
    "eggDrop-wings", "eggDrop-limbs", "eggDrop-horns", "eggDrop-armor", "eggDrop-tail", "eggDrop-noseSpike"];

//For each egg drop challenge, run through the filtered students and count up all the hints they receive. Return a promise since the process may take a while.
function getEggdropResults(filteredStudents) {
    return new Promise((resolve, reject) => {
        var eggResultsArray = [],
            numStudents = 0,
            thisStudent,
            thisActivity,
            studentHints,
            studentEggsRejected,
            activityHints,
            activityEggsRejected;
        //Start new activity
        for (let j = 0; j < eggDropArray.length; j++) {
            activityEggsRejected = 0;
            activityHints = 0;
            thisActivity = eggDropArray[j];
            numStudents = 0;
            //Start new student
            for (let i = 0; i < filteredStudents.length; i++) {
                thisStudent = filteredStudents[i];
                studentHints = 0;
                studentEggsRejected = 0;
                if (thisStudent.activitiesByName[thisActivity]) {
                    numStudents++;
                    if (thisStudent.activitiesByName[thisActivity].eventsByName["Egg-rejected"]) {
                        studentEggsRejected = thisStudent.activitiesByName[thisActivity].eventsByName["Egg-rejected"].actions.length;
                        activityEggsRejected += studentEggsRejected;
                    }
                    if (thisStudent.activitiesByName[thisActivity].eventsByName["Guide-hint-received"]) {
                        studentHints = thisStudent.activitiesByName[thisActivity].eventsByName["Guide-hint-received"].actions.length;
                        activityHints += studentHints;
                        var data = thisStudent.activitiesByName[thisActivity].eventsByName["Guide-hint-received"].actions[0].parameters.data;
                        var trait = data.match(/"attribute"[=|>|"]+([^"^,]+)/)[1];
                        var conceptId = data.match(/("conceptId")([^a-zA-z]+)([^"]+)/)[3]
                        var rawScore = data.match(/("conceptScore")([^\d]+)([\d.]+)/)[3];
                        var score = Math.round((parseFloat(rawScore) * 1000)) / 1000;
                        console.log("Student " + thisStudent.id + " had " + studentEggsRejected + " eggs rejected and got " + studentHints + " on challenge " + thisActivity + ".");
                    }
                }
            } //Back for new student
            console.log("Challenge " + thisActivity + " had " + activityHints + " hints and " + activityEggsRejected + " eggs rejected.");
            console.log("");
            eggResults = new Object();
            eggResults.name = thisActivity;
            eggResults.totalStudents = numStudents;
            eggResults.eggsRejected = Math.round(1000 * activityEggsRejected / numStudents) / 1000;
            eggResults.hints = Math.round(1000 * activityHints / numStudents) / 1000;
            eggResultsArray.push(eggResults);
        } //Back for new activity
        resolve(eggResultsArray);
    });
}

function makeEggdropTable(eggResultsArray) {
    var eggResult, eggRow, eggCell1, eggCell2, eggCell3, eggCell4;
    clear(eggDropBody);
    for (let i = 0; i < eggResultsArray.length; i++) {
        eggResult = eggResultsArray[i];
        eggRow = document.createElement("tr");
        eggCell1 = document.createElement("td");
        eggCell2 = document.createElement("td");
        eggCell3 = document.createElement("td");
        eggCell4 = document.createElement("td");
        eggRow.appendChild(eggCell1);
        eggRow.appendChild(eggCell2);
        eggRow.appendChild(eggCell3);
        eggRow.appendChild(eggCell4);
        eggDropBody.appendChild(eggRow);
        eggCell1.innerHTML = eggResult.name;
        eggCell2.innerHTML = eggResult.totalStudents;
        eggCell3.innerHTML = eggResult.eggsRejected;
        eggCell4.innerHTML = eggResult.hints;
    }
}

function makeEggDropCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Egg drop arrays are different sizes!")
    }
    var compTable = document.getElementById("eggDropCompTable"),
        compBody = document.getElementById("eggDropCompBody"),
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
        compCell5 = document.createElement("td");
        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compBody.appendChild(compRow);

        compCell1.style.borderTopWidth = "2px";
        compCell2.style.borderTopWidth = "2px";
        compCell3.style.borderTopWidth = "2px";
        compCell4.style.borderTopWidth = "2px";
        compCell5.style.borderTopWidth = "2px";

        compCell1.innerHTML = result1.name;
        compCell2.innerHTML = 1
        compCell3.innerHTML = result1.totalStudents;
        compCell4.innerHTML = result1.eggsRejected;
        compCell5.innerHTML = result1.hints;

        //Make row for second cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compCell4 = document.createElement("td");
        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compBody.appendChild(compRow);

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.eggsRejected;
        compCell4.innerHTML = result2.hints;
    }
}
