function showActivities() { //Sets up the activites checkboxes, which are labeled with the names the activities engaged by the selected student. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
    var tableButton = document.getElementById("tableButton"),
        csvDiv = document.getElementById("csvDiv"),
        probTable = document.getElementById("probTable");
    var activityNames = [],
        activityIds = [],
        activities = [],
        counts = [];
    setSelectedObjects();
    if (selectedStudents.length == 0) {
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
            activityNames = myStudent.activityNames;
            activityIds = myStudent.activityIds;
            makeButtons(activities, activityIds, counts, "checkbox", "name", "activityButton", "showEvents()", "Activities", activitiesPara);
            showEvents();
            if (selectedConceptName) {
                makeGraph(activityIds[0]);
            }
        }
    }
}