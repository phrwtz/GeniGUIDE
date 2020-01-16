function makeTwoCohortTargetMatchGraph(results1, results2) {
    var myDiv = document.getElementById("graphDiv");
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        shortName1,
        shortName2,
        myOption1 = chalFilter1.value,
        myOption2 = chalFilter2.value,
        result1,
        result2,
        data = [],
        layout = {};
    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Cohort 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Cohort 2";
    for (let i = 0; i < results1.length; i++) {
        result1 = results1[i];
        result2 = results2[i];
        result1Name = result1.name.split("-")[3];
        result2Name = result2.name.split("-")[3];
        result1Type = result1.name.split("-")[2];
        result2Type = result2.name.split("-")[2];
        averageHintScore1 = mean(result1.hintScores);
        averageHintScore2 = mean(result2.hintScores);
        shortName1 = result1Type + "-" + result1Name;
        shortName2 = result2Type + "-" + result2Name;
        trace1.x.push(shortName1);
        trace2.x.push(shortName2);
        trace1.y.push(averageHintScore1);
        trace2.y.push(averageHintScore2);
    }
    data = [trace1, trace2];
    layout = {
        barmode: 'group',
        title: 'Average hint scores per target-match challenge<br>' + myOption1 + ", " + myOption2,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeTwoCohortEggDropGraph(results1, results2) {
    var myDiv = document.getElementById("graphDiv");
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        result1,
        result2,
        myOption1 = chalFilter1.value,
        myOption2 = chalFilter2.value;
    data = [],
        layout = {};
    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Cohort 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Cohort 2";
    for (let i = 0; i < results1.length; i++) {
        result1 = results1[i];
        result2 = results2[i];
        result1Name = result1.name;
        result2Name = result2.name;
        result1Hints = result1.hints;
        result2Hints = result2.hints;
        trace1.x.push(result1Name);
        trace2.x.push(result2Name);
        trace1.y.push(result1.hints);
        trace2.y.push(result2.hints);
    }
    data = [trace1, trace2];
    layout = {
        barmode: 'group',
        title: 'Hints per egg-drop challenge per student<br>' + myOption1 + ", " + myOption2,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeTwoCohortGameteGraph(results1, results2) {
    var myDiv = document.getElementById("graphDiv");
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        result1, result2,
        hints1, hints2,
        nameArray1, nameArray2,
        shortName1, shortName2,
        myOption1 = chalFilter1.value,
        myOption2 = chalFilter2.value;
    data = [],
        layout = {};
    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Cohort 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Cohort 2";
    for (let i = 0; i < results1.length; i++) {
        result1 = results1[i];
        hints1 = result1.hintScoreMean;
        nameArray1 = result1.name.split("-");
        nameArray1.shift();
        shortName1 = nameArray1.join("-");
        result2 = results2[i];
        hints2 = result2.hintScoreMean;
        nameArray2 = result2.name.split("-");
        nameArray2.shift();
        shortName2 = nameArray2.join("-");
        trace1.x.push(shortName1);
        trace2.x.push(shortName2);
        trace1.y.push(hints1);
        trace2.y.push(hints2);
    }
    data = [trace1, trace2];
    layout = {
        barmode: 'group',
        title: 'Hints per gamete challenge per student<br>' + myOption1 + ", " + myOption2,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeTwoCohortClutchGraph(results1, results2) {
    var myDiv = document.getElementById("graphDiv");
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        result1, result2,
        hints1, hints2,
        nameArray1, nameArray2,
        shortName1, shortName2,
        myOption1 = chalFilter1.value,
        myOption2 = chalFilter2.value;
    data = [],
        layout = {};
    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Cohort 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Cohort 2";
    for (let i = 0; i < results1.length; i++) {
        result1 = results1[i];
        hints1 = result1.hintScoreMean;
        nameArray1 = result1.name.split("-");
        nameArray1.shift();
        shortName1 = nameArray1.join("-");
        result2 = results2[i];
        hints2 = result2.hintScoreMean;
        nameArray2 = result2.name.split("-");
        nameArray2.shift();
        shortName2 = nameArray2.join("-");
        trace1.x.push(shortName1);
        trace2.x.push(shortName2);
        trace1.y.push(hints1);
        trace2.y.push(hints2);
    }
    data = [trace1, trace2];
    layout = {
        barmode: 'group',
        title: 'Hints per clutch challenge per student<br>' + myOption1 + ", " + myOption2,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeSingleTargetMatchGraph(challengeResultsArray) {
    var myDiv = document.getElementById("graphDiv"),
        myOption1 = chalFilter1.value;
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        trace3 = new Trace(),
        challengeResult,
        challengeName,
        challengeType,
        shortName,
        data = [],
        layout = {};

    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Level 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Level 2";
    trace3.x = [];
    trace3.y = [];
    trace3.type = 'bar';
    trace3.name = "Level 3";
    for (let i = 0; i < challengeResultsArray.length; i++) {
        challengeResult = challengeResultsArray[i];
        challengeName = challengeResult.name.split("-")[3];
        challengeType = challengeResult.name.split("-")[2];
        shortName = challengeType + "-" + challengeName;
        trace1.x.push(shortName);
        trace2.x.push(shortName);
        trace3.x.push(shortName);
        trace1.y.push(challengeResult.level1Hints);
        trace2.y.push(challengeResult.level2Hints);
        trace3.y.push(challengeResult.level3Hints);
    }
    data = [trace1, trace2, trace3];
    layout = {
        barmode: 'group',
        title: 'Average hint scores per target-match challenge<br>' + myOption1,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeSingleEggDropGraph(challengeResultsArray) {
    var myDiv = document.getElementById("graphDiv"),
        myOption1 = chalFilter1.value;
    var Trace = Object,
        trace = new Trace(),
        challengeResult,
        challengeName,
        data = [],
        layout = {};
    trace.x = [];
    trace.y = [];
    trace.type = 'bar';
    trace.name = "Hints";
    for (let i = 0; i < challengeResultsArray.length; i++) {
        challengeResult = challengeResultsArray[i];
        challengeName = challengeResult.name;
        trace.x.push(challengeName);
        trace.y.push(challengeResult.hints);
    }
    data = [trace];
    layout = {
        barmode: 'group',
        title: 'Hints per egg-drop challenge per student<br>' + myOption1,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeSingleGameteGraph(challengeResultsArray) {
    var myDiv = document.getElementById("graphDiv"),
        myOption1 = chalFilter1.value;
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        trace3 = new Trace(),
        nameArray,
        challengeResult,
        shortName,
        data = [],
        layout = {};

    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Level 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Level 2";
    trace3.x = [];
    trace3.y = [];
    trace3.type = 'bar';
    trace3.name = "Level 3";
    for (let i = 0; i < challengeResultsArray.length; i++) {
        challengeResult = challengeResultsArray[i];
        nameArray = challengeResult.name.split("-");
        nameArray.shift();
        shortName = nameArray.join("-");
        trace1.x.push(shortName);
        trace2.x.push(shortName);
        trace3.x.push(shortName);
        trace1.y.push(challengeResult.level1Hints);
        trace2.y.push(challengeResult.level2Hints);
        trace3.y.push(challengeResult.level3Hints);
    }
    data = [trace1, trace2, trace3];
    layout = {
        barmode: 'group',
        title: 'Average hint scores per gamete challenge<br>' + myOption1,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function makeSingleClutchGraph(challengeResultsArray) {
    var myDiv = document.getElementById("graphDiv"),
        myOption1 = chalFilter1.value;
    var Trace = Object,
        trace1 = new Trace(),
        trace2 = new Trace(),
        trace3 = new Trace(),
        nameArray,
        challengeResult,
        shortName,
        data = [],
        layout = {};

    trace1.x = [];
    trace1.y = [];
    trace1.type = 'bar';
    trace1.name = "Level 1";
    trace2.x = [];
    trace2.y = [];
    trace2.type = 'bar';
    trace2.name = "Level 2";
    trace3.x = [];
    trace3.y = [];
    trace3.type = 'bar';
    trace3.name = "Level 3";
    for (let i = 0; i < challengeResultsArray.length; i++) {
        challengeResult = challengeResultsArray[i];
        nameArray = challengeResult.name.split("-");
        nameArray.shift();
        shortName = nameArray.join("-");
        trace1.x.push(shortName);
        trace2.x.push(shortName);
        trace3.x.push(shortName);
        trace1.y.push(challengeResult.level1Hints);
        trace2.y.push(challengeResult.level2Hints);
        trace3.y.push(challengeResult.level3Hints);
    }
    data = [trace1, trace2, trace3];
    layout = {
        barmode: 'group',
        title: 'Average hint scores per clutch challenge<br>' + myOption1,
        yaxis: {
            range: "auto"
        }
    };
    myDiv.style.display = "block";
    Plotly.newPlot(myDiv, data, layout);
}

function mean(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}

function makeGraph() {
    if ((selectedStudents.length > 0) && (selectedConceptName)) {
        var myStudent = selectedStudents[0];
        var studentId = myStudent.id;
        var myConcept = myStudent.concepts[selectedConceptName];
        var oldActivityName = "";
        var activityIndex = 0;
        var trace = [];
        var data = [];
        var probObjs = [];
        var myPlot = document.getElementById("graphDiv");
        var colors = ['red', 'deepskyblue', 'green', 'aqua', 'teal', 'magenta', 'turquoise', 'maroon', 'fuchsia', 'lime', 'blue', 'deeppink', 'darkorange'];

        //Need to map colors onto activity names and provide a legend

        var myColors = [];
        if (myConcept) {
            var myConceptName = myConcept.name;
            var myProbs = [],
                myValues = [],
                myReversals = [],
                myActivityNames = [],
                myActivityIndices = [],
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
                myAction = probObjs[j].action;
                myStudent = myAction.student;
                myIndex = myAction.index;
                myActivityName = myAction.activity;
                myActivity = myStudent.activitiesByName[myActivityName];
                myRoute = myActivity.route;
                if (oldActivityName == "") {
                    oldActivityName = myActivityName;
                } else if (myActivityName != oldActivityName) {
                    oldActivityName = myActivityName;
                    activityIndex++;
                }
                myIndices.push(myIndex.toString());
                myValues.push(probObjs[j].value);
                myColors.push(colors[activityIndex % colors.length]);
                myActivityNames.push("<b>" + myIndex + ": </b>" + myActivityName);
                myURLs.push("http://geniventure.concord.org/#" + myRoute);
                myActivityIndices.push(activityIndex);
            }

            myReversals = myConcept.reversals;
            if (myReversals == 0) {
                revStr = '<span style="color:red">No reversals</span>';
            } else if (myReversals == 1) {
                revStr = '<span style="color:red">One reversal</span>';
            } else {
                revStr = '<span style="color:red">' + myReversals + ' reversals</span>';
            }
            trace = {
                type: 'scatter',
                mode: 'lines+markers',
                marker: {
                    size: 15,
                    color: myColors
                },
                x: myIndices,
                y: myValues,
                line: {
                    color: "black",
                    width: 2
                },
                hovertext: myActivityNames
            }
            data = [trace];
            var layout = {
                autosize: false,
                width: 1500,
                height: 500,
                margin: {
                    l: 5,
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
                myName = myActivityNames[myPointIndex];
                myMission = myURL.split("/")[4] + "." + myURL.split("/")[5] + "." + myURL.split("/")[6];
                var xIndex = data.points[0].x;
                var num = 6;
                //     window.open(myURL, "_blank");
                infoPara.innerHTML = '<a href=' + myURL + '/ target="_blank">' + myName + " (" + myMission + ")<br>";
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
                    //             console.log("Reversal found. Values(" + (i - 1) + ") = " + values[i - 1]);
                }
                oldIncreasing = newIncreasing;
            } else if (values[i - 1] - values[i] > tolerance) {
                newIncreasing = false;
                if (newIncreasing != oldIncreasing) {
                    count++;
                    //        console.log("Reversal found. Values(" + (i - 1) + ") = " + values[i - 1]);
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

function routeToIndex(route) {

}