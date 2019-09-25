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
            myReversals = myConcept.reversals;
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

function countReversals(values) {
    var tolerance = .1 //Values that differ by plus or minus this number will be counted as equal.
    var newIncreasing,
        oldIncreasing = (values[1] - values[0] > tolerance);
    count = 0;
    if (values.length > 5) {
        for (var i = 2; i < values.length; i++) {
            if (values[i] - values[i - 1] > tolerance) {
                newIncreasing = true;
                if (newIncreasing != oldIncreasing) {
                    count++;
                    console.log("Reversal found. Values(" + (i - 1) + ") = " + values[i - 1]);
                }
                oldIncreasing = newIncreasing;
            } else if (values[i - 1] - values[i] > tolerance) {
                newIncreasing = false;
                if (newIncreasing != oldIncreasing) {
                    count++;
                    console.log("Reversal found. Values(" + (i - 1) + ") = " + values[i - 1]);
                }
                oldIncreasing = newIncreasing;
            } else {
                newIncreasing = oldIncreasing;
            }
        }
    }
    return count;
}

function showReversals() {
    var revsDiv = document.getElementById("reversalsDiv");
    var revsTable = document.getElementById("revsTable");
    var revsTableBody = document.getElementById("revsTableBody");
    var revsSpan = document.getElementById("revsSpan");
    var myConceptName,
        myStudent,
        myConcept,
        myReversals;
    clear(revsTableBody);
    if (revsSpan.innerText == "Show reversals table") {
        revsSpan.innerText = "Hide reversals table";
        revsTable.style.display = "block";
        for (var i = 0; i < students.length; i++) {
            myStudent = students[i];
            if (myStudent.conceptNames) {
                for (var j = 0; j < myStudent.conceptNames.length; j++) {
                    myConceptName = myStudent.conceptNames[j];
                    myConcept = myStudent.concepts[myConceptName];
                    myReversals = myConcept.reversals;
                    revRow = document.createElement("tr");
                    revsTableBody.appendChild(revRow);
                    studentCell = document.createElement("td");
                    conceptCell = document.createElement("td");
                    reversalsCell = document.createElement("td");
                    revsTableBody.appendChild(studentCell);
                    revsTableBody.appendChild(conceptCell);
                    revsTableBody.appendChild(reversalsCell);
                    studentCell.innerHTML = myStudent.id;
                    conceptCell.innerHTML = myConceptName;
                    reversalsCell.innerHTML = myReversals;
                }
            } else {
                console.log("Student " + myStudent.id + " has no concept names!")
            }
        }
    } else {
        revsSpan.innerText = "Show reversals table";
        revsTable.style.display = "none";

    }
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