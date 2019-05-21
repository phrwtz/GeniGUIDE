function followStudent() {
    var toggleHints = document.getElementById("toggleHintsButton");
    for (var i = 0, myStudent; myStudent = students[i]; i++) {
        for (var j = 0, myHint; myHint = myStudent.hints[j]; j++) {
            //         console.log("At time " + myHint.time + " in challenge " + myHint.activity + ", student " + myStudent.id + " in class " + myStudent.class.id + " received a level " + myHint.hintLevel + " hint for trait " + myHint.attribute + ". The hint was related to concept " + myHint.conceptId + ". The probability that this concept was learned was " + myHint.score);
            addHintRow(myStudent, myHint);
        }
    } toggleHints.style.display = "inline";
}

function addHintRow(myStudent, myHint) {
    var hintsDiv = document.getElementById("hintsDiv");
    hintsDiv.style.display = "inline";
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
    if (myHint.conceptId == "LG1.C3") {
        console.log("stop");
    }
}

function toggleHintsTable() {
    var hintsTable = document.getElementById("hintsTable");
    var hintsSpan = document.getElementById("hintsSpan");
    var toggleHintsButton = document.getElementById("toggleHintsButton");
    if (hintsTable.style.display == "none") {
        hintsTable.style.display = "inline";
        hintsSpan.innerHTML = "Hide Hints Table";
    } else {
        hintsTable.style.display = "none";
        hintsSpan.innerHTML = "Show Hints Table";
    }
}

function tableToCSV(table) { //Converts an HTML table to a csv file
    var returnCSV = ""
    var tableHead = table.children[0];
    var headerRow = tableHead.children[0];
    var myRow;
    var myCell;
    var headerCell;
    var text;
    var contents;
    for (var i = 0; i < headerRow.children.length; i++) {
        headerCell = headerRow.children[i];
        text = headerCell.innerText;
        contents = text.match(/([\s]*)([A-Za-z]+[\s]?[A-Za-z]+)/)[2];
        returnCSV += contents;
        if (i != headerRow.children.length - 1) {
            returnCSV += ",";
        } else {
            returnCSV += "\n";
        }
    }
    for (var j = 1; j < table.children.length; j++) {
        myRow = table.children[j];
        for (var k = 0; k < myRow.children.length; k++) {
            contents = myRow.children[k].innerText;
            returnCSV += contents;
            if (k != myRow.children.length - 1) {
                returnCSV += ",";
            } else {
                returnCSV += "\n";
            }
        }
    }
    return (returnCSV);
}

function downloadHints() {
    var hintsTable = document.getElementById("hintsTable");
    var hintsCSV = tableToCSV(hintsTable);
    filename = "MC3PA_hints_data.csv"
    saveData()(hintsCSV, filename);
}

function saveData(data) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {
            type: "text/csv;encoding:utf-8"
        });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}