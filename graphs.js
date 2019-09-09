function makeGraph(studentId) {
    if (selectedConceptName) {
        var selectedStudent = studentsObj[studentId];
        var myConcept = selectedStudent.concepts[selectedConceptName];
        var myConceptName = myConcept.name;
        var myProbs = [],
            myValues = [],
            myActivities = [];
        trace = new Object(),
            graphDiv.innerHTML = "";
        for (var j = 0; j < myConcept.probObjs.length; j++) {
            myProbs.push(myConcept.probObjs[j]);
            myValues.push(myConcept.probObjs[j].value);
            myActivities.push(myConcept.probObjs[j].action.index + "." + myConcept.probObjs[j].action.activity);
        }
        trace.type = "scatter";
        trace.mode = "lines+markers";
        trace.color = 'hsl(75,100,100)';
        trace.x = myActivities;
        trace.y = myValues;
        trace.size = 200;
        trace.width = 200;
        trace.hovertext = myConcept.name;
        var data = [trace];
        var layout = {
            title: ("Student = " + studentId),
            yaxis: {
                range: [0, 1.1]
            }
        }
        Plotly.newPlot("graphDiv", data, layout);
    }
}

function reportConceptData() {
    var ci = new Object();
    ci["LG1.A3"] = "Sex determination. Females have two X chromosomes. Males have one X and one Y.";
    ci["LG1.C2a"] = "Simple dominance. Only one dominant allele is needed to produce the dominant trait.";
    ci["LG1.C2b"] = "Recessive traits. For most traits, the absence is recessive.";
    ci["LG1.C2c"] = "X linkage. Males receive only one copy of the X chromosome and pass on their X chromosome only to their daughters.";
    ci["LG1.C2d"] = "Polyallelic. Some traits are controled by multiple alleles that can form a ranked series in terms of dominance.";
    ci["LG1.C3"] = "Incomplete dominance. For some traits both alleles will have some effect with neither being completely dominant.";
    ci["LG1.P1"] = "Genotype-to-phenotype mapping. Given a genotype, predict the phenotype of an organism.";
    ci["LG1.P2"] = "Phenotype-to-genotype mapping. Given a phenotype, determine the possible genotypes of an organism.";
    ci["LG1.C4a"] = "Epistasis. A gene can mask the effect of other genes.";
    ci["LG2.P1"] = "Gamete selection. Create or select parental gametes to create an individual offspring with a specific phenotype.";
    ci["LG3.P1"] = "Parent genotypes. Set or select parental genotypes to produce a specific pattern of traits in offspring.";
    ci["LG3.P3"] = "Patterns in offspring. Use patterns in the phenotypes of a group of offspring to predict the genotypes of the parents.";
    ci["LG3.P4"] = "Test cross. Breed with a recessive organism to determine an unknown genotype.";
    ci["LG99.A"] = "Some allele changes don't affect phenotype.";
    return ci;
}

function showConceptDescription(id) {
    var concept = conceptsObj[id];
    infoPara.innerHTML = concept.name + " = " + conceptDescriptions[concept.name];
}