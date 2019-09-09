function showStudents() { //Sets up the students checkboxes which are labeled with the ids of the students. Eventually there will be one checkbox for each student enrolled in at least one of the selected classes. The span fields contain the number of concepts engaged in by each student; onchange runs "showConcepts"

var theseStudents = [], //all student objects of selected classes
    theseStudentIds = [], //all student ids of selected classes
    counts = [];
    setSelectedObjects();
if (selectedClasses.length == 0) {
    studentsPara.innerHTML = "";
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
    actionsPara.innerHTML = "";
    graphDiv.innerHTML = "";
} else {
    for (var i = 0; i < selectedClasses.length; i++) {
        myClass = selectedClasses[i];
        for (var j = 0; j < myClass.studentIds.length; j++) {
            myStudentId = myClass.studentIds[j];
            myStudent = myClass.studentsObj[myStudentId];
            myCount = myStudent.activityIds.length;
            theseStudentIds.push(myStudentId);
            theseStudents.push(myStudent);
            counts.push(myCount);
        }
    }
    makeButtons(theseStudents, theseStudentIds, counts, "radio", "id", "studentButton", "showConcepts();makeGraph(this.id);showActivities()", "Student IDs", studentsPara);
}
    showActivities();
}