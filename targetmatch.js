var targetMatchArray = [ //Includes egg drop
    "allele-targetMatch-visible-simpleDom", "allele-targetMatch-visible-simpleDom2", "allele-targetMatch-hidden-simpleDom", "allele-targetMatch-hidden-simpleDom2",
    "allele-targetMatch-visible-armorHorns",
    "allele-targetMatch-visible-armorHorns2",
    "allele-targetMatch-visible-armorHorns3",
    "allele-targetMatch-hidden-armorHorns",
    "allele-targetMatch-hidden-armorHorns2",
    "allele-targetMatch-hidden-armorHorns3",
    "allele-targetMatch-visible-simpleColors",
    "allele-targetMatch-visible-simpleColors2",
    "allele-targetMatch-visible-simpleColors3",
    "allele-targetMatch-visible-simpleColors4",
    "allele-targetMatch-visible-simpleColors5",
    "allele-targetMatch-hidden-simpleColors",
    "allele-targetMatch-hidden-simpleColors2",
    "allele-targetMatch-hidden-simpleColors3",
    "allele-targetMatch-visible-harderTraits",
    "allele-targetMatch-visible-harderTraits2",
    "allele-targetMatch-hidden-harderTraits",
    "allele-targetMatch-hidden-harderTraits2"
];

