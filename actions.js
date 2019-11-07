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
            description = describe(myAction);
            actionsPara.innerHTML += ("<br><b>Action " + myAction.index + ", " + myAction.event + " at " + myAction.time + "</b><br>" + "Challenge is " + myAction.activity + "<br>" + description + "<br>");
        }
    }
}

function describe(action) {
    var myFields = Object.keys(action),
        data,
        conceptId,
        score,
        trait,
        practice,
        message,
        tab4 = "&#9;",
        description = "",
        targetGenotype,
        initialGenotype,
        initialSex,
        targetSex,
        initialSexInteger,
        targetSexInteger,
        targetPhenotype,
        tg,
        ig;
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
        description = "Old allele = <b>" + previousAllele + "</b>, new Allele = <b>" + newAllele + "</b>, side = " + side + ".<br>";
    } else if (action.event === "Navigated") {
        level = parseInt(action.parameters.level) + 1;
        minimumMoves = parseInt(action.parameters.goalMoves);
        mission = parseInt(action.parameters.mission) + 1;
        targetGenotype = action.parameters.targetDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
        initialGenotype = action.parameters.initialDrake.match(/(?<="alleleString"=>")([^\s]+)/)[1];
        //Get rid of that pesky comma and quotation mark at the end
        tg = targetGenotype.slice(0, targetGenotype.length - 2);
        ig = initialGenotype.slice(0, initialGenotype.length - 2);
        targetSexInteger = action.parameters.targetDrake.match(/(?<="sex"=>)([\d])/)[1];
        initialSexInteger = action.parameters.initialDrake.match(/(?<="sex"=>)([\d])/)[1];
        (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
        (initialSexInteger == "1" ? initialSex = "female" : initialSex = "male");
        description = "Level " + level + " mission " + mission + ".<br>Target genotype = " + tg + "<br>Initial genotype = " + ig + "<br>Target sex = " + targetSex + ", initial sex = " + initialSex + ".<br>" + "Minimum moves = " + minimumMoves + ".<br>";
    } else if (action.event === "Drake submitted") {
        target = action.parameters.target;
        selected = action.parameters.selected;
        targetSexInteger = target.match(/(?<="sex"=>)([\d])/)[1];
        (targetSexInteger == "1" ? targetSex = "female" : targetSex = "male");
        selectedSexInteger = selected.match(/(?<="sex"=>)([\d])/)[1];
        (selectedSexInteger == "1" ? selectedSex = "female" : selectedSex = "male");
        targetPhenotype = target.match(/(?<="phenotype"=>{")([^}]+)/)[1];
        selectedGenotype = selected.match(/(?<="alleles"=>")([^\s]+)/)[1];
        sg = selectedGenotype.slice(0, selectedGenotype.length - 2);
        correct = action.parameters.correct;
        (correct == "true" ? correctStr = "<b>good</b>" : correctStr = "<b>bad</b>")
        description = "Target phenotype = " + targetPhenotype + "<br>Selected genotype = " + sg + "<br>Target sex = " + targetSex + ", selected sex = " + selectedSex + ". Submission is " + correctStr + ".<br>";
    } else if (action.event === "Sex changed") {
        (action.parameters.newSex == "1" ? description = "Changed sex from male to female." : description = "Changed sex from female to male.")
    } else if (action.event === "ITS Data Updated") {
        description = action.parameters.studentModel;
    } else if (action.event === "Guide remediation requested") {
        trait = action.parameters.attribute;
        practice = action.parameters.practiceCriteria;
        description = practice + " remediation has been called for on trait " + trait + ".<br>";
    }
    return description;
}