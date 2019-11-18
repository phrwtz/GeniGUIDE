// Global variables
var teachersArray = []; //filled by openFiles function when files are read.
var teacherIds = [];
var ppStudents = []; //An array of student objects with ids and pre and post scores (obtained from Danielle's file). Note: not all students are contained in this array).
var teachersPara = document.getElementById("teachers");
var classesPara = document.getElementById("classes");
var studentsPara = document.getElementById("students");
var conceptsPara = document.getElementById("concepts");
var activitiesPara = document.getElementById("activities");
var eventsPara = document.getElementById("events");
var fieldsPara = document.getElementById("fields");
var actionsPara = document.getElementById("actions");
var infoPara = document.getElementById("infoPara");
var graphDiv = document.getElementById("graphDiv");

var conceptDescriptions = [];
var selectedConceptName;
var showAllProbs = false;

var teachers = [],
    teacherIds = [],
    classes = [],
    classIds = [],
    students = [],
    studentIds = [],
    activities = [],
    activityIds = [],
    events = [],
    eventIds = [];

var selectedTeachers = [],
    selectedTeacherIds = [],
    selectedClasses = [],
    selectedClassIds = [],
    selectedStudents = [],
    selectedStudentIds = [],
    selectedConcepts = [],
    selectedConceptIds = [],
    selectedActivities = [],
    selectedActivityIds = [],
    selectedEvents = [],
    selectedEventIds;

var teachersObj = Object(),
    selectedTeachersObj = new Object(),
    classesObj = new Object(),
    selectedClassesObj = new Object(),
    studentsObj = new Object(),
    selectedStudentsObj = new Object(),
    conceptsObj = new Object(),
    selectedConceptsObj = new Object(),
    activitiesObj = new Object(),
    selectedActivitiesObj = new Object(),
    eventsObj = new Object(),
    selectedEventsObj = new Object(),
    actionsObj = new Object();

function filter() {
    var analyzeButton = document.getElementById("analyzeButton");
    var chalFilter = document.getElementById("chalFilter");
    for (var i = 0; i < teachersArray.length; i++) {
        var myTeacher = teachersArray[i];
        myTeacher.name = teachersArray[i].id;
        var t = parseJSON(myTeacher); //Returns "fully dressed" and pruned teacher object
        delete t.data; //Don't need the (huge!) data property any more.
        teachersObj[t.id] = t;
        teacherIds.push(t.id);
        console.log("Data for file " + myTeacher.id + " parsed.");
        //     findFutureProbs();
        //     console.log("Future probs found.");
    }
    conceptDescriptions = reportConceptData();
    for (var j = 0; j < studentIds.length; j++) {
        createConceptsArray(studentIds[j]);
    }
    console.log("Concepts added to students.");
    analyzeButton.style.display = "none";
    document.getElementById("CSVfile").style.display = "block";document.getElementById("toggleChangesButton").style.display = "inline";
    document.getElementById("reversalsButton").style.display = "inline";
    document.getElementById("singleStudentChalButton").style.display = "none";
    showConcepts();
    showTeachers();
    summarizeHints(students);
}


