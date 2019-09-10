function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
var intersectingEventNames = [],
    intersectingEventIds = [],
    intersectingEvents = [],
    eventNamesByStudent = [],
    counts = [];
setSelectedObjects();
if (selectedActivities.length == 0) {
    eventsPara.innerHTML = "";
    actionsPara.innerHTML = "";
} else {
    for (var i = 0; i < selectedActivities.length; i++) {
        myActivity = selectedActivities[i];
        eventNamesByStudent[i] = myActivity.eventNames;
        eventNamesByStudent[i].sort(function (a, b) {
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
    intersectingEventNames = eventNamesByStudent[0]; //Start with the first element and iteratively compare to all the others in names
    for (var j = 1; j < eventNamesByStudent.length; j++) { //start with the second element
        intersectingEventNames = intersection(intersectingEventNames, eventNamesByStudent[j]);
    }
    for (var k = 0; k < intersectingEventNames.length; k++) {
        intersectingEvents[k] = myActivity.eventsByName[intersectingEventNames[k]];
        intersectingEventIds.push(intersectingEvents[k].id);
        counts.push(intersectingEvents[k].actions.length);
    }
    makeButtons(intersectingEvents, intersectingEventIds, counts, "checkbox", "name", "eventButton", "showActions()", "Events", eventsPara);
}
showActions();
}