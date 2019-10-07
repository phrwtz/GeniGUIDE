function showActivities() { //Sets up the activites checkboxes, which are labeled with the names the activities engaged by the selected student. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
    var tableButton = document.getElementById("tableButton"),
        csvDiv = document.getElementById("csvDiv"),
        probTable = document.getElementById("probTable");
    var activityNames = [],
        activityIds = [],
        activities = [],
        styledActivityName,
        color,
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
        activitiesPara.innerHTML = "<b>Activities</b><br><br>";
        activitiesPara.innerHTML += "<input type='checkbox'  name='activityButton' onchange='toggleSelectAll(\"" + 'activityButton' + "\");'></input> all/none<br>";
        for (var i = 0; i < selectedStudents.length; i++) {
            myStudent = selectedStudents[i];
            activities = myStudent.activitiesObj;
            activityNames = myStudent.activityNames;
            activityIds = myStudent.activityIds;
            for (var j = 0; j < activityNames.length; j++) {
                color = "black";
                myActivity = myStudent.activitiesObj[myStudent.activityIds[j]];
                if (myActivity.hintReceived) {
                    if (myActivity.remediationRequested) {
                        color = "#990099";
                    } else {
                        color = "red";
                    }
                } else if (myActivity.remediationRequested) {
                    color = "blue";
                }
                styledActivityName = '<span style=\"color:' + color + '\">' + activityNames[j] + '</span>';
                count = myActivity.eventNames.length;
                activitiesPara.innerHTML += "<input type ='checkbox' id=" + activityIds[j] + " name='activityButton' + onchange='showEvents()'> </input > " + styledActivityName + " (" + count + ")<br>";
                showEvents();
            }
        }
    }
}