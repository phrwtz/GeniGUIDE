//This assumes that only one student is selected, though multiple activities may be.

function showActions() {
    var acts = [],
        myEvent,
        myFields,
        actionNamesByActivity = [],
        unionActionNames = [],
        acts = [];

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
            acts.sort(function (a, b) {
                return a.index - b.index;
            });
            for (var k = 0; k < acts.length; k++) {
                myAction = acts[k];
                myFields = [];
                if (myAction.parameters) {
                    myParameters = myAction.parameters;
                    myFields = Object.getOwnPropertyNames(myParameters);
                }
                actionsPara.innerHTML += ("<br><b>Action " + myAction.index + ", " + myActivity.name + ", " + myAction.event + " at " + myAction.time + "</b><br>");
                //      if (myAction.description) {
                //        actionsPara.innerHTML += myAction.description;
                //  } else {
                for (var l = 0; l < myFields.length; l++) {
                    myField = myFields[l];
                    actionsPara.innerHTML += myField + " = " + myAction.parameters[myField] + "<br>";
                }
            }
        }
    }
}