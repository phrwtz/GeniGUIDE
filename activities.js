function showActivities() { //Sets up the activites checkboxes, which are labeled with the names of the intersection of the activities engaged by all the selected students. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
var tableButton = document.getElementById("tableButton"),
    csvDiv = document.getElementById("csvDiv"),
    probTable = document.getElementById("probTable");
var intersectingActivityNames = [],
    intersectingActivityIds = [],
    intersectingActivities = [],
    activityNamesByStudent = [],
    counts = [];
setSelectedObjects();
if (selectedConcepts.length == 0) {
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
    actionsPara.innerHTML = "";
    csvDiv.style.display = "none";
    probTable.style.display = "none";
    graphDiv.innerHTML = "";
} else {
    csvDiv.style.display = "inline";
    //Run over the activities fields for those students and collect the intersection of the names of those activities
    for (var i = 0; i < selectedStudents.length; i++) {
        myStudent = selectedStudents[i];
        activityNamesByStudent[i] = myStudent.activityNames;
        activityNamesByStudent[i].sort(function (a, b) {
            var x = a.toLowerCase();
            var y = b.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
    }
    intersectingActivityNames = activityNamesByStudent[0]; //Start with the first element and iteratively compare to all the others in names

    for (var j = 1; j < activityNamesByStudent.length; j++) { //start with the second element
        intersectingActivityNames = intersection(intersectingActivityNames, activityNamesByStudent[j]);
    }
    for (var k = 0; k < intersectingActivityNames.length; k++) {
        intersectingActivities[k] = myStudent.activitiesByName[intersectingActivityNames[k]];
    }
    //Sort activities by increasing start time;
    intersectingActivities.sort(function (a, b) {
        return a.startTime - b.startTime;
    });
    //And set up the activityIds array
    for (var l = 0; l < intersectingActivities.length; l++) {
        intersectingActivityIds.push(intersectingActivities[l].id);
        counts[l] = intersectingActivities[l].eventNames.length;
    }

    makeButtons(intersectingActivities, intersectingActivityIds, counts, "checkbox", "name", "activityButton", "showEvents()", "Activities", activitiesPara);
    if (selectedConceptName) {
        
    }
    makeGraph(selectedConcepts);
    showEvents();
}
}