//Loop over the IDs in objectIds to turn them into objects, then create a column of checkboxes or radio buttons for each object, labeled by the id of that object with the <countField> of the object in parentheses. Color the nameField and countField appropriately. If the buttons are already present and are being replaced, keep track of their checked status and persist it in the new buttons.

function makeButtons(objects, objectIds, counts, type, nameField, name, onchange, title, destination) {
    var string,
        count,
        id,
        statusArray = [];
    buttons = document.getElementsByName(name);
    if (buttons.length > 0) {
        for (var y = 0; y < buttons.length; y++) {
            myStatus = {
                id: buttons[y].id,
                checked: buttons[y].checked
            };
            statusArray.push(myStatus);
        }
    }

    if (title == "Guide-hint-received") {
        title = "<span style=\"color:red\">" + title + "</span>";
    }
    if (title == "Guide-remediation-requested") {
        title = "<span style=\"color:blue\">" + title + "</span>";
    }

    if (objectIds.length == 0) {
        destination.innerHTML = "";
    } else {
        destination.innerHTML = "<b>" + title + "</b><br>";
        for (var m = 0; m < objectIds.length; m++) {
            object = objects[m];
            id = objectIds[m];
            count = counts[m];
            string = setColorCode(object, nameField);
            for (var j = 0; j < statusArray.length; j++) {
                if (statusArray[j].id == id) {
                    buttonChecked = statusArray[j].checked;
                }
            }
            destination.innerHTML += "<input type=" + type + " id= " + id + " name=" + name + " onchange=" + onchange + "></input> " + string + " (" + counts[m] + ")<br>";
        }
        var newButtons = document.getElementsByName(name);
        for (var x = 0; x < newButtons.length; x++) {
            newButtons[x].checked = false;
            for (var y = 0; y < statusArray.length; y++) {
                if (newButtons[x].id == statusArray[y].id) {
                    newButtons[x].checked = statusArray[y].checked;
                }
            }
        }
    }
}

function showTeachers() {
    var teachers = [],
        t,
        id,
        counts = [],
        classIds = [];
    teacherIds = Object.keys(teachersObj);
    for (var i = 0; i < teacherIds.length; i++) {
        id = teacherIds[i];
        t = teachersObj[id];
        teachers.push(t);
        classIds = Object.keys(t.classesObj);
        counts.push(classIds.length);
    }
    makeButtons(teachers, teacherIds, counts, "checkbox", "id", "teacherButton", "showClasses()", "Teachers", teachersPara);
}

