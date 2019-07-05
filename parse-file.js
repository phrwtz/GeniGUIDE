//Global variables
var rowObjs = [];
var teachersArray = [];
var classes = [];
var students = [];
var activities = [];
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
var teachersObj = function () {};
var classObj = function () {};
var teacher = function () {};
var student = function () {};
var activity = function () {};
var event = function () {};
var hint = function () {};
var prob = function () {};

function filter() {
    for (var i = 0; i < teachersArray.length; i++) {
        myTeacher = teachersArray[i];
        parseJSON(myTeacher);
        console.log("Data for file " + myTeacher.name + " parsed.");
        findFutureProbs();
        console.log("Future probs found.");
        showClasses();
        //    MakeCSVFile();
    }
}


//This function takes one or more JSON files turns them into an array of objects then identifies classes by class_id, students by id, events by .
function parseJSON(myTeacher) {
    var classIds = [],
        myRow,
        myClass,
        myStudent,
        myActivity,
        myEvent,
        myAction;
    rowObjs = JSON.parse(myTeacher.data);
    rowObjs.sort(function (a, b) {
        return (new Date(a.time).getTime() - new Date(new Date(b.time).getTime()));
    })
    for (var j = 0; j < rowObjs.length; j++) {
        myRow = rowObjs[j];
        myRow.probs = [];
        if (myRow.class_id) {
            if (!classIds.includes(myRow.class_id)) {
                myClass = new classObj;
                myClass.id = myRow.class_id;
                myClass.students = [];
                myClass.uniqueUsernames = [];
                myClass.hints = [];
                myClass.hintReceived = false;
                myClass.remediationRequested = false;
                classes.push(myClass);
                myRow.class = myClass;
                classIds.push(myClass.id);
            } else {
                myClass = getComponentById(classes, "id", myClass.id);
                myRow.class = myClass;
            }
            if (myRow.username && myClass.students) {
                if (!myClass.uniqueUsernames.includes(myRow.username)) {
                    myClass.uniqueUsernames.push(myRow.username);
                    myStudent = new student;
                    myStudent.probsArray = [];
                    myStudent.actions = [];
                    myStudent.activities = [];
                    myStudent.uniqueActivityNames = [];
                    myStudent.activitiesIntersection = [];
                    myStudent.activityNames = [];
                    myStudent.id = myRow.username;
                    myStudent.class = myClass;
                    myStudent.hints = [];
                    myStudent.hintReceived = false;
                    myStudent.remediationRequested = false;
                    myClass.students.push(myStudent);
                    students.push(myStudent);
                } else {
                    myStudent = getComponentById(students, "id", myRow.username);
                }
                if (myStudent) {
                    myRow.student = myStudent;
                    try {
                        myRow.index = myStudent.actions.length;
                    } catch (err) {
                        console.log("no student found")
                    }
                    if (myRow.activity) {
                        if (!myStudent.uniqueActivityNames.includes(myRow.activity)) {
                            myStudent.uniqueActivityNames.push(myRow.activity);
                            myActivity = new activity;
                            activities.push(myActivity);
                            myStudent.activities.push(myActivity);
                            myActivity.startTime = new Date(myRow.time).getTime();
                            myActivity.name = myRow.activity;
                            myActivity.actions = [];
                            myActivity.events = [];
                            myActivity.hints = [];
                            myActivity.students = [];
                            myActivity.students.push(myStudent);
                            myActivity.hintReceived = false;
                            myActivity.eventNames = [];
                            myActivity.remediationRequested = false;
                        } else {
                            myActivity = getComponentById(myStudent.activities, "name", myRow.activity);
                        }
                        myRow.activityObj = myActivity;
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
                            if (myStudent.actions[myStudent.actions.length - 1]) {
                                myAction = myStudent.actions[myStudent.actions.length - 1];
                            }
                            myEvent.actions.push(myRow);
                            if (myEvent.name == "Guide-hint-received") {
                                myActivity.hintReceived = true;
                                myStudent.hintReceived = true;
                                myClass.hintReceived = true;
                            } else if (myEvent.name == "Guide-remediation-requested") {
                                myActivity.remediationRequested = true;
                                myStudent.remediationRequested = true;
                                myClass.remediationRequested = true;
                            }
                            //                      addDescription(myRow, myActivity, myEvent);
                            if ((myRow.event == "ITS-Data-Updated") && (myStudent.actions.length > 1)) {
                                try {
                                    var myProbs = getProbs(myRow, myStudent); //Returns a new prob object from the event
                                    if (myProbs) { //If there are new probs
                                        myRow.probs = myProbs; //Add them to the action 
                                        myStudent.probsArray.push(myProbs); //and push them to the student's array of probs
                                    }
                                } catch (err) {
                                    console.log("Problem with getProbs. Error = " + err);
                                }
                            } else if (myStudent.probsArray.length > 0) { //If the event is not a data update and the student's probs array is not empty then the action inherits its probs as the last element in the student's probs array
                                myRow.probs = myStudent.probsArray[myStudent.probsArray.length - 1];
                                for (u = 0; u < myRow.probs.length; u++) { //Set all the probs to unchanged
                                    myRow.probs[u].changed = false;
                                }
                            }
                        }
                        myActivity.actions.push(myRow);
                    }
                    myStudent.actions.push(myRow);
                }
            }
        }
    }
    pruneClasses(myTeacher); //add classes to myTeacher but only if they have more than three students;
    pruneStudents(myClass); //add students to myClass but only if they have more than three activities;
}

