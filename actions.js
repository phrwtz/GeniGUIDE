//This assumes that only one student is selected, though multiple activities may be.

function showActions() {
    var acts = [],
        myEvent,
        actionNamesByActivity = [],
        unionActionNames = [],
        acts = [],
        description;

    setSelectedObjects();
    if (selectedEvents.length == 0) {
        actionsPara.innerHTML = "";
    } else {
        actionsPara.innerHTML = "<b>Actions</b><br>";
        for (var i = 0; i < selectedEvents.length; i++) {
            //The selected events are only from one of the selected activities. We need to get the name of each one and use it to get the events of all the selected activities in order to show the actions of all of them.
            selectedEventName = selectedEvents[i].name;
            for (var j = 0; j < selectedActivities.length; j++) {
                myActivity = selectedActivities[j];
                if (myActivity.eventsByName[selectedEventName]) {
                    for (var jj = 0; jj < myActivity.eventsByName[selectedEventName].actions.length; jj++) {
                        acts.push(myActivity.eventsByName[selectedEventName].actions[jj]);
                    }
                }
            }
        }
        acts.sort(function (a, b) {
            return a.index - b.index;
        });
        for (var k = 0; k < acts.length; k++) {
            myAction = acts[k];
            if (targetMatchArray.includes(myAction.activity)) {
   //             updateTargetMatchMoves(myAction);
                description = describeTargetMatch(myAction);
            } else if (eggDropArray.includes(myAction.activity)) {
                description = describeEggDropAction(myAction);
            }  else if (gameteArray.includes(myAction.activity)) {
                description = describeGameteAction(myAction);
            }  else if (clutchArray.includes(myAction.activity)) {
                description = describeClutchAction(myAction);
            } else {
                description = "";
            }
            actionsPara.innerHTML += ("<br><b>Action " + myAction.index + ", " + myAction.event + " at " + myAction.time + "</b><br>" + "Challenge is " + myAction.activity + "<br>" + description + "<br>");
        }
    }
}