function showClasses() { //Sets up the classes checkboxes for all classes contained in the uploaded files. Span contains the number of students in each class; onchange runs "showStudents"
    var classes = [], //all class objects of selected teachers
        classIds = [], //all class ids of selected teachers
        counts = []; //array of student counts ofeach class
    var selectedTeachers = getSelected(teachersObj, "teacherButton");
    if (selectedTeachers.length > 0) {
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
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
}

function showStudents() { //Sets up the students checkboxes which are labeled with the ids of the students. Eventually there will be one checkbox for each student enrolled in at least one of the selected classes. The span fields contain the number of activities engaged in by each student; onchange runs "showActivities"

    var students = [], //all student objects of selected classes
        studentIds = [], //all student ids of selected classes
        counts = []
    var selectedClasses = getSelectedClasses();
    for (var i = 0; i < selectedClasses.length; i++) {
        myClass = selectedClasses[i];
        for (var j = 0; j < myClass.studentIds.length; j++) {
            myStudentId = myClass.studentIds[j];
            myStudent = myClass.studentsObj[myStudentId];
            myCount = myStudent.activityIds.length;
            studentIds.push(myStudentId);
            students.push(myStudent);
            counts.push(myCount);
        }
    }
    makeButtons(students, studentIds, counts, "checkbox", "id", "studentButton", "showActivities()", "Student IDs", studentsPara);
}

function showActivities() { //Sets up the activites checkboxes, which are labeled with the names of the intersection of the activities engaged by all the selected students. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
    var intersectingActivityIds = [],
        intersectingActivities = [],
        activityIdsByStudent = [],
        counts = [],
        selectedStudents = getSelectedStudents();
    var tableButtonsDiv = document.getElementById("tableButtonsDiv");
    if (selectedStudents.length > 0) {
        //Run over the activities fields for those students and collect the intersection of the names of those activities
        tableButtonsDiv.style.display = "block";   
        for (var i = 0; i < selectedStudents.length; i++) {
            myStudent = selectedStudents[i];
            activityIdsByStudent[i] = myStudent.activityIds;
            activityIdsByStudent[i].sort(function (a, b) {
                var x = a.toLowerCase();
                var y = b.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            })
        }
        intersectingActivityIds = activityIdsByStudent[0]; //Start with the first element and iteratively compare to all the others in names
        for (var j = 1; j < activityIdsByStudent.length; j++) { //start with the second element
            intersectingActivityIds = intersection(intersectingActivityIds, activityIdsByStudent[j]);
        }
        for (var k = 0; k < intersectingActivityIds.length; k++) {
            intersectingActivities[k] = myStudent.activitiesObj[intersectingActivityIds[k]];
            counts[k] = intersectingActivities[k].eventIds.length;
        }
        makeButtons(intersectingActivities, intersectingActivityIds, counts, "checkbox", "id", "activityButton", "showEvents()", "Activities", activitiesPara);
        showEvents();
    } else {
        activitiesPara.innerHTML = "";
    }
}

function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
    var intersectingEventIds = [],
        intersectingEvents = [],
        eventIdsByStudent = [],
        counts = [];
    selectedActivities = getSelectedActivities();
    if (selectedActivities.length > 0) {
        for (var i = 0; i < selectedActivities.length; i++) {
            myActivity = selectedActivities[i];
            eventIdsByStudent[i] = myActivity.eventIds;
            eventIdsByStudent[i].sort(function (a, b) {
                var x = a.toLowerCase();
                var y = b.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            })
        }
        intersectingEventIds = eventIdsByStudent[0]; //Start with the first element and iteratively compare to all the others in names
        for (var j = 1; j < eventIdsByStudent.length; j++) { //start with the second element
            intersectingEventIds = intersection(intersectingEventIds, eventIdsByStudent[j]);
        }
        for (var k = 0; k < intersectingEventIds.length; k++) {
            intersectingEvents[k] = myActivity.eventsObj[intersectingEventIds[k]];
            counts[k] = intersectingEvents[k].actions.length;
        }
        makeButtons(intersectingEvents, intersectingEventIds, counts, "checkbox", "id", "eventButton", "showActions()", "Events", eventsPara);
        showActions();
    } else {
        eventsPara.innerHTML = "";
    }
}

function showActions() {
    var myEvent,
        myAction,
        myFields,
        unixTime,
        selectedEvents = getSelectedEvents();
    if (selectedEvents.length == 0) {
        actionsPara.innerHTML = "";
    } else {
        actionsPara.innerHTML = "<b>Actions</b><br>";
        selectedActions = [];
        for (var i = 0; i < selectedEvents.length; i++) {
            myEvent = selectedEvents[i];
            for (var j = 0; j < myEvent.actions.length; j++) {
                myAction = myEvent.actions[j];
                myAction.unixTime = new Date(myAction.time).getTime();
                selectedActions.push(myAction);
            }
        }
        selectedActions.sort(function (a, b) {
            return a.unixTime - b.unixTime;
        })
        for (var k = 0; k < selectedActions.length; k++) {
            myAction = selectedActions[k];
            myParameters = myAction.parameters;
            myFields = Object.getOwnPropertyNames(myParameters);
            actionsPara.innerHTML += ("<br><b>" + myAction.index + ": " + myAction.event + " at " + myAction.time + "</b><br>");
            //      if (myAction.description) {
            //        actionsPara.innerHTML += myAction.description;
            //  } else {
            for (var l = 0; l < myFields.length; l++) {
                myField = myFields[l];
                actionsPara.innerHTML += (myField + ":" + myParameters[myField] + "<br>");
            }
            actionsPara.innerHTML += probsList(myAction) + "<br>";
        }
    }
}

function toggleTable() {
    var table = document.getElementById("probTable");
    var tableSpan = document.getElementById("tableSpan");
    if (tableSpan.textContent == "Show table") {
        tableSpan.textContent = "Hide table";
        probTable.style.display = "inline";
        makeCSVFile();
    } else {
        tableSpan.textContent = "Show table";
        probTable.style.display = "none";
    }
}