function makeGraph() {
    setSelectedObjects();
    if ((selectedStudents.length > 0) && (selectedConceptName)) {
        var myStudent = selectedStudents[0];
        var studentId = myStudent.id;
        var myConcept = myStudent.concepts[selectedConceptName];
        var probObjs = [];
        var myPlot = document.getElementById("graphDiv");
        if (myConcept) {
            var myConceptName = myConcept.name;
            var myProbs = [],
                myValues = [],
                myReversals = [],
                myActivities = [],
                myIndices = [],
                myURLs = [];
            trace = new Object(),
                graphDiv.innerHTML = "";
            if (showAllProbs) {
                probObjs = myConcept.probObjs;
            } else {
                probObjs = myConcept.changedProbObjs;
            }
            for (var j = 0; j < probObjs.length; j++) {
                myProbs.push(probObjs[j]);
                myValues.push(probObjs[j].value);
                myAction = probObjs[j].action;
                myStudent = myAction.student;
                myIndex = myAction.index;
                myActivityName = myAction.activity;
                myActivity = myStudent.activitiesByName[myActivityName];
                myRoute = myActivity.route;
                myActivities.push("<b>" + myIndex + ": </b>" + myActivityName);
                myIndices.push(myIndex.toString());
                myURLs.push("http://geniventure.concord.org/#" + myRoute);
            }
            myReversals = countReversals(myValues);
            if (myReversals == 0) {
                revStr = '<span style="color:red">No reversals</span>';
            } else if (myReversals == 1) {
                revStr = '<span style="color:red">One reversal</span>';
            } else {
                revStr = '<span style="color:red">' + myReversals + ' reversals</span>';
            }
            var trace = {
                type: 'scatter',
                mode: 'lines+markers',
                x: myIndices,
                y: myValues,
                line: {
                    color: 'blue',
                    width: 3
                },
                hovertext: myActivities
            }
            var data = [trace];
            var layout = {
                autosize: false,
                width: 1500,
                height: 500,
                margin: {
                    l: 30,
                    r: 20,
                    b: 30,
                    t: 30,
                    pad: 4
                },
                xaxis: {
                    tickmode: 'array',
                    automargin: true
                },
                yaxis: {
                    showline: true,
                    linecolor: 'blue',
                    range: [0, 1.1]
                },
                title: ("Student = " + studentId + ", concept = " + myConcept.name + ": " + conceptDescription(myConcept.id) + "<br>" + revStr)
            }
            Plotly.newPlot("graphDiv", data, layout);
            myPlot.on('plotly_click', function (data) {
                myPointIndex = data.points[0].pointIndex;
                myURL = myURLs[myPointIndex];
                myName = myActivities[myPointIndex];
                var xIndex = data.points[0].x;
                var num = 6;
                //     window.open(myURL, "_blank");
                infoPara.innerHTML = '<a href=' + myURL + '/ target="_blank">' + myName + "<br>";
                for (var k = 0; k < num + 1; k++) {
                    myAction = myStudent.actions[xIndex - num + k];
                    var t = myAction.time.match(/(?<=T)([\d]+:[\d]+:[\d]+)/);
                    var myProbValue = -1;
                    //This is only used for debugging
                    for (var kk = 0; kk < myAction.probs.length; kk++) {
                        if (myAction.probs[kk].id == myConcept.name) {
                            myProbValue = myAction.probs[kk].value;
                        }
                    }
                    //... and not displayed
                    infoPara.innerHTML += myAction.index + ": " + t[0] + ", " + myAction.event + "<br>";
                }
            });
        } else {
            graphDiv.innerHTML = "";
        }
    }
}

//Count the number of times the graph reverses direction
/*
Note: this algorithm is too simple. It looks for significant differences between neighboring values in order to find extrema, but this means it won't count shallow but wide valleys or mountains. We need to be more clever, looking ahead and behind to see changes beyond the immediate neighborhood.
*/

function countReversals(values) {
    var tolerance = .1 //Values that differ by plus or minus this number will be counted as equal.
    var count = 0,
        before,
        now,
        after;
    if (values.length > 5) {
        for (var i = 1; i < values.length - 1; i++) {
            before = values[i - 1];
            now = values[i];
            after = values[i + 1];
            fifth = values[i + 2];
            if (!approxEqual(before, now, tolerance) && !approxEqual(now, after, tolerance)) {
                if (((before < now) && (now > after)) || ((before > now) && (now < after))) {
                    count++;
                    console.log("Reversal found at postion " + i + ", before = " + before + ", now  " + now + ", after = " + after);
                }
            }
        }
    }
    return count;
}

function approxEqual(value1, value2, tolerance) {
    return (Math.abs(value1 - value2) < tolerance);
}

function reportConceptData() {
    var ci = new Object();
    ci["LG1.A3"] = "Sex determination.<br>Females have two X chromosomes. Males have one X and one Y.";
    ci["LG1.C2a"] = "Simple dominance.<br>Only one dominant allele is needed to produce the dominant trait.";
    ci["LG1.C2b"] = "Recessive traits.<br>For most traits, the absence is recessive.";
    ci["LG1.C2c"] = "X linkage.<br>Males receive only one copy of the X chromosome and pass on their X chromosome only to their daughters.";
    ci["LG1.C2d"] = "Polyallelic.<br>Some traits are controled by multiple alleles that can form a ranked series in terms of dominance.";
    ci["LG1.C3"] = "Incomplete dominance.<br>For some traits both alleles will have some effect with neither being completely dominant.";
    ci["LG1.P1"] = "Genotype-to-phenotype mapping.<br>Given a genotype, predict the phenotype of an organism.";
    ci["LG1.P2"] = "Phenotype-to-genotype mapping.<br>Given a phenotype, determine the possible genotypes of an organism.";
    ci["LG1.C4a"] = "Epistasis.<br>A gene can mask the effect of other genes.";
    ci["LG2.P1"] = "Gamete selection.<br>Create or select parental gametes to create an individual offspring with a specific phenotype.";
    ci["LG3.P1"] = "Parent genotypes.<br>Set or select parental genotypes to produce a specific pattern of traits in offspring.";
    ci["LG3.P3"] = "Patterns in offspring.<br>Use patterns in the phenotypes of a group of offspring to predict the genotypes of the parents.";
    ci["LG3.P4"] = "Test cross.<br>Breed with a recessive organism to determine an unknown genotype.";
    ci["LG99.A"] = "Some allele changes don't affect phenotype.";
    return ci;
}

function conceptDescription(id) {
    var concept = conceptsObj[id];
    return conceptDescriptions[concept.name];
}