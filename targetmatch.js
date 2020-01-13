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
