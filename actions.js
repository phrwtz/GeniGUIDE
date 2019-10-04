//This assumes that only one student is selected, though multiple activities may be.

function showActions() {
    var acts = [],
        myEvent,
        myFields,
        myActions,
        myAction;

    setSelectedObjects();
    if (selectedEvents.length == 0) {
        actionsPara.innerHTML = "";
    } else {
        actionsPara.innerHTML = "<b>Actions</b><br>";
        acts = [];
        for (var i = 0; i < selectedEvents.length; i++) {
            myEvent = selectedEvents[i];
            for (var j = 0; j < myEvent.actions.length; j++) {
                acts.push(myEvent.actions[j]);
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
            actionsPara.innerHTML += ("<br><b>" + myAction.index + ": " + myAction.event + " at " + myAction.time + "</b><br>");
            //      if (myAction.description) {
            //        actionsPara.innerHTML += myAction.description;
            //  } else {
            for (var l = 0; l < myFields.length; l++) {
                myField = myFields[l];
                actionsPara.innerHTML += (myField + ":" + myParameters[myField] + "<br>");
            }
        }
    }
}