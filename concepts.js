function showConcepts() {
    //Sets up the concepts checkboxes, labeled with the names of all the concepts. Clicking on any one of them sets the global variable selectedConceptName to the name of the selected concept. The actual concept object must be determined by an examination of the selected student(s).

    var id,
        destination = document.getElementById("concepts");
    var count = 0;
    setSelectedObjects();
    if (selectedStudents.length == 1) {
        var selectedStudent = selectedStudents[0];
    }
    destination.innerHTML = "<b>Concept Ids</b><br><br>";
    for (var i = 0; i < conceptIds.length; i++) {
        id = conceptIds[i];
        if (selectedStudent) {
            if (selectedStudent.concepts[id]) {
                count = selectedStudent.concepts[id].probObjs.length;
            }
        }
        destination.innerHTML += "<input type ='radio' id=" + id + " name='conceptButton' + onchange='setSelectedConceptName(this.id);makeGraph()'> </input > " + id + " (" + count + ")<br>";
    }
    if (selectedConceptName) {
        document.getElementById(selectedConceptName).checked = true;
    }
}

function setSelectedConceptName(name) {
    selectedConceptName = name;
}