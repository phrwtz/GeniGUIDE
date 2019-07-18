function findSelectedButton(name) { // returns the id of the checked radio button with name. If no radio button has been checked returns null.
    var buttons = document.getElementsByName(name);
    if (!buttons.length == 0) {
        var myButton,
            myLevel;
        for (var t = 0; t < buttons.length; t++) {
            myButton = buttons[t];
            if (myButton.checked) {
                id = myButton.id;
                return id;
            }
        }
    } else {
        return null;
    }
}

function getStudentByID(id) {
    for (var i = 0, myStudent; myStudent = students[i]; i++) {
        if (myStudent.id == id) {
            return myStudent;
        }
    }
    return null;
}

function findSelectedClassID() {
    var selectedClassID,
        classRadios = document.getElementsByName("classidRadio");
    for (var i = 0; i < classRadios.length; i++) {
        if (classRadios[i].checked) {
            return classRadios[i].id;
        }
    }
    return null;
}

function findActCountByActivity(activity, actCountArray) {
    for (var i = 0; i < actCountArray.length; i++) {
        if (actCountArray[i].activity == activity) {
            return actCountArray[i];
        }
    }
    return null;
}

function findEventCountByEvent(eventStr, eventCountArray) {
    for (var i = 0; i < eventCountArray.length; i++) {
        if (eventCountArray[i].event == eventStr) {
            return eventCountArray[i];
        }
    }
    return null;
}

function findCountObjByString(str, arr) { //returns the countObj with the string property equal to str in the array arr of countObjs. If no countObj has that string property returns null
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].string == str) {
            return arr[i];
        }
    }
    return null;
}

function findAlleleChangeActions() {
    var id = findSelectedStudentID();
    var myStudent = getStudentByID(id);
    var actions = myStudent.actions;
    var selectedActions = [];
    for (var i = 0; i < actions.length; i++) {
        if (actions[i].event == "Allele changed") {
            selectedActions.push(actions[i]);
        }
    }
    return selectedActions;
}

function setColorCode(object, nameField) {
    var string;
    if ((object.hintReceived && !object.remediationRequested) || (object.name == "Guide-hint-received")) {
        string = "<span style=\"color:red\">" + object[nameField] + "</span>";
    } else if ((!object.hintReceived && object.remediationRequested) || (object.name == "Guide-remediation-requested")) {
        string = "<span style=\"color:blue\">" + object[nameField] + "</span>";
    } else if (object.hintReceived && object.remediationRequested) {
        string = "<span style=\"color:#990099\">" + object[nameField] + "</span>";
    } else {
        string = object[nameField];
    }
    return string;
}

function checkedButtons(name) { //returns an array of ids of all checked buttons with name <name>. Returns an empty array if no buttons are checked
    var selectedIds = [];
    var buttons = document.getElementsByName(name);
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) {
            selectedIds.push(buttons[i].id);
        }
    }
    return selectedIds;
}

function uncheckButtons(name) {
    var buttons = document.getElementsByName(name);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].checked = false;
    }
}

function getComponentById(array, field, id) { //Returns the first object in array whose value for field = id
    for (var i = 0; i < array.length; i++) {
        if (array[i][field] == id) {
            return array[i];
        }
    }
}

function searchForParametersAndExtras() {
    studentCount = 0;
    extrasCount = 0;
    parametersCount = 0;
    for (var i = 0; i < students.length; i++) {
        for (var j = 0; j < students[i].actions.length; j++) {
            studentCount++;
            myAction = students[i].actions[j];
            if (Object.getOwnPropertyNames(myAction.parameters).length > 0); {
                parametersCount++;
            }
            if (Object.getOwnPropertyNames(myAction.extras).length > 0); {
                extrasCount++;
            }
        }
    }
    console.log("Out of " + studentCount + " students " + parametersCount + " had a non-zero parameter field and " + extrasCount + " had a non-zero extras field.");
}

