//Global variables
var rowObjs = [];
var classes = [];
var students = [];
var activities = [];
var uniqueActivityNames = [];
var uniqueHintActivityNames = [];
var classesPara = document.getElementById("classes");
var studentsPara = document.getElementById("students");
var activitiesPara = document.getElementById("activities");
var eventsPara = document.getElementById("events");
var fieldsPara = document.getElementById("fields");
var actionsPara = document.getElementById("actions");
var hintsTable = document.getElementById("hintsTable");
var selectedClasses = [];
var selectedStudents = [];
var selectedActivities = [];
var selectedEvents = [];
var selectedActions = [];
var clas = function () {};
var student = function () {};
var activity = function () {};
var event = function () { };
var hint = function () { };

function filter(data) {
    parseJSON(data);
    console.log("data parsed");
 //   setHints();/
    showClasses();
    followStudent();
}

//This function takes one or more JSON files turns them into an array of objects then identifies classes by class_id, students by id, events by .
function parseJSON(data) {
    var classIds = [],
        myRow,
        myClass,
        myStudent,
        myActivity,
        myEvent;
    for (var i = 0; i < data.length; i++) {
        rowObjs = JSON.parse(data[i]);
    }
    rowObjs.sort(function (a, b) {
        return (new Date(a.time).getTime() - new Date(new Date(b.time).getTime()));
    })
    for (var j = 0; j < rowObjs.length; j++) {
        myRow = rowObjs[j];
        if (myRow.class_id) {
            if (!classIds.includes(myRow.class_id)) {
                myClass = new clas;
                myClass.id = myRow.class_id;
                myClass.students = [];
                myClass.uniqueUsernames = [];
                myClass.hints = [];
                myClass.hintsReceived = false;
                myClass.remediationRequested = false;
                classes.push(myClass);
                classIds.push(myClass.id);
            } else {
                myClass = getComponentById(classes, "id", myClass.id);
            }
            if (myRow.username && myClass.students) {
                if (!myClass.uniqueUsernames.includes(myRow.username)) {
                    myClass.uniqueUsernames.push(myRow.username);
                    myStudent = new student;
                    myStudent.actions = [];
                    myStudent.activities = [];
                    myStudent.activityNames = [];
                    myStudent.id = myRow.username;
                    myStudent.class = myClass;
                    myStudent.hints = [];
                    myStudent.hintsReceived = false;
                    myStudent.remediationRequested = false;
                    myClass.students.push(myStudent);
                    myStudent.ITS = []; //Holds all ITS actions: hints and remediations
                    students.push(myStudent);
                } else {
                    myStudent = getComponentById(myClass.students, "id", myRow.username);
                }
                if (myRow.activity) {
                    if (!myStudent.activityNames.includes(myRow.activity)) {
                        myActivity = new activity;
                        myActivity.name = myRow.activity;
                        myActivity.student = myStudent;
                        myActivity.actions = [];
                        myActivity.events = [];
                        myActivity.hints = [];
                        myActivity.hintsReceived = false;
                        myActivity.eventNames = [];
                        myActivity.remediationRequested = false;
                        myStudent.activityNames.push(myRow.activity);
                        myStudent.activities.push(myActivity);
                        activities.push(myActivity);
                    } else {
                        myActivity = getComponentById(myStudent.activities, "name", myRow.activity);
                    }
                    myActivity.actions.push(myRow);
                    if (myRow.event) {
                        myRow.event = myRow.event.replace(/ /g, "-");
                        if (!myActivity.eventNames.includes(myRow.event)) {
                            myActivity.eventNames.push(myRow.event);
                            myEvent = new event;
                            myEvent.name = myRow.event;
                            myEvent.activity = myActivity;
                            myEvent.actions = [];
                            myActivity.events.push(myEvent);
                        } else {
                            myEvent = getComponentById(myActivity.events, "name", myRow.event);
                        }
                        addDescription(myRow, myActivity, myEvent);
                        myEvent.actions.push(myRow);
                        if (myEvent.name == "Guide-hint-received") {
                            myActivity.hintReceived = true;
                            myStudent.hintReceived = true;
                            myClass.hintReceived = true;
                            myStudent.ITS.push(myRow);
                        } else if (myEvent.name == "Guide-remediation-requested") {
                            myActivity.remediationRequested = true;
                            myStudent.remediationRequested = true;
                            myClass.remediationRequested = true;
                            myStudent.ITS.push(myRow);
                        }
                    }
                    myStudent.actions.push(myRow);
                }
            }
        } //New rowobj
    }
}

