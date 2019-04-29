function countStudentsWithHints() {
    var hintsArray = [];
    var hintsTable = document.getElementById("hintsTable");
    if (document.getElementById("hintsBody")) {
        hintsTable.removeChild(document.getElementById("hintsBody"))
    } else {
        var hintsBody = document.createElement("tbody");
        hintsBody.id = "hintsBody";
        hintsTable.appendChild(hintsBody);
    }
    for (j = 0; j < uniqueHintActivityNames.length; j++) {
        myHintActivityName = uniqueHintActivityNames[j];
        hintsArray = countHints(myHintActivityName);
        hintsRow = document.createElement("tr");
        activityCell = document.createElement("td");
        level1Cell = document.createElement("td");
        level2Cell = document.createElement("td");
        level3Cell = document.createElement("td");
        allCell = document.createElement("td");
        activityCell.innerHTML = myHintActivityName;
        allCell.innerHTML = hintsArray[0];
        level1Cell.innerHTML = hintsArray[1] + " (" + Math.round(100 * (hintsArray[1] / hintsArray[0])) + "%)";
        level2Cell.innerHTML = hintsArray[2] + " (" + Math.round(100 * (hintsArray[2] / hintsArray[0])) + "%)";
        level3Cell.innerHTML = hintsArray[3] + " (" + Math.round(100 * (hintsArray[3] / hintsArray[0])) + "%)";
        hintsRow.appendChild(activityCell);
        hintsRow.appendChild(level1Cell);
        hintsRow.appendChild(level2Cell);
        hintsRow.appendChild(level3Cell);
        hintsRow.appendChild(allCell);
        hintsBody.appendChild(hintsRow);
        hintsTable.style.display = "block";
    }
}

function countHints(activity) { //Returns an array of all the students who did the activity, followed by those who received level 1,level 2, and level 3 hints
    var all = 0,
        level1 = 0,
        level2 = 0,
        level3 = 0,
        myActivity;
    for (var i = 0; i < activities.length; i++) {
        myActivity = activities[i];
        if (myActivity.name == activity) {
            all++;
            for (var j = 0; j < myActivity.hints.length; j++) {
                myHint = myActivity.hints[j];
                switch (myHint.level) {
                    case "1":
                        all++;
                        level1++;
                        break;
                    case "2":
                        all++;
                        level2++;
                        break;
                    case "3":
                        all++;
                        level3++;
                        break;
                }
            }
        }
    }
    return [all, level1, level2, level3];
}