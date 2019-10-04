function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
    var unionEventNames = [],
        unionEventIds = [],
        unionEvents = [],
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
        for (var k = 0; k < unionEventNames.length; k++) {
            myEventName = unionEventNames[k];
            unionEvents = [];
            counts[k] = 0;
            for (l = 0; l < selectedActivities.length; l++) {
                let myActivity = selectedActivities[l];
                if (myActivity.eventsByName[myEventName]) {
                    let myEvent = myActivity.eventsByName[myEventName];
                    unionEvents.push(myEvent);
                    unionEventIds.push(myEvent.id)
                    counts[k] += unionEvents[k].actions.length;
                }
            }
        }

        makeButtons(unionEvents, unionEventNames, counts, "checkbox", "name", "eventButton", "showActions()", "Events", eventsPara);
    }
    showActions();
}