function getSelectedClasses() { //Starting from global "classes," sets the global array "selectedClasses" to contain all the classes whose checkboxes are checked. Erases all columns to the right if no boxes are checked.
    selectedClasses = [];
    var selectedClassIds = checkedButtons("classButton"),
        myClass;
    if (selectedClassIds.length == 0) {
        studentsPara.innerHTML = "";
        activitiesPara.innerHTML = "";
        eventsPara.innerHTML = "";
    } else {
        for (var i = 0; i < selectedClassIds.length; i++) {
            myClass = getComponentById(classes, "id", selectedClassIds[i]);
            selectedClasses.push(myClass);
        }
    }
}

function getSelectedStudents() { //Starting from the global array "selectedClasses," sets the global array "selectedStudents" to contain all the students in classes whose checkboxes are checked. Note: students may be duplicated if they are enrolled in more than one class. Erases all columns to the right if no student boxes are checked.
    selectedStudents = [];
    var selectedStudentIds = checkedButtons("studentButton"),
        studentsToLookAt = [], //All students in selected classes
        myClass,
        myStudent;
    if (selectedStudentIds.length == 0) {
        activitiesPara.innerHTML = "";
        eventsPara.innerHTML = "";
    } else {
        //For each class in selectedClasses,
        for (var i = 0; i < selectedClasses.length; i++) {
            myClass = selectedClasses[i];
            //for each student in each class,
            for (var j = 0; j < myClass.students.length; j++) {
                myStudent = myClass.students[j];
                //if the student's box has been checked
                if (selectedStudentIds.includes(myStudent.id)) {
                    selectedStudents.push(myStudent);
                }
            }
        }
    }
}


function getSelectedActivities() { //Starting from the global array "selectedStudents," sets the global array "selectedActivities" to contain all the activities engaged in by the students whose checkboxes are checked. Note: some activities may be duplicated if more than one selected student engages in them. Erases all columns to the right if no activity boxes are checked.
    selectedActivities = [];
    var selectedActivityIds = checkedButtons("activityButton"),
        myStudent,
        myActivity;
    if (selectedActivityIds.length == 0) {
        eventsPara.innerHTML = "";
    } else {
        for (var j = 0; j < selectedStudents.length; j++) {
            myStudent = selectedStudents[j];
            for (var k = 0; k < myStudent.activities.length; k++) {
                myActivity = myStudent.activities[k];
                if (selectedActivityIds.includes(myActivity.name)) {
                    selectedActivities.push(myActivity);
                }
            }
        }
    }
}


function getSelectedEvents() { //Starting from the global array "selectedActivities," sets the global array "selectedEvents" to contain all the events contained in one or more of the activities whose checkboxes are checked. Note: some events may be duplicated if they belong to more than one checked activity.
    selectedEvents = [];
    var selectedEventIds = checkedButtons("eventButton"),
        myActivity,
        myEvent;
    for (var k = 0; k < selectedActivities.length; k++) {
        myActivity = selectedActivities[k];
        for (var l = 0; l < myActivity.events.length; l++) {
            myEvent = myActivity.events[l];
            if (selectedEventIds.includes(myEvent.name)) {
                selectedEvents.push(myEvent);
            }
        }
    }
}

function showClasses() { //Sets up the classes checkboxes. Span contains the number of students in each class; onchange runs "showStudents"
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
    makeButtons(classes, "id", "students", "radio", "classButton", "showStudents()", "Class IDs", classesPara);
}

