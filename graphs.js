function makeGraph(concepts) {
    var graphDiv = document.getElementById("graphDiv"),
        myProbs = [],
        myValues = [],
        trace = new Object(),
        indices = [];
    for (var i = 0; i < concepts.length; i++) {
        myConcept = concepts[i];
        myStudentId = myConcept.student.id;
        myConceptName = myConcept.name;
        for (var j = 0; j < myConcept.probObjs.length; j++) {
            myProbs.push(myConcept.probs[j]);
            myValues.push(myConcept.probs[j].value);
        }
        trace.type = "scatter";
        trace.mode = "lines+markers";
        trace.color = 'hsl(75,100,100)';
        trace.showlegend = true;
        trace.name = 'concept ' + myConceptName;
        trace.x = indices;
        trace.y = myValues;
        trace.size = 120;
        trace.width = 200;
        var data = [trace];
        var layout = {
            title: ("Student = " + myStudentId),
            yaxis: {
                range: [0, 1.1]
            }
        }
        Plotly.newPlot("graphDiv", data, layout);
    }
}