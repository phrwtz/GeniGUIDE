function countStudentsWithHints() {
    var activityArray = ["allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2", "allele-targetMatch-visible-armorHorns", "allele-targetMatch-visible-armorHorns2", "allele-targetMatch-visible-armorHorns3", "allele-targetMatch-hidden-armorHorns", "allele-targetMatch-hidden-armorHorns2",
        "allele-targetMatch-hidden-armorHorns3", "allele-targetMatch-visible-simpleColors", "allele-targetMatch-visible-simpleColors2", "allele-targetMatch-visible-simpleColors3", "allele-targetMatch-visible-simpleColors4", "allele-targetMatch-visible-simpleColors5", "allele-targetMatch-hidden-simpleColors", "allele-targetMatch-hidden-simpleColors2", "allele-targetMatch-hidden-simpleColors3"
    ];
    var hintsArray = [];
    var hintsTable = document.getElementById("hintsTable");
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
        level1Cell.innerHTML = hintsArray[1];
        level2Cell.innerHTML = hintsArray[2];
        level3Cell.innerHTML = hintsArray[3];
        hintsRow.appendChild(activityCell);
        hintsRow.appendChild(level1Cell);
        hintsRow.appendChild(level2Cell);
        hintsRow.appendChild(level3Cell);
        hintsRow.appendChild(allCell);
        hintsTable.appendChild(hintsRow);
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
                        level1++;
                        break;
                    case "2":
                        level2++;
                        break;
                    case "3":
                        level3++;
                        break;
                }
            }
        }
    }
    return [all, level1, level2, level3];
}