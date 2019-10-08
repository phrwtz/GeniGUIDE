function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
    var unionEventNames = [],
        unionEventIds = [],
        unionEvents = [],
        eventColor,
        styledEventName,
        eventNamesByActivity = [],
        myStudent,
        counts = [];
    setSelectedObjects();
    if (selectedActivities.length == 0) {
        eventsPara.innerHTML = "";
        actionsPara.innerHTML = "";
    } else {
        myStudent = selectedStudents[0]; //There is only one so we don't have to iterate.
        for (var i = 0; i < selectedActivities.length; i++) {
            myActivity = selectedActivities[i];
            eventNamesByActivity[i] = myActivity.eventNames;
            eventNamesByActivity[i].sort(function (a, b) {
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
        unionEventNames = eventNamesByActivity[0]; //Start with the first element and iteratively compare to all the others in names

        for (var j = 1; j < eventNamesByActivity.length; j++) { //start with the second element
            unionEventNames = union(unionEventNames, eventNamesByActivity[j]);
        }
        eventsPara.innerHTML = "<b>Events</b><br><br>";
        for (var k = 0; k < unionEventNames.length; k++) {
            myEventName = unionEventNames[k];
            if (myEventName === "Guide-hint-received") {
                eventColor = "red";
            } else if (myEventName === "Guide-remediation-requested") {
                eventColor = "blue";
            }
            else {
                eventColor = "black";
            }
            styledEventName = '<span style=\"color:' + eventColor + '\">' + myEventName + '</span>';
            counts[k] = 0;
            for (var l = 0; l < selectedActivities.length; l++) {
                myActivity = selectedActivities[l];
                if (myActivity.eventsByName[myEventName]) {
                    myActions = myActivity.eventsByName[myEventName].actions;
                    counts[k] += myActions.length;
                }
            }
            eventsPara.innerHTML += "<input type = 'checkbox' id = " + myEventName + " name = 'eventButton' onchange= 'showActions()'></input> " + styledEventName + " (" + counts[k] + ")<br>";
        }
    }
}