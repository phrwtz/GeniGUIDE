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
            acts.sort(function (a, b) {
                return a.index - b.index;
            });
            for (var k = 0; k < acts.length; k++) {
                myAction = acts[k];
                description = describe(myAction);
                actionsPara.innerHTML += ("<br><b>Action " + myAction.index + ", " + myActivity.name + ", " + myAction.event + " at " + myAction.time + "</b><br>" + description);
            }
        }
    }
}

function describe(action) {
    var myFields = Object.keys(action),
        data,
        conceptId,
        score,
        trait,
        message,
        tab4 = "&#9;",
        description = "";
    if (action.event === "Guide hint received") {
        data = action.parameters.data;
        conceptId = data.match(/(?<="conceptId"=>")([^"]+)/g)[0];
        score = Math.round(1000 * parseFloat(data.match(/(?<="conceptScore"=>)([\d|.]+)/g)[0])) / 1000;
        trait = data.match(/(?<="attribute"=>")([^"]+)/g)[0];
        message = data.match(/(?<="hintDialog"=>")([^"]+)/g)[0];
        level = parseInt(data.match(/(?<="hintLevel"=>)([\d])/g)[0]);
        description = "<pre>" + tab4 + "<b>Level " + level + "</b> hint received for <b>" + trait + ".<br>" + tab4 + "Message = </b>" + message + "<br>" + tab4 + "<b>Concept = </b>" + conceptId + ", <b>probability learned =</b> " + score + ".</pre>";
    } else if (action.event === "Allele changed") {
        chromosome = action.parameters.chromosome;
        side = action.parameters.side;
        previousAllele = action.parameters.previousAllele;
        newAllele = action.parameters.newAllele;
        description = "Old allele = <b>" + previousAllele + "</b>, new Allele = <b>" + newAllele + "</b>.<br>";
    } else if (action.event === "Navigated") {
        level = parseInt(action.parameters.level) + 1;
        mission = parseInt(action.parameters.mission) + 1;
        targetGenotype = action.parameters.targetDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
        initialGenotype = action.parameters.initialDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
        targetSexInteger = action.parameters.targetDrake.match(/(?<="sex"=>)([\d])/)[1];
        initialSexInteger = action.parameters.initialDrake.match(/(?<="sex"=>)([\d])/)[1];
        (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
        (initialSexInteger == "1" ? initialSex = "female" : initialSex = "male");
        description = "Level " + level + ", mission " + mission + ".<br>Target genotype = " + targetGenotype + "<br>Initial genotype = "+ initialGenotype + "<br>Target sex = " + targetSex + ", initial sex = " + initialSex + ".<br>";
    }
    return description.fontsize(4);
}