function showStudents() { //Sets up the students checkboxes. Span field contains the number of activities engaged in by each student; onchange runs "showActivities"
    var selectedStudents = [],
        myClass,
        myStudent;
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
    actionsPara.innerHTML = "";
    getSelectedClasses();
    if (selectedClasses.length > 0) {
        for (var j = 0; j < selectedClasses.length; j++) {
            myClass = selectedClasses[j];
            makeButtons(myClass.students, "id", "activities", "radio", "studentButton", "showActivities()", "Student IDs", studentsPara)
        }
    }
}

function showActivities() { //Sets up the activites checkboxes. Span field contains the number of events executed within each activity; onchange runs "showEvents"
    eventsPara.innerHTML = "";
    actionsPara.innerHTML = "";
    var selectedActivities = [],
        myStudent,
        myActivity,
        myEvent;
    getSelectedStudents(); //All the students, if any, whose boxes have been checked
    if (selectedStudents.length != 0) {
        for (var i = 0; i < selectedStudents.length; i++) {
            myStudent = selectedStudents[i];
            makeButtons(myStudent.activities, "name", "events", "radio", "activityButton", "showEvents()", "Activities", activitiesPara);
        }
    }
}

function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
    selectedEvents = [];
    var uniqueEventNames = [],
        uniqueEvents = [],
        uniqueEvent = function () {},
        myUniqueEvent,
        myActivity,
        myEvent,
        myAction,
        uniqueAction,
        actionFound;
    getSelectedActivities();
    actionsPara.innerHTML = "";
    if (selectedActivities.length > 0) {
        for (var i = 0; i < selectedActivities.length; i++) {
            myActivity = selectedActivities[i];
            for (var j = 0; j < myActivity.events.length; j++) {
                myEvent = myActivity.events[j];
                if (!uniqueEventNames.includes(myEvent.name)) {
                    uniqueEventNames.push(myEvent.name);
                    myUniqueEvent = new uniqueEvent;
                    myUniqueEvent.name = myEvent.name;
                    myUniqueEvent.actions = myEvent.actions;
                    uniqueEvents.push(myUniqueEvent);
                } else { //We've already encountered this event from another activity. We need to find the uniqueEvent object and add to its actions if we encounter new ones
                    actionFound = false;
                    myUniqueEvent = getComponentById(uniqueEvents, "name", myEvent.name);
                    for (var k = 0; k < myEvent.actions.length; k++) {
                        myAction = myEvent.actions[k];
                        for (var l = 0; l < myUniqueEvent.actions.length; l++) {
                            uniqueAction = myUniqueEvent.actions[l];
                            if (myAction.id == uniqueAction.id) {
                                actionFound = true;
                            }
                        }
                    }
                    if (!actionFound) {
                        myUniqueEvent.actions.push(myAction);
                    }
                }
            }
            uniqueEvents.sort(function (a, b) {
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            })
            makeButtons(uniqueEvents, "name", "actions", "checkbox", "eventButton", "showActions()", "Events", eventsPara)
        }
    } else {
        eventsPara.innerHTML = "";
    }
}

function showActions() {
    var myEvent,
        myAction,
        myFields,
        unixTime;
    getSelectedEvents();
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
            return a.unixTime - b.unixTime
        })
        for (var k = 0; k < selectedActions.length; k++) {
            myAction = selectedActions[k];
            myParameters = myAction.parameters;
            myFields = Object.getOwnPropertyNames(myParameters);
            actionsPara.innerHTML += ("<br><b>" + myAction.event + " at " + myAction.time + "</b><br>");
            if (myAction.description) {
                actionsPara.innerHTML += myAction.description;
            } else {
                for (var l = 0; l < myFields.length; l++) {
                    myField = myFields[l];
                    actionsPara.innerHTML += (myField + ":" + myParameters[myField] + "<br>");
                }
            }
        }
    }
}