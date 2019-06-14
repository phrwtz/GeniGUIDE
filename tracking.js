function trackStudents() {
    var myAction,
        myStudent;
    for (var i = 0; i < students.length; i++) {
        myStudent = students[i];
        if (myStudent.probs.length > 1) {
            for (var j = 1; j < myStudent.probs.length; j++) {
                oldProbs = myStudent.probs[j - 1];
                newProbs = myStudent.probs[j];
                compareProbs(oldProbs, newProbs)
            }
            //          console.log("Student " + myStudent.id + " has " + myStudent.probs.length + " probs.");
        }
    }
    trackProb();
}

function compareProbs(oldProbs, newProbs) {
    /*
    Compares two prob arrays and sets the "changed" property to true for each prob in the second array that has a different probability learned value from the prob with the same concept id in the first array.
    */
    var probChanged = false;
    if (oldProbs && newProbs) {
        for (var i = 0; i < oldProbs.length; i++) {
            for (var j = 0; j < newProbs.length; j++) {
                if (oldProbs[i].id == newProbs[j].id) {
                    if (oldProbs[i].prob != newProbs[j].prob) {
                        newProbs[j].changed = true;
                        probChanged = true;
                    } else {
                        newProbs[j].changed = false;
                    }
                }
            }
        }
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