//Add description to individual actions in target match array of challenges
function describeTargetMatch(action) {
    var myFields = Object.keys(action),
        data,
        conceptId,
        score,
        trait,
        practice,
        message,
        tab4 = "&#9;",
        description = "",
        targetGenotype,
        initialGenotype,
        initialSex,
        targetSex,
        initialSexInteger,
        targetSexInteger,
        targetPhenotype,
        tg,
        ig;
    if (action.event === "Guide hint received") {
        data = action.parameters.data;
        conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0];
        score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000;
        trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0];
        message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0];
        level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
        description = "<pre>" + tab4 + "<b>Level " + level + "</b> hint received for <b>" + trait + ".<br>" + tab4 + "Message = </b>" + message + "<br>" + tab4 + "<b>Concept = </b>" + conceptId + ", <b>probability learned =</b> " + score + ".</pre>";
    } else if (action.event === "Allele changed") {
        chromosome = action.parameters.chromosome;
        side = action.parameters.side;
        previousAllele = action.parameters.previousAllele;
        newAllele = action.parameters.newAllele;
        description = "Old allele = <b>" + previousAllele + "</b>, new Allele = <b>" + newAllele + "</b>, side = " + side + ".<br>";
    } else if (action.event === "Navigated") {
        level = parseInt(action.parameters.level) + 1;
        minimumMoves = parseInt(action.parameters.goalMoves);
        mission = parseInt(action.parameters.mission) + 1;
        targetGenotype = action.parameters.targetDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
        initialGenotype = action.parameters.initialDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
        //Get rid of that pesky comma and quotation mark at the end
        tg = targetGenotype.slice(0, targetGenotype.length - 2);
        ig = initialGenotype.slice(0, initialGenotype.length - 2);
        targetSexInteger = action.parameters.targetDrake.match(/(?<="sex"=>)([\d])/)[1];
        initialSexInteger = action.parameters.initialDrake.match(/(?<="sex"=>)([\d])/)[1];
        (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
        (initialSexInteger == "1" ? initialSex = "female" : initialSex = "male");
        description = "Level " + level + " mission " + mission + ".<br>Target genotype = " + tg + "<br>Initial genotype = " + ig + "<br>Target sex = " + targetSex + ", initial sex = " + initialSex + ".<br>" + "Minimum moves = " + minimumMoves + ".<br>";
    } else if (action.event === "Drake submitted") {
        target = action.parameters.target;
        selected = action.parameters.selected;
        targetSexInteger = target.match(/(?<="sex"=>)([\d])/)[1];
        (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
        selectedSexInteger = selected.match(/(?<="sex"=>)([\d])/)[1];
        (selectedSexInteger == "1" ? selectedSex = "female" : selectedSex = "male");
        targetPhenotype = target.match(/(?<="phenotype"=>{")([^}]+)/)[1];
        selectedGenotype = selected.match(/(?<="alleles"=>")([^\s]+)/)[1];
        sg = selectedGenotype.slice(0, selectedGenotype.length - 2);
        correct = action.parameters.correct;
        (correct == "true" ? correctStr = "<b>good</b>" : correctStr = "<b>bad</b>")
        description = "Target phenotype = " + targetPhenotype + "<br>Selected genotype = " + sg + "<br>Target sex = " + targetSex + ", selected sex = " + selectedSex + ". Submission is " + correctStr + ".<br>";
    } else if (action.event === "Sex changed") {
        (action.parameters.newSex == "1" ? description = "Changed sex from male to female." : description = "Changed sex from female to male.")
    } else if (action.event === "ITS Data Updated") {
        description = action.parameters.studentModel;
    } else if (action.event === "Guide remediation requested") {
        trait = action.parameters.attribute;
        practice = action.parameters.practiceCriteria;
        description = practice + " remediation has been called for on trait " + trait + ".<br>";
    }
    return description;
}

//For each target match challenge, find the number of students who have any tries on the challenge, the average number of tries for those students for that challenge, and the average numerical crystal score for that challenge.
function getTargetMatchResults(filteredStudents) {
    if (filteredStudents.length == 0) {
        console.log("In getTargetMatchResults. No filtered students.")
    }
    return new Promise((resolve, reject) => {
        var challengeResultsArray = [];
        var numStudents = 0,
            chalArray = [],
            activityTries = 0,
            tries,
            totalExcessMoves = 0,
            totalCorrect = 0,
            studentLevel1Hints,
            studentLevel2Hints,
            studentLevel3Hints,
            activityLevel1Hints,
            activityLevel2Hints,
            activityLevel3Hints,
            hintScoreArray = [],
            hintScoreMean,
            hintScoreStdDev,
            hintScoreMeanStdDev = [],
            totalRemediations,
            totalNumericalCrystals = 0,
            thisActivity;
        //Start new activity
        for (let j = 0; j < targetMatchArray.length; j++) {
            thisActivity = targetMatchArray[j];
            numStudents = 0;
            activityTries = 0;
            totalNumericalCrystals = 0;
            totalMoves = 0;
            studentLevel1Hints = 0;
            studentLevel2Hints = 0;
            studentLevel3Hints = 0;
            activityLevel1Hints = 0;
            activityLevel2Hints = 0;
            activityLevel3Hints = 0;
            studentActivityHintScores = [];
            totalRemediations = 0;
            //Start new student
            for (let i = 0; i < filteredStudents.length; i++) {
                thisStudent = filteredStudents[i];
                chalArray = checkout(thisStudent.id, thisActivity);
                tries = chalArray[0];
                totalRemediations += chalArray[1];
                //Only count student if s/he tried the activity at least once
                if (tries.length > 0) {
                    studentLevel1Hints = 0;
                    studentLevel2Hints = 0;
                    studentLevel3Hints = 0;
                    numStudents++;
                    var colorIndexArray = [];
                    for (let j = 0; j < tries.length; j++) {
                        thisTry = tries[j];
                        if (thisTry.correct) {
                            totalCorrect++;
                            totalExcessMoves += thisTry.excessMoves;
                        }
                        studentLevel1Hints += thisTry.level1Hints;
                        studentLevel2Hints += thisTry.level2Hints;
                        studentLevel3Hints += thisTry.level3Hints;
                        colorIndexArray.push(thisTry.crystalColor);
                    }
                    studentActivityHintScores.push((studentLevel1Hints + 2 * studentLevel2Hints + 3 * studentLevel3Hints) / tries.length);
                    maxColorIndex = colorIndexArray.reduce(function (a, b) {
                        return Math.max(a, b);
                    });
                    activityTries += tries.length;
                    if (isNaN(maxColorIndex)) {
                        console.log("Stop! Bad crystal!");
                    }
                    totalNumericalCrystals += maxColorIndex;
                }
                activityLevel1Hints += studentLevel1Hints;
                activityLevel2Hints += studentLevel2Hints;
                activityLevel3Hints += studentLevel3Hints;
            } //new student
            challengeResults = new Object();
            challengeResults.hintScores = [];
            challengeResults.name = thisActivity;
            challengeResults.totalStudents = numStudents;
            challengeResults.totalTries = activityTries;
            challengeResults.averageTries = Math.round(100 * activityTries / numStudents) / 100;
            challengeResults.averageExcessMoves = Math.round(100 * totalExcessMoves / totalCorrect) / 100;
            challengeResults.level1Hints = Math.round(1000 * activityLevel1Hints / activityTries) / 1000;
            challengeResults.level2Hints = Math.round(1000 * activityLevel2Hints / activityTries) / 1000;
            challengeResults.level3Hints = Math.round(1000 * activityLevel3Hints / activityTries) / 1000;
            challengeResults.hintScores = studentActivityHintScores;
            hintScoreMeanStdDev = meanStdDev(studentActivityHintScores);
            challengeResults.hintScoreMean = Math.round(1000 * hintScoreMeanStdDev[0]) / 1000;
            challengeResults.hintScoreStdDev = Math.round(1000 * hintScoreMeanStdDev[1]) / 1000;
            challengeResults.hintScoreStdErr = Math.round(1000 * hintScoreMeanStdDev[2]) / 1000;
            challengeResults.totalRemediations = totalRemediations;
            challengeResults.totalNumericalCrystals = totalNumericalCrystals;
            challengeResults.averageNumericalCrystal = Math.round(100 * totalNumericalCrystals / numStudents) / 100;
            challengeResultsArray.push(challengeResults);
        } //newActivity;
        resolve(challengeResultsArray);
    });
}

function makeTargetMatchTable(challengeResultsArray) {
    targetMatchTable.style.display = "block";
    eggDropTable.style.display = "none";
    var challengeResult,
        chalRow,
        chalCell;
    clear(targetMatchBody);
    for (let i = 0; i < challengeResultsArray.length; i++) {
        challengeResult = challengeResultsArray[i];
        chalRow = document.createElement("tr");
        chalCell1 = document.createElement("td");
        chalCell2 = document.createElement("td");
        chalCell3 = document.createElement("td");
        chalCell4 = document.createElement("td");
        chalCell5 = document.createElement("td");
        chalCell6 = document.createElement("td");
        chalCell7 = document.createElement("td");
        chalCell8 = document.createElement("td");
        chalCell9 = document.createElement("td");
        chalCell10 = document.createElement("td");

        chalCell6.style.backgroundColor = "cornsilk";
        chalCell7.style.backgroundColor = "cornsilk";
        chalCell8.style.backgroundColor = "cornsilk";
        chalCell9.style.backgroundColor = "cornsilk";
        chalCell10.style.backgroundColor = "azure";

        chalCell1.innerHTML = challengeResult.name;
        chalCell2.innerHTML = challengeResult.totalStudents;
        chalCell3.innerHTML = challengeResult.averageTries;
        chalCell4.innerHTML = challengeResult.averageExcessMoves;
        chalCell5.innerHTML = challengeResult.averageNumericalCrystal;
        chalCell6.innerHTML = challengeResult.level1Hints;
        chalCell7.innerHTML = challengeResult.level2Hints;
        chalCell8.innerHTML = challengeResult.level3Hints;
        chalCell9.innerHTML = challengeResult.hintScoreMean + " " + String.fromCharCode(177) + " " + challengeResult.hintScoreStdErr;
        chalCell10.innerHTML = challengeResult.totalRemediations;
        chalRow.appendChild(chalCell1);
        chalRow.appendChild(chalCell2);
        chalRow.appendChild(chalCell3);
        chalRow.appendChild(chalCell4);
        chalRow.appendChild(chalCell5);
        chalRow.appendChild(chalCell6);
        chalRow.appendChild(chalCell7);
        chalRow.appendChild(chalCell8);
        chalRow.appendChild(chalCell9);
        chalRow.appendChild(chalCell10);
        targetMatchBody.appendChild(chalRow);
    }
}

function makeTargetMatchCompTable(resultArray1, resultArray2) {
    if (resultArray1.length != resultArray2.length) {
        alert("Target match arrays are different sizes!")
    }
    var compTable = document.getElementById("targetMatchCompTable"),
        compBody = document.getElementById("targetMatchCompBody");
    var result1, result2;
    var compRow, compCell1, compCell2, compCell3, compCell4, compCell5;
    clear(compBody);
    compTable.style.display = "block";
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
        compCell8 = document.createElement("td");
        compCell9 = document.createElement("td");
        compCell10 = document.createElement("td");
        compCell11 = document.createElement("td");

        compCell1.style.borderTopWidth = "2px";
        compCell2.style.borderTopWidth = "2px";
        compCell3.style.borderTopWidth = "2px";
        compCell4.style.borderTopWidth = "2px";
        compCell5.style.borderTopWidth = "2px";
        compCell6.style.borderTopWidth = "2px";
        compCell7.style.borderTopWidth = "2px";
        compCell8.style.borderTopWidth = "2px";
        compCell9.style.borderTopWidth = "2px";
        compCell10.style.borderTopWidth = "2px";
        compCell11.style.borderTopWidth = "2px";

        compCell7.style.backgroundColor = "cornsilk";
        compCell8.style.backgroundColor = "cornsilk";
        compCell9.style.backgroundColor = "cornsilk";
        compCell10.style.backgroundColor = "cornsilk";
        compCell11.style.backgroundColor = "azure";

        compCell1.innerHTML = result1.name;
        compCell2.innerHTML = 1
        compCell3.innerHTML = result1.totalStudents;
        compCell4.innerHTML = result1.averageTries;
        compCell5.innerHTML = result1.averageExcessMoves;
        compCell6.innerHTML = result1.averageNumericalCrystal;
        compCell7.innerHTML = result1.level1Hints;
        compCell8.innerHTML = result1.level2Hints;
        compCell9.innerHTML = result1.level3Hints;
        compCell10.innerHTML = result1.hintScoreMean + " " + String.fromCharCode(177) + " " + result1.hintScoreStdErr;
        compCell11.innerHTML = result1.totalRemediations;

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compRow.appendChild(compCell7);
        compRow.appendChild(compCell8);
        compRow.appendChild(compCell9);
        compRow.appendChild(compCell10);
        compRow.appendChild(compCell11);
        compBody.appendChild(compRow);

        //Make row from second cohort
        compRow = document.createElement("tr");
        compCell1 = document.createElement("td");
        compCell2 = document.createElement("td");
        compCell3 = document.createElement("td");
        compCell4 = document.createElement("td");
        compCell5 = document.createElement("td");
        compCell6 = document.createElement("td");
        compCell7 = document.createElement("td");
        compCell8 = document.createElement("td");
        compCell9 = document.createElement("td");
        compCell10 = document.createElement("td");

        compCell6.style.backgroundColor = "cornsilk";
        compCell7.style.backgroundColor = "cornsilk";
        compCell8.style.backgroundColor = "cornsilk";
        compCell9.style.backgroundColor = "cornsilk";
        compCell10.style.backgroundColor = "azure";

        compCell1.innerHTML = 2;
        compCell2.innerHTML = result2.totalStudents;
        compCell3.innerHTML = result2.averageTries;
        compCell4.innerHTML = result2.averageExcessMoves;
        compCell5.innerHTML = result2.averageNumericalCrystal;
        compCell6.innerHTML = result2.level1Hints;
        compCell7.innerHTML = result2.level2Hints;
        compCell8.innerHTML = result2.level3Hints;
        compCell9.innerHTML = result2.hintScoreMean + " " + String.fromCharCode(177) + " " + result2.hintScoreStdErr;
        compCell10.innerHTML = result2.totalRemediations;

        compRow.appendChild(compCell1);
        compRow.appendChild(compCell2);
        compRow.appendChild(compCell3);
        compRow.appendChild(compCell4);
        compRow.appendChild(compCell5);
        compRow.appendChild(compCell6);
        compRow.appendChild(compCell7);
        compRow.appendChild(compCell8);
        compRow.appendChild(compCell9);
        compRow.appendChild(compCell10);
        compBody.appendChild(compRow);
    }
}
