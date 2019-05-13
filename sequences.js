function followStudent() {
    for (var i = 0, myStudent; myStudent = students[i]; i++) {
        for (var j = 0, myHint; myHint = myStudent.hints[j]; j++) {
            console.log("At time " + myHint.time + " in challenge " + myHint.activity + ", student " + myStudent.id + " in class " + myStudent.class.id + " received a level " + myHint.hintLevel + " hint for trait " + myHint.attribute + ". The hint was related to concept " + myHint.conceptId + ". The probability that this concept was learned was " + myHint.score);
            addHintRow(myStudent, myHint);
        }
    }
}

function addHintRow(myStudent, myHint) {
    var hintsTable = document.getElementById("hintsTable");
    hintsTable.style.display = "inline";
    var hintRow = document.createElement("tr");
    var classCell = document.createElement("td");
    var studentCell = document.createElement("td");
    var timeCell = document.createElement("td");
    var challengeCell = document.createElement("td");
    var hintLevelCell = document.createElement("td");
    var traitCell = document.createElement("td");
    var conceptIDCell = document.createElement("td");
    var scoreCell = document.createElement("td");
    classCell.id = "class";
    studentCell.id = "student";
    timeCell.id = "time";
    challengeCell.id = "challenge";
    hintLevelCell.id = "hintLevel";
    traitCell.id = "trait";
    conceptIDCell.id = "conceptID";
    scoreCell.id = "score";
    classCell.innerHTML = myStudent.class.id;
    studentCell.innerHTML = myStudent.id;
    timeCell.innerHTML = myHint.time;
    challengeCell.innerHTML = myHint.activity;
    hintLevelCell.innerHTML = myHint.hintLevel;
    traitCell.innerHTML = myHint.attribute;
    conceptIDCell.innerHTML = myHint.conceptId;
    scoreCell.innerHTML = myHint.score;
    hintRow.appendChild(classCell);
    hintRow.appendChild(studentCell);
    hintRow.appendChild(timeCell);
    hintRow.appendChild(challengeCell);
    hintRow.appendChild(hintLevelCell);
    hintRow.appendChild(traitCell);
    hintRow.appendChild(conceptIDCell);
    hintRow.appendChild(scoreCell);
    hintsTable.appendChild(hintRow);

}