function findActions(activity, event) {
    var actionsFound = [];
    var eventsFound = [];
    for (var i = 0, myRow; myRow = rowObjs[i]; i++) {
        if (myRow.activity == activity) {
            actionsFound.push(myRow);
            if (myRow.event == event) {
                eventsFound.push(myRow);
            }
        }
    }
    return [actionsFound.length, eventsFound.length];
}

function findHints() {
    var actionsWithHints = [],
        studentsWithHints = [],
        vDom = "allele-targetMatch-visible-simpleDom",
        hDom = "allele-targetMatch-hidden-simpleDom",
        vDom2 = "allele-targetMatch-visible-simpleDom2",
        hDom2 = "allele-targetMatch-hidden-simpleDom2",
        hint = "Guide-hint-received",
        act;
    for (var i = 0, myRow; myRow = rowObjs[i]; i++) {
        act = myRow.activity;
        if ((act == vDom) || (act == vDom2) || (act == hDom) || (act == hDom2)) {
            if (myRow.event == hint) {
                actionsWithHints.push(myRow);
                if (!studentsWithHints.includes(myRow.username)) {
                    studentsWithHints.push(myRow.username);
                }
            }
        }
    }
    return [actionsWithHints, studentsWithHints];
}
//For all students, searches the simple dom activities for "hint" events. Sets the "hasHints" property of student and activity to be the count of number of hint events.
function setHints() {
    myRow,
    myStudent,
    myActivity,
    myEvent,
    myAction;
    for (var j = 0; j < students.length; j++) {
        myStudent = students[j];
        for (var jj = 0; jj < myStudent.activities.length; jj++) {
            myActivity = myStudent.activities[jj];
            if (myActivity.name.match("targetMatch")) {
                for (var k = 0; myActivity.events.length; k++) {
                    myEvent = myActivity.events[k];
                    if ((myEvent) && (myEvent.id == "Guide-hint-received")) {
                        myStudent.hints++;
                        myActivity.hints++;
                    }
                }
            }
        }
    }
}

function getStudentsWithHints() {
    actionsPara.innerHTML = "Students with hints";
    for (var i = 0; i < students.length; i++) {
        if (students[i].hintReceived) {
            actionsPara.innerHTML += students[i].id + ", " +
                students[i].hints + "<br>";
        }
    }
}

function findAlleleDifferences(str1, str2) {
    var arr1 = str1.split(","),
        arr2 = str2.split(","),
        allelePairs1 = [],
        allelePairs2 = [],
        targetAlleles = [],
        initialAlleles = [];
    for (var i = 0; i < 18; i = i + 2) {
        allelePairs1.push(" ".concat(arr1[i], " ", arr1[i + 1]));
        allelePairs2.push(" ".concat(arr2[i], " ", arr2[i + 1]));
    }
    for (var j = 0; j < allelePairs1.length; j++) {
        if (allelePairs1[j] != allelePairs2[j]) {
            targetAlleles.push(allelePairs1[j]);
            initialAlleles.push(allelePairs2[j]);
        }
    }
    return [targetAlleles, initialAlleles];
}

function getSex(str) {
    var pos = str.search("sex");
    if (str.charAt(pos + 6) == "0") {
        return "female";
    } else {
        return "male"
    }
}

