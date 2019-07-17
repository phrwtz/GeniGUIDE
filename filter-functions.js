function pruneData(teacher) { //Loop over all the classes for teacher, eliminating those that have fewer then 3 students. (Note: the class ID has to be splice out of the array too.) Do the same for any students with fewer than two activities.
    var myClass,
        myClassId,
        myClassIds = [],
        studentIds,
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
        } else {
            for (var j = 0; j < myClass.studentIds.length; j++) {
                studentId = studentIds[j];
                student = myClass.studentsObj[studentId];
                activityIds = Object.keys(student.activitiesObj);
                if (activityIds.length < 2) {
                    delete myClass.studentsObj[studentId];
                    myClass.studentIds = Object.keys(myClass.studentsObj);
                }
            }
        }
    }
    console.log("Data pruned");
}

function getSelected(objects, buttonName) {
    var buttonArray = document.getElementsByName(buttonName);
    var checkedObjects = [];
    for (var i = 0; i < buttonArray.length; i++) {
        if (buttonArray[i].checked) {
            object = objects[buttonArray[i].id];
            checkedObjects.push(object);
        }
    }
    return checkedObjects;
}

function getSelectedTeachers() {
    return getSelected(teachersObj, "teacherButton");
}

function getSelectedClasses() {
    var selectedTeachers = getSelectedTeachers();
    var classesByTeacher = [];
    var allSelectedClasses = [];
    for (var i = 0; i < selectedTeachers.length; i++) {
        classesByTeacher = getSelected(selectedTeachers[i].classesObj, "classButton");
        for (var j = 0; j < classesByTeacher.length; j++) {
            allSelectedClasses.push(classesByTeacher[j]);
        }
    }
return allSelectedClasses;
}

function getSelectedStudents() {
    var selectedClasses = getSelectedClasses();
    var studentsByClass = [];
    var allSelectedStudents = [];
    for (var i = 0; i < selectedClasses.length; i++) {
        studentsByClass = getSelected(selectedClasses[i].studentsObj, "studentButton");
        for (var j = 0; j < studentsByClass.length; j++) {
            allSelectedStudents.push(studentsByClass[j]);
        }
    }
    return allSelectedStudents;
}

function getSelectedActivities() {
    var selectedStudents = getSelectedStudents();
    var activitiesByStudent = [];
    var allSelectedActivities = [];
    for (var i = 0; i < selectedStudents.length; i++) {
        activitiesByStudent = getSelected(selectedStudents[i].activitiesObj, "activityButton");
    }
    return allSelectedActivities;
}

function getSelectedEvents() {
    var selectedActivities = getSelectedActivities();
    var selectedEvents = [];
    for (var i = 0; i < selectedActivities.length; i++) {
        selectedEvents.push(selectedActivities[i].activitiesObj, "eventButton");
    }
    return selectedEvents;
}