function getProbs(myRow) { //Extracts prob objects from data when the event is ITS-Data-Updated. Returns an array of prob objects. If the event is not ITS-Data-Updated, returns null
    var myProbs = [],
        myStudent = myRow.student;
    if (myStudent.actions.length > 1) {
        var previousRow = myRow.student.actions[myRow.student.actions.length - 1]; //Note: this row hasn't been added to the student.actions array yet so the last action in the array is the previous action to this one.
    }
    oldProbs = previousRow.probs,
        data = myRow.parameters.studentModel,
        conceptIds = data.match(/(?<="conceptId"=>")([^"]+)/g),
        currentProbs = data.match(/(?<="probabilityLearned"=>)([^,]+)/g),
        initProbs = data.match(/(?<="L0"=>)([^,]+)/g),
        attempts = data.match(/(?<="totalAttempts"=>)([^,]+)/g);
    for (var i = 0; i < currentProbs.length; i++) {
        myProb = new prob;
        myProb.action = myRow;
        myProb.time = myRow.time;
        myProb.id = conceptIds[i];
        myProb.prob = Math.round(1000 * parseFloat(currentProbs[i])) / 1000;
        myProb.initProb = Math.round(1000 * parseFloat(initProbs[i])) / 1000;
        myProb.attempts = attempts[i];
        myProbs.push(myProb);
    }
    compareProbs(oldProbs, myProbs);
    return myProbs;
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