function addDescription(myRow, myActivity, myEvent) {
    var simpleDomActivities = ["allele-targetMatch-visible-simpleDom",
            "allele-targetMatch-hidden-simpleDom",
            "allele-targetMatch-visible-simpleDom2",
            "allele-targetMatch-hidden-simpleDom2"
        ],
        data,
        target,
        initial,
        conceptId,
        moveStr,
        probabilityLearned;
    if (simpleDomActivities.includes(myActivity.name)) {
        switch (myEvent.id) {
            case "Navigated":
                describeNavigated();
                break;
            case "Sex-changed":
                describeSexChanged();
                break;
            case "Guide-hint-received":
                describeGuideHintReceived();
                break;
            case "ITS-Data-Updated":
                describeITSDataUpdated();
                break;
            case "Allele-changed":
                describeAlleleChanged();
                break;
            case "Guide-alert-received":
                describeGuideAlertReceived();
                break;
            case "Drake-submitted":
                describeDrakeSubmitted();
                break;
        }

        function describeNavigated() {
            if (simpleDomActivities.includes(myActivity.name)) {
                target = myRow.parameters.targetDrake;
                initial = myRow.parameters.initialDrake;
                var targetGenotype = target.slice(target.indexOf("alleleString") + 16, target.length - 12);
                var initialGenotype = initial.slice(initial.indexOf("alleleString") + 16, initial.length - 12);
                var alleleDiffs = findAlleleDifferences(targetGenotype, initialGenotype);
                var targetDiffs = alleleDiffs[0];
                var initialDiffs = alleleDiffs[1];
                var targetSex = getSex(target);
                var initialSex = getSex(initial);
                if (myRow.parameters.goalMoves == 1) {
                    moveStr = " move ";
                } else {
                    moveStr = " moves ";
                }
                myRow.description = "Target alleles: " + targetDiffs + ", target drake is " + targetSex + ".<br>Initial alleles: " + initialDiffs + ", initial drake is " + initialSex + ".<br>" + myRow.parameters.goalMoves + moveStr + "required.<br>";
                myActivity.targetDiffs = targetDiffs;
                myActivity.targetGenotype = targetGenotype;
                myActivity.targetSex = targetSex;
                myActivity.currentDiffs = initialDiffs;
                myActivity.currentGenotype = initialGenotype;
                myActivity.currentSex = initialSex;
                myActivity.moveCount = 0;
                myActivity.requiredMoves = myRow.parameters.goalMoves;
            }
        }

        function describeSexChanged() {
            if (simpleDomActivities.includes(myActivity.name)) {
                myActivity.moveCount++;
                if (myActivity.moveCount == 1) {
                    moveStr = " move ";
                } else {
                    moveStr = " moves ";
                }
                if (myRow.parameters.newSex == "0") {
                    myActivity.currentSex = "female";
                    myRow.description = "Changed from male to female. Target sex is " + myActivity.targetSex + ".";
                    if (myActivity.targetSex == "female") {
                        myRow.description += "<br>Change is good.<br>";
                    } else {
                        var diffDescription = getPhenoDiffs(myActivity.targetGenotype, myActivity.currentGenotype);
                        diffDescription += getSexDiffs(myActivity.targetSex, myActivity.currentSex);
                        myRow.description = "Submitted a drake after " + myActivity.moveCount + moveStr + "<br>" + diffDescription;
                    }
                }
            }
        }

        function describeGuideHintReceived() {
            var data = myRow.parameters.data;
            myRow.hintLevel = data.match(/"hintLevel"[=|>|"]+([^"^,]+)/)[1];
            myRow.attribute = data.match(/"attribute"[=|>|"]+([^"^,]+)/)[1];
            myRow.conceptId = data.match(/("conceptId")([^a-zA-z]+)([^"]+)/)[3]
            var rawScore = data.match(/("conceptScore")([^\d]+)([\d.]+)/)[3];
            myRow.score = Math.round((parseFloat(rawScore) * 1000)) / 1000;
            myRow.description = "Level " + myRow.hintLevel + " hint for " + myRow.attribute + " trait, concept ID = " + myRow.conceptId + ", probability learned = " + myRow.score + "<br>";
        }

        function describeITSDataUpdated() {
            var conceptIds = [],
                currentProbs = [],
                prevProbs = [],
                initProbs = [],
                attemptStr,
                attempts = [],
                probs = [];
            myRow.description = "";
            data = myRow.parameters.studentModel;
            //Get array of concept IDs from data
            conceptIds = data.match(/(?<="conceptId"=>")([^"]+)/g);
            //Get array of current probabilities learned from data
            currentProbs = data.match(/(?<="probabilityLearned"=>)([^,]+)/g);
            //Get array of initial probabilities learned from data
            initProbs = data.match(/(?<="L0"=>)([^,]+)/g);
            attempts = data.match(/(?<="totalAttempts"=>)([^,]+)/g)
            for (var i = 0; i < currentProbs.length; i++) {
                myProb = new prob;
                myProb.action = myRow;
                myProb.id = conceptIds[i];
                myProb.prob = Math.round(1000 * parseFloat(currentProbs[i])) / 1000;
                myProb.attempts = attempts[i];
                probs.push(myProb);
            }
            //Set description
            for (var j = 0; j < probs.length; j++) {
                (probs[j].attempts > 1 ? attemptStr = " attempts." : attemptStr = " attempt.")
                myRow.description += "Concept " + probs[j].id + " probability learned = " + probs[j].prob + ", " + probs[j].attempts + attemptStr + "<br>";
            }
        }

        function describeAlleleChanged() {
            if (simpleDomActivities.includes(myActivity.name)) {
                if (isNaN(myActivity.moveCount)) {
                    console.log("Move count is not a number");
                }
                myActivity.moveCount++;
                var myChromosome = myRow.parameters.chromosome,
                    mySide = myRow.parameters.side,
                    newAllele = myRow.parameters.newAllele,
                    oldAllele = myRow.parameters.previousAllele,
                    targetAlleles = myActivity.targetDiffs,
                    currentAlleles = myActivity.currentDiffs;
                myEvent.score = scoreAlleleChange(newAllele, myActivity.currentGenotype, myActivity.targetGenotype);
                updateCurrentAlleles(myActivity, oldAllele, newAllele, mySide);
                myRow.description = "Changed allele " + oldAllele + " to " + newAllele + " on chromosome " + myChromosome + " side " + mySide + "<br>Alleles to be targeted are: " + targetAlleles + ". Score = " + myEvent.score + ".<br>";
            }
        }

        function describeDrakeSubmitted() {
            var moveStr;
            (myActivity.moveCount == 1 ? moveStr = " move. " : moveStr = " moves. ");
            if (myRow.parameters.correct == "true") {
                myRow.description = "Submitted the correct drake after " + myActivity.moveCount + moveStr + "The minimum was " + myActivity.requiredMoves + "<br>";
            } else {
                var diffDescription = getPhenoDiffs(myActivity.targetGenotype, myActivity.currentGenotype);
                diffDescription += getSexDiffs(myActivity.targetSex, myActivity.currentSex);
                myRow.description = "Submitted a drake after " + myActivity.moveCount + moveStr + "<br>" + diffDescription;
            }
        }

        function describeGuideAlertReceived() {
            data = myRow.parameters.data;
            msg = "";
            if (data.match(/(message)([^A-Za-z]+)([^"]+)/)) {
                var msg = data.match(/(message)([^A-Za-z]+)([^"]+)/)[3];
            }
            myRow.description = msg + "<br>";
        }
    }
}

function updateCurrentAlleles(myActivity, oldAllele, newAllele, side) { //Alters the currentGenotype field in the activity to reflect the new allele
    var oldGenotype = myActivity.currentGenotype,
        oldDiffs = myActivity.currentDiffs,
        newDiffs = [],
        newGenotype = [];
    if (!oldGenotype) {
        console.log("Something wrong in updateCurrentAlleles!")
    }
    newGenotype = oldGenotype.replace((side + ":" + oldAllele), (side + ":" + newAllele));
    for (var i = 0; i < oldDiffs.length; i++) {
        newDiffs[i] = oldDiffs[i].replace((side + ":" + oldAllele), (side + ":" + newAllele));
    }
    myActivity.currentGenotype = newGenotype;
    myActivity.currentDiffs = newDiffs;
}

function getTrait(allele) { //returns the trait (e.g., wings) from an allele 
    switch (allele.toLowerCase()) {
        case "w":
            return "wings";
            break;
        case "hl":
            return "hindlimbs";
            break;
        case "fl":
            return "forelimbs";
        case "t":
            return "tail";
        case "m":
            return "metallic";
        case "h":
            return "horns";
        case "c":
            return "color";
        case "b":
            return "black";
        case "d":
            return "dilute";
        case "a1":
            return "armor";
    }
}

function getAlleleLetters(trait) { //returns the lower and upper case letters for the trait
    var alleleLetters = [];
    switch (trait) {
        case "wings":
            alleleLetters = ["w", "W"];
            break;
        case "forelimbs":
            alleleLetters = ["fl", "Fl"];
            break;
        case "hindlimbs":
            alleleLetters = ["hl", "Hl"];
            break;
        case "tail":
            alleleLetters = ["t", "T"];
            break;
        case "metallic":
            alleleLetters = ["m", "M"];
            break;
        case "horns":
            alleleLetters = ["h", "H"];
            break;
        case "color":
            alleleLetters = ["c", "C"];
            break;
        case "black":
            alleleLetters = ["b", "B"];
            break;
        case "dilute":
            alleleLetters = ["d", "D"];
            break;
        case "armor":
            return ["a", "A1"];
            break;
    }
    return alleleLetters;
}

function getPheno(genoStr, trait) { //returns the pheno ("D", "H", or "R") from the genotype for the trait.
    try {

        var alleleLetters = getAlleleLetters(trait);
        if ((genoStr.search("a:" + alleleLetters[0] + ",b:" + alleleLetters[0])) != -1) {
            return "R";
        };
        if ((genoStr.search("a:" + alleleLetters[0] + ",b:" + alleleLetters[1])) != -1) {
            return "H";
        };
        if ((genoStr.search("a:" + alleleLetters[1] + ",b:" + alleleLetters[0])) != -1) {
            return "H";
        };
        if ((genoStr.search("a:" + alleleLetters[1] + ",b:" + alleleLetters[1])) != -1) {
            return "D";
        };
    } catch {
        console.log(err);
    }
}

function getPhenoDiffs(targetGeno, submittedGeno) { //Returns a description of the differences, if any, between the phenotypes between two genotypes.
    var diffDescription = "";
    if ((getPheno(targetGeno, "wings") == "R") && (getPheno(submittedGeno, "wings") != "R")) {
        diffDescription += "The submitted drake has wings, the target drake does not.<br>";
    } else if ((getPheno(targetGeno, "wings") != "R") && (getPheno(submittedGeno, "wings") == "R")) {
        diffDescription += "The target drake has wings, the submitted drake does not.<br>"
    }
    if ((getPheno(targetGeno, "forelimbs") == "R") && (getPheno(submittedGeno, "forelimbs") != "R")) {
        diffDescription += "The submitted drake has forelimbs, the target drake does not.<br>";
    } else if ((getPheno(targetGeno, "forelimbs") != "R") && (getPheno(submittedGeno, "forelimbs") == "R")) {
        diffDescription += "The target drake has forelimbs, the submitted drake does not.<br>"
    }
    if ((getPheno(targetGeno, "hindlimbs") == "R") && (getPheno(submittedGeno, "hindlimbs") != "R")) {
        diffDescription += "The submitted drake has hindlimbs, the target drake does not.<br>";
    } else if ((getPheno(targetGeno, "hindlimbs") != "R") && (getPheno(submittedGeno, "hindlimbs") == "R")) {
        diffDescription += "The target drake has hindlimbs, the submitted drake does not.<br>"
    }
    return diffDescription;
}

function getSexDiffs(targetSex, currentSex) {
    if (targetSex == currentSex) {
        return "";
    } else {
        return "The target drake is " + targetSex + ", the submitted drake is " + currentSex + ".<br>"
    }
}

function scoreAlleleChange(newAllele, currentGenotype, targetGenotype) { //returns "good", "bad", or "redundant" from the new allele, the current genotype and the target genotype. To be run BEFORE currentGenotype has been updated.
    try {
        var trait = getTrait(newAllele),
            alleleLetters = getAlleleLetters(trait),
            currentPheno = getPheno(currentGenotype, trait),
            targetPheno = getPheno(targetGenotype, trait);
        if (newAllele == alleleLetters[0]) { //Change is to a recessive allele
            if (targetPheno == "R") { //If the target drake is recessive; any change to a recessive allele is good.
                return "good";
            } else { //If the target drake is dominant a change to a recessive allele is redundant if the current drake is dominant and bad if it is heterozygous.
                if (currentPheno == "D") {
                    return "redundant";
                } else if (currentPheno == "H") {
                    return "bad";
                }
            }
        } else { // Change is to a dominant allele
            if (targetPheno == "R") { //If the target drake is recessive any change to a dominant allele is bad.
                return "bad";
            } else if (currentPheno == "R") { //If the target drake is dominant and the current drake is recessive a change to a dominant allele is good
                return "good";
            } else if (currentPheno == "H") { //If the target drake is dominant and the current drake is heterozygous a change to a dominant allele is redundant.
                return "redundant";
            }
        }
    } catch {
        console.log("Couldn't score allele change");
    }
}

function getIntersecting(array) //Array is an array of arrays. Return the intersection of the items in the second index
{
    var students =
        myFromElement,
        intersectingIds = [];
    for (var i = 0; i < fromArray.length; i++) {
        ids[i] = [];
        myFromElement = fromArray[i];
        for (var j = 0; j < myFromElement[field].length; j++) {
            ids[i].push(myFromElement[field][j]);
        }
        ids[i].sort(function (a, b) {
            var x = a.toLowerCase();
            var y = b.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        })
    }
    //ids[i] is an array of all the <field>
    //elements of fromArray[i], sorted alphabetically.
    //We now iterate over all the elements of fromArray to 
    //find the intersection of the <field> strings.

    intersectingIds = ids[0]; //Start with the first element and iteratively compare to all the others in names
    for (var s = 1; s < fromArray.length; s++) { //start with the second element
        intersectingIds = intersection(intersectingIds, ids[s]);
    }
    return intersectingIds;
}

function getIntersectingObjects(fromArray, field, names) { //Returns an array of arrays: for each selected element of fromArray, all the <field>s whose name is in the names array
    var myFromElement,
        myComponent,
        returnArray = [];
    for (var i = 0; i < fromArray.length; i++) {
        myFromElement = fromArray[i];
        returnArray[i] = [];
        for (var j = 0; j < myFromElement[field].length; j++) {
            myComponent = getComponentById(myFromElement[field], "name", names[j]);
            if (myComponent) {
                returnArray[i].push(myComponent);
            }
        }
    }
    return returnArray;
}

function intersection(array1, array2) {
    //Returns all elements of array 1 that are also in array 2.
    var n1 = 0,
        n2 = 0,
        returnArray = [],
        searchElement,
        compareElement;
    while ((n1 < array1.length) && (n2 < array2.length)) {
        compareElement = array1[n1];
        searchElement = array2[n2];

        //If the search element is smaller than the compare element then (because the arrays are sorted) the search  element is not matched. The compare element remains and we move on to another search element. n2 is incremented.

        if (searchElement < compareElement) {
            n2++;

            //If the search element is bigger than the compare element then (because the arrays are sorted) the compare element is not matched. The search element becomes the new compare element. n1 is incremented.

        } else if (searchElement > compareElement) {
            n1++;

            //If the search element is the same as the compare element then the compare element is matched. It goes into the return array and n1 and n2 are both incremented
        } else {
            returnArray.push(compareElement);
            n1++;
            n2++;
        }
    }
    return returnArray;
}