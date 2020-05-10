function pruneData(teacher) { //Loop over all the classes for teacher, eliminating those that have fewer then 3 students. (Note: the class ID has to be spliced out of the array too.) Do the same for any students with fewer than two activities.
    var myClass,
        myClassId,
        myClassIds = [],
        myStudent,
        myStudentId,
        myStudentIds,
        myActivityIds;
    myClassIds = Object.keys(teacher.classesObj);
    for (var i = 0; i < myClassIds.length; i++) {
        myClassId = myClassIds[i];
        myClass = teacher.classesObj[myClassId];
        myStudentIds = Object.keys(myClass.studentsObj);
        if (myStudentIds.length < 3) {
            delete teacher.classesObj[myClassId];
            teacher.classIds = Object.keys(teacher.classesObj);
            delete classesObj[myClassId];
            classIds = Object.keys(teacher.classesObj);
        } else {
            for (var j = 0; j < myClass.studentIds.length; j++) {
                myStudentId = myClass.studentIds[j];
                myStudent = myClass.studentsObj[myStudentId];
                myActivityIds = Object.keys(myStudent.activitiesObj);
                if (myActivityIds.length < 2) {
        //            console.log("Student " + myStudentId + " has fewer than two activities and is being eliminated");
                    delete teacher.studentsObj[myStudentId];
                    delete myClass.studentsObj[myStudentId];
                    myClass.studentIds = Object.keys(myClass.studentsObj);
                    delete studentsObj[myStudentId];
                    studentIds = Object.keys(studentsObj);
                }
            }
        }
    }
    console.log("Data pruned. Student IDs number " + studentIds.length);
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

function countHintsByChallenge() {
    var limbsArray = [],
        wingsArray = [],
        hornsArray = [],
        limbsConcepts = 0,
        wingsConcepts = 0,
        hornsConcepts = 0;
    for (const myStudent of students) {
        for (const thisHint of myStudent.hints) {
            if (thisHint.activity === "eggDrop-horns") {
                hornsArray.push(thisHint);
            } else if (thisHint.activity === "eggDrop-wings") {
                wingsArray.push(thisHint);
            } else if (thisHint.activity === "eggDrop-limbs") {
                limbsArray.push(thisHint);
            }
        }
    }
    hornConcepts = countConcepts(hornsArray);
    wingsConcepts = countConcepts(wingsArray);
    limbsConcepts = countConcepts(limbsArray);
    console.log("Eggdrop-horns challenge has " + hornConcepts[0] + " hints for concept LG1.C2a, " + hornConcepts[1] + " hints for concept LG1.C2b, and " + hornConcepts[2] + " for concept LG1.A3.");
    console.log("Eggdrop-wings challenge has " + wingsConcepts[0] + " hints for concept LG1.C2a, " + wingsConcepts[1] + " hints for concept LG1.C2b, and " + wingsConcepts[2] + " for concept LG1.A3.");
    console.log("Eggdrop-limbs challenge has " + limbsConcepts[0] + " hints for concept LG1.C2a, " + limbsConcepts[1] + " hints for concept LG1.C2b, and " + hornConcepts[2] + " for concept LG1.A3.");
}

function countConcepts(array) {
    var counta = 0,
        countb = 0,
        countc = 0;
    for (const hint of array) {
        if (hint.conceptId === "LG1.C2a") {
            counta++;
        } else if (hint.conceptId === "LG1.C2b") {
            countb++;
        } else if (hint.conceptId === "LG1.A3") {
            countc++;
        }
    }
    return ([counta, countb, countc]);
}