function getSelectedStudents() { //Starting from the global array "selectedClasses," sets the global array selectedStudents to contain all the students in classes whose checkboxes are checked. Note: students may be duplicated if they are enrolled in more than one class. Erases all columns to the right if no student boxes are checked.
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


function getSelectedActivities() { //Starting from the global array "selectedStudents," sets the global array "selectedActivities" to contain all the activities engaged in by all the students whose checkboxes are checked. Erases all columns to the right if no activity boxes are checked.
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

function showClasses() { //Sets up the classes checkboxes for all classes contained in the uploaded files. Span contains the number of students in each class; onchange runs "showStudents"
    var files = []; //Eventually, an array of file objects that contain the classes and all other fields from that file. For the time being we're reading in only one file at a time so we push classes to files.
    files.push(classes);
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
    makeButtons(files, "id", "students", "checkbox", "classButton", "showStudents()", "Class IDs", classesPara);
}

function showStudents() { //Sets up the students checkboxes which are labeled with the ids of the students. Eventually there will be one checkbox for each student enrolled in at least one of the selected classes. The span fields contain the number of activities engaged in by each student; onchange runs "showActivities"
    var selectedStudents = [], //May not need this.
        myClass,
        myStudents = []; //Will contain all students in the selected classes
    activitiesPara.innerHTML = "";
    eventsPara.innerHTML = "";
    actionsPara.innerHTML = "";
    getSelectedClasses();
    if (selectedClasses.length > 0) {
        for (var j = 0; j < selectedClasses.length; j++) {
            myClass = selectedClasses[j];
            myStudents.push(myClass.students);
        }
        makeButtons(myStudents, "id", "activities", "checkbox", "studentButton", "trackSelectedStudents()", "Student IDs", studentsPara)
    }
}

function showActivities() { //Sets up the activites checkboxes, which are labeled with the names of the intersection of the activities engaged by all the selected students. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
    var intersectingNames = [],
        intersectingActivities = [];
    document.getElementById("probsDiv").style.display = "inline"; //Makes the CSV file and table buttons visible
    //Get all the students, if any, whose boxes have been checked
    getSelectedStudents();
    //Run over the activities fields for those students and collect the intersection of the names of those activities
    intersectingNames = getIntersectingNames(selectedStudents, "activities");
    //Using the intersecting names, find the corresponding activties and return them
    intersectingActivities = getIntersectingObjects(selectedStudents, "activities", intersectingNames);
    //sort the intersection of the activities by start time
    intersectingActivities.sort(function (a, b) {
        return a[0].startTime - b[0].startTime;
    })
    //and make the buttons
    makeButtons(intersectingActivities, "name", "events", "checkbox", "activityButton", "showEvents()", "Activities", activitiesPara);
    showEvents();
}

function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
    selectedEvents = [];
    var names = [],
        eventsByActivity = [];
    getSelectedActivities();
    names = getIntersectingNames(selectedActivities, "events");
    eventsByActivity = getIntersectingObjects(selectedActivities, "events", names); //Returns an array of arrays: for each selected activity all the events whose name field is in the names array.

    makeButtons(eventsByActivity, "name", "actions", "checkbox", "eventButton", "showActions()", "Events", eventsPara)
    showActions();
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

function probsList(myAction) {
    var probs = myAction.probs;
    var newProbs = myAction.newProbs;
    if ((probs.length > 0) && (newProbs.length > 0)) {
        var returnStr = "",
            conceptStr,
            oldProbVal,
            newProbVal,
            maxLength = Math.max(probs.length, newProbs.length);
        compareProbs(probs, newProbs);
        for (var i = 0; i < maxLength; i++) {
            if ((i < probs.length) && (i < newProbs.length)) {
                conceptStr = probs[i].id;
                oldProbVal = probs[i].prob;
                newProbVal = newProbs[i].prob;
                if (newProbs[i].changed) {
                    newProbVal = "<span style=\"color:red\">" + newProbs[i].prob + "</span>";
                }
                returnStr += "For concept ID " + conceptStr + " the prior probability estimate is " + oldProbVal + ", the new probability estimate is " + newProbVal + "<br>";
            } else if ((i < probs.length) && (i >= newProbs.length)) {
                conceptStr = probs[i].id;
                oldProbVal = probs[i].prob;
                returnStr += "For concept ID " + conceptStr + " the prior probability estimate is " + oldProbVal + ",  there is no new probability estimate.<br>";

            } else if ((i >= probs.length) && (i < newProbs.length)) {
                conceptStr = newProbs[i].id
                newProbVal = newProbs[i].prob;
                returnStr += "For concept ID " + conceptStr + " there is no prior probability estimate. The new probability estimate is " + newProbVal + "<br>";
            }
        }
    } else {
        returnStr = "There are no probability estimates for this action.<br>"
    }
    return returnStr;
}