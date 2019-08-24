function pruneData(teacher) { //Loop over all the classes for teacher, eliminating those that have fewer then 3 students. (Note: the class ID has to be splice out of the array too.) Do the same for any students with fewer than two activities.
    var myClass,
        myClassId,
        myClassIds = [],
        student,
        studentId;
    myClassIds = Object.keys(teacher.classesObj);
    for (var i = 0; i < myClassIds.length; i++) {
        myClassId = myClassIds[i];
        myClass = teacher.classesObj[myClassId];
        studentIds = Object.keys(myClass.studentsObj);
        if (studentIds.length < 3) {
            delete teacher.classesObj[myClassId];
            teacher.classIds = Object.keys(teacher.classesObj);
            delete classesObj[myClassId];
            classIds = Object.keys(teacher.classesObj);
        } else {
            for (var j = 0; j < myClass.studentIds.length; j++) {
                studentId = studentIds[j];
                student = myClass.studentsObj[studentId];
                activityIds = Object.keys(student.activitiesObj);
                if (activityIds.length < 2) {
                    console.log("Student " + studentId + " has fewer than two activities and is being eliminated");
                    delete myClass.studentsObj[studentId];
                    myClass.studentIds = Object.keys(myClass.studentsObj);
                    delete studentsObj[studentId];
                    studentIds = Object.keys(myClass.studentsObj);
                }
            }
        }
    }
    console.log("Data pruned");
}

function getSelected(objects, buttonName) {
    var buttonArray = document.getElementsByName(buttonName);
    var checkedObjects = [];
    //Leave out the top button: it's the all/none button
    for (var i = 1; i < buttonArray.length; i++) {
        if (buttonArray[i].checked) {
            object = objects[buttonArray[i].id];
            checkedObjects.push(object);
        }
    }
    return checkedObjects;
}

function setSelectedObjects() {
    selectedTeachers = getSelected(teachersObj, "teacherButton");
    selectedClasses = getSelected(classesObj, "classButton");
    selectedStudents = getSelected(studentsObj, "studentButton");
    selectedConcepts = getSelected(conceptsObj, "conceptButton");
    selectedActivities = getSelected(activitiesObj, "activityButton");
    selectedEvents = getSelected(eventsObj, "eventButton");
}

function displayAction(studentId, index) {
    var myStudent = studentsObj[studentId];
    return myStudent.actions[index];
}