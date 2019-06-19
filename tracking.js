function trackStudents() {
    var myAction,
        myStudent;
    for (var i = 0; i < students.length; i++) {
        myStudent = students[i];
        if (myStudent.probs.length > 1) {
            for (var j = 1; j < myStudent.probs.length; j++) {
                oldProbs = myStudent.probs[j - 1];
                newProbs = myStudent.probs[j];
                compareProbs(oldProbs, newProbs); //Sets the changed property to true for each prob in newProbs that has a changed probability from oldProbs
            }
        }
    }
    trackProb();
}

function compareProbs(oldProbs, newProbs) {
    /*
    Compares two prob arrays and sets the "changed" property to true for each prob in the second array that has a different probability learned value from the prob with the same concept id in the first array.
    */
    try {
        if (!oldProbs) {
            for (var k = 0; k < newProbs.length; k++) {
                newProbs[k].changed = true;
            }
        } else {
            for (var j = 0; j < newProbs.length; j++) {
                for (var i = 0; i < oldProbs.length; i++) {
                    if (newProbs[j].conceptId == oldProbs[i].conceptId) {
                        if (newProbs[j].prob == oldProbs[i].prob) {
                            newProbs[j].changed = false;
                        } else {
                            newProbs[j].changed = true;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log("Failed in compareProbs. Error = " + err);
    }
}

    function trackProb() {
        var probLearnedArray;
        var conceptId = "LG1.P2"
        for (var k = 0; k < students.length; k++) {
            var myStudent = students[k];
            probLearnedArray = [];
            if (myStudent.probs.length > 0) {
                for (var i = 0; i < myStudent.probs.length; i++) {
                    var myProb = myStudent.probs[i];
                    for (var j = 0; j < myProb.length; j++) {
                        if ((myProb[j].id == conceptId) && (myProb[j].changed)) {
                            probLearnedArray.push(myProb[j].prob);
                        }
                    }
                }
            }
            console.log("Probabilities for student " + myStudent.id + " for concept " + conceptId + ":");
            for (var kk = 0; kk < probLearnedArray.length; kk++) {
                console.log(probLearnedArray[kk]);
            }
        }
    }

    function findActionByStudent(classID, studentID, actionIndex) {
        for (var k = 0; k < classes.length; k++) {
            if (parseInt(classes[k].id) == classID) {
                var myClass = classes[k];
                for (var i = 0; i < myClass.students.length; i++) {
                    if (parseInt(students[i].id) == studentID) {
                        var myStudent = students[i];
                        var myAction = myStudent.actions[actionIndex];
                    }
                }
            }
        }
        return (myAction);
    }