//This function takes a JSON file and turns it into an array of objects then identifies classes, students, activities, events, and actions.
function parseJSON(myTeacher) {
    //These objects are confined to the parseJSON function. They will be purged and added to the appropriate object after parsing is complete.
    var rowObjs = [],
        myRow,
        myClass,
        myStudent,
        myActivity,
        myEvent,
        classId,
        studentId,
        activityId,
        eventId,
        rowObjs = JSON.parse(myTeacher.data);
    rowObjs.sort(function (a, b) {
        return (new Date(a.time).getTime() - new Date(new Date(b.time).getTime()));
    });
    myTeacher.classesObj = new Object();
    myTeacher.studentsObj = new Object();
    myTeacher.studentIds = [];
    teachers.push(myTeacher);
    myTeacher.classIds = [];
    for (var j = 0; j < rowObjs.length; j++) {
        myRow = rowObjs[j];
        myRow.probs = [];
        if (myRow.class_id) { //addClass;
            classId = myRow.class_id;
            if (!myTeacher.classesObj[classId]) {
                myClass = new Object();
                myClass.studentsObj = new Object();
                myClass.studentIds = [];
                myClass.id = classId;
                myClass.teacher = myTeacher;
                myClass.hints = [];
                myClass.hintReceived = false;
                myClass.remediationRequested = false;
                myTeacher.classesObj[classId] = myClass;
                myTeacher.classIds.push(classId);
                classesObj[classId] = myClass;
                classIds.push(myClass.id);
            } else {
                myClass = myTeacher.classesObj[classId];
            }
        }
        if (myRow.username) { // add student
            classId = myRow.class_id;
            myClass = myTeacher.classesObj[classId];
            studentId = myRow.username;
            if (!myClass.studentsObj[studentId]) {
                myStudent = new Object();
                myStudent.id = studentId;
                myStudent.class = myClass;
                myStudent.actions = [];
                myStudent.probsArray = [];
                myStudent.activitiesObj = new Object();
                myStudent.activitiesByName = new Object();
                myStudent.activityIds = [];
                myStudent.activityNames = [];
                myStudent.teacher = myTeacher;
                myStudent.class = myClass;
                myStudent.hints = [];
                myStudent.hintReceived = false;
                myStudent.remediationRequested = false;
                myClass.studentsObj[studentId] = myStudent;
                myTeacher.studentsObj[studentId] = myStudent;
                myTeacher.studentIds.push(myStudent.id);
                myClass.studentIds.push(myStudent.id);
                studentsObj[myStudent.id] = myStudent;
                studentIds.push(myStudent.id);
                students.push(myStudent);
            } else {
                myStudent = myClass.studentsObj[studentId];
            }
            myRow.student = myStudent;
            if (myRow.activity) {
                classId = myRow.class_id;
                studentId = myRow.student.id;
                activityName = myRow.activity;
                activityId =
                    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                myClass = myTeacher.classesObj[classId];
                myStudent = myClass.studentsObj[studentId];
                if (!myStudent.activitiesByName[activityName]) {
                    myActivity = new Object();
                    myActivity.id = activityId;
                    myActivity.name = activityName;
                    myActivity.eventsObj = new Object();
                    myActivity.eventsByName = new Object();
                    myActivity.eventIds = [];
                    myActivity.eventNames = [];
                    myActivity.startTime = new Date(myRow.time).getTime();
                    myActivity.actions = [];
                    myActivity.hints = [];
                    myActivity.hintReceived = false;
                    myActivity.remediationRequested = false;
                    activityIds.push(activityId);
                    activitiesObj[activityId] = myActivity;
                    myStudent.activitiesObj[activityId] = myActivity;
                    myStudent.activitiesByName[activityName] = myActivity;
                    myStudent.activityNames.push(activityName);
                    myStudent.activityIds.push(activityId);

                } else {
                    myActivity = myStudent.activitiesObj[activityName];
                }
            }
            if (myRow.activity && myRow.event) {
                var eventName = myRow.event.replace(/ /g, "-");
                if ((eventName != "Guide-alert-received") && (eventName != "Modal-dialog-shown") && (eventName != "Notifications-shown") && (eventName != "@@router/LOCATION_CHANGE")) {
                    classId = myRow.class_id;
                    studentId = myRow.student.id;
                    activityId = myRow.activity;
                    eventId =
                        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    myClass = myTeacher.classesObj[classId];
                    myStudent = myClass.studentsObj[studentId];
                    myActivity = myStudent.activitiesByName[activityName];
                    if (!myActivity.eventsByName[eventName]) {
                        myEvent = new Object();
                        myEvent.actions = [];
                        myEvent.actionNames = [];
                        myEvent.id = eventId;
                        myEvent.name = eventName;
                        eventsObj[eventName] = myEvent;
                        eventIds.push(eventId);
                        eventsObj[eventId] = myEvent;
                        myActivity.eventsObj[eventId] = myEvent;
                        myActivity.eventsByName[eventName] = myEvent;
                        myActivity.eventIds.push(eventId);
                        myActivity.eventNames.push(eventName);
                    } else {
                        myEvent = myActivity.eventsByName[eventName];
                    }
                    if (eventName == "Navigated") {
                        myActivity.route = myRow.parameters.route;
                    }
                    myEvent.actions.push(myRow);
                    //            console.log("student = " + myStudent.id + ", activity = " + myActivity.name + ", event = " + myEvent.name + " logging an action. Total actions for this event = " + myEvent.actions.length + ".");
                    myRow.index = myStudent.actions.length;
                    myStudent.actions.push(myRow);
                    myRow.unixTime = new Date(myRow.time).getTime();
                    if (myEvent.name == "Guide-hint-received") {
                        myActivity.hintReceived = true;
                        myStudent.hintReceived = true;
                        myClass.hintReceived = true;
                        myStudent.hints.push(parseHint(myRow));
                    } else if (myEvent.name == "Guide-remediation-requested") {
                        myActivity.remediationRequested = true;
                        myStudent.remediationRequested = true;
                        myClass.remediationRequested = true;
                    } else if ((myEvent.name == "ITS-Data-Updated") && (myStudent.actions.length > 1)) {
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
            }
        }
    } //Next rowObj
    pruneData(myTeacher); //add classes to myTeacher but only if they have more than three students. Add students with more than three activities to those classes.
    return myTeacher;
}

function getProbs(myRow, myStudent) { //Extracts prob objects from data when the event is ITS-Data-Updated. Returns an array of prob objects. If the event is not ITS-Data-Updated, returns null
    var myProbs = [],
        myProb;
    data = myRow.parameters.studentModel,
        conceptIds = data.match(/(?<="conceptId"=>")([^"]+)/g),
        currentProbs = data.match(/(?<="probabilityLearned"=>)([^,]+)/g),
        initProbs = data.match(/(?<="L0"=>)([^,]+)/g),
        attempts = data.match(/(?<="totalAttempts"=>)([^,]+)/g);
    for (var i = 0; i < currentProbs.length; i++) {
        myProb = new Object();
        myProb.action = myRow;
        myProb.time = myRow.time;
        myProb.id = conceptIds[i];
        myProb.value = Math.round(1000 * parseFloat(currentProbs[i])) / 1000;
        myProb.initValue = Math.round(1000 * parseFloat(initProbs[i])) / 1000;
        myProb.attempts = attempts[i];
        myProbs.push(myProb);
    }
    return myProbs;
}



//Each student gets a "concepts" object that contains a bunch of concepts for which the student has probability learned values. Concepts are objects that have a name (e.g., "LG3.P1") and a unique id (so that they can be identified across students) by which they are designated. They contain an array of all their changed probability values and another for all the activities in which those changed probabilties appear. They also have a student property identifying the student to whom they apply.

function createConceptsArray(id) {
    try {
        myStudent = studentsObj[id];
        myStudent.concepts = [];
        myStudent.conceptNames = [];
    } catch (err) {
        console.log("no student with id " + id);
    }
    for (var j = 0; j < myStudent.probsArray.length; j++) {
        for (var k = 0; k < myStudent.probsArray[j].length; k++) {
            myProb = myStudent.probsArray[j][k];
            //If the concept id has not been seen before for this student, we make a new concept object with this id and set up the activities and probs fields as empty arrays.
            if (!myStudent.conceptNames.includes(myProb.id)) {
                myConcept = new Object();
                myConcept.id =
                    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                myConcept.name = myProb.id;
                myConcept.student = myStudent;
                myConcept.activities = [];
                myConcept.probObjs = [];
                myConcept.changedProbObjs = [];
                myConcept.probObjs.push(myProb);
                myConcept.changedProbObjs.push(myProb);
                myConcept.countProbs = 1;
                myConcept.countChangedProbs = 1;
                myStudent.concepts[myProb.id] = myConcept;
                conceptsObj[myConcept.id] = myConcept;
                myStudent.conceptNames.push(myConcept.name);
            } else {
                myConcept = myStudent.concepts[myProb.id];
            }
            //If the activity is new we push it onto the activities array for this concept,
            if (!myConcept.activities.includes(myProb.action.activity)) {
                myConcept.activities.push(myProb.action.activity);
            }
            //and if this is not the first probability for this concept we push it to myConcept.probObjs. If the probability for this concept has changed since the last one, we push this prob object to myConcept.changedProbObjs and increment the count of changed probs.
            if (myConcept.probObjs.length > 0) {
                lastProbValue = myConcept.probObjs[myConcept.probObjs.length - 1].value;
                if (lastProbValue != myProb.value) {
                    myConcept.changedProbObjs.push(myProb);
                    myConcept.countChangedProbs++;
                }
                myConcept.probObjs.push(myProb);
                myConcept.countProbs++;
                var values = [];
                for (var kk = 0; kk < myConcept.changedProbObjs.length; kk++) {
                    values.push(myConcept.changedProbObjs[kk].value);
                }
                myConcept.reversals = countReversals(values);
            }
        }
    }
}