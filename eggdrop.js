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
