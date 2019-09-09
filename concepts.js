function showConcepts() {
    //Sets up the concepts checkboxes, labeled with the names of all the concepts. Clicking on any one of them sets the global variable selectedConceptName to the name of the selected concept. The actual concept object must be determined by an examination of the selected student(s).

    var id,
        destination = document.getElementById("concepts");
    destination.innerHTML = "<b>Concept Ids</b><br><br>";
    for (var i = 0; i < conceptIds.length; i++) {
        id = conceptIds[i];
        destination.innerHTML += "<input type ='radio' id=" + id + " name='conceptButton' + onchange='setSelectedConceptName(this.id)'> </input > " + id + "<br>";
    }
}

function setSelectedConceptName(name) {
    selectedConceptName = name;
}