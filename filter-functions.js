function pruneClasses(myTeacher) { //add classes to myTeacher but only if they have more than three students;
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].students.length > 3) {
            myTeacher.classes.push(classes[i]);
        }
    }
}
   
function pruneStudents(myClass) {//add students to myTeacher but only if they have more than three activities;
    for (var i = 0; i < classes.length; i++) {
        if (students[i].activities.length > 3) {
            myClass.students.push(students[i]);
        }
    }
}
