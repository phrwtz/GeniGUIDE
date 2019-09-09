
    function showClasses() { //Sets up the classes checkboxes for all classes contained in the uploaded files. Span contains the number of students in each class; onchange runs "showStudents"
        var classes = [], //all class objects of selected teachers
            classIds = [], //all class ids of selected teachers
            counts = []; //array of student counts ofeach class
        setSelectedObjects();
        if (selectedTeachers.length == 0) {
            classesPara.innerHTML = "";
            studentsPara.innerHTML = "";
            activitiesPara.innerHTML = "";
            eventsPara.innerHTML = "";
            actionsPara.innerHTML = "";
            graphDiv.innerHTML = "";
        } else {
            for (var i = 0; i < selectedTeachers.length; i++) {
                myTeacher = selectedTeachers[i];
                for (var j = 0; j < myTeacher.classIds.length; j++) {
                    myClassId = myTeacher.classIds[j];
                    myClass = myTeacher.classesObj[myClassId];
                    if (myClass) { //Have to check because some classes have been pruned
                        studentIds = Object.keys(myClass.studentsObj);
                        myCount = studentIds.length;
                        classIds.push(myClassId);
                        classes.push(myClass);
                        counts.push(myCount);
                    }
                }
                makeButtons(classes, classIds, counts, "checkbox", "id", "classButton", "showStudents()", "Class IDs", classesPara);
            }
        }
        showStudents();
    }