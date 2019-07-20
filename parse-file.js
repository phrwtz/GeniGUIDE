//Global variables
var downloadFlag = false; //Set true by csvButton onclick.
var teachersArray = []; //filled by openFiles function when files are read.
var teachersObj = new Object();
var teacherIds = [];
var teachersPara = document.getElementById("teachers");
var classesPara = document.getElementById("classes");
var studentsPara = document.getElementById("students");
var activitiesPara = document.getElementById("activities");
var eventsPara = document.getElementById("events");
var fieldsPara = document.getElementById("fields");
var actionsPara = document.getElementById("actions");
var hintsTable = document.getElementById("hintsTable");


function filter() {
    var analyzeButton = document.getElementById("analyzeButton");
    for (var i = 0; i < teachersArray.length; i++) {
        myTeacher = teachersArray[i];
        var t = parseJSON(myTeacher); //Returns "fully dressed" teacher object
        delete t.data; //Don't need the (huge!) data property any more.
        teachersObj[t.id] = t;
        console.log("Data for file " + myTeacher.id + " parsed.");
        findFutureProbs();
        console.log("Future probs found.");
    }
    analyzeButton.disabled = "true";
    showTeachers();
    //    MakeCSVFile();
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
    })
    myTeacher.classesObj = new Object;
    myTeacher.classIds = [];
    for (var j = 0; j < rowObjs.length; j++) {
        myRow = rowObjs[j];
        myRow.probs = [];
        if (myRow.class_id) { //addClass;
            classId = myRow.class_id;
            if (!myTeacher.classesObj[classId]) {
                myClass = new Object;
                myClass.studentsObj = new Object;
                myClass.studentIds = [];
                myClass.id = classId;
                myClass.teacher = myTeacher;
                myClass.hints = [];
                myClass.hintReceived = false;
                myClass.remediationRequested = false;
                myTeacher.classesObj[classId] = myClass;
                myTeacher.classIds.push(classId);
            } else {
                myClass = myTeacher.classesObj[classId];
            }
        } 
        if (myRow.username) { // add student
            classId = myRow.class_id;
            myClass = myTeacher.classesObj[classId];
            studentId = myRow.username;
            if (!myClass.studentsObj[studentId]) {
                myStudent = new Object;
                myStudent.id = studentId;
                myStudent.class = myClass;
                myStudent.actions = [];
                myStudent.probsArray = [];
                myStudent.activitiesObj = new Object;
                myStudent.activityIds = [];
                myStudent.teacher = myTeacher;
                myStudent.class = myClass;
                myStudent.hints = [];
                myStudent.hintReceived = false;
                myStudent.remediationRequested = false;
                myClass.studentsObj[studentId] = myStudent;
                myClass.studentIds.push(studentId);
            } else {
                myStudent = myClass.studentsObj[studentId];
            }
            myRow.student = myStudent;
        }
        if (myRow.activity) {
            classId = myRow.class_id;
            studentId = myRow.student.id;
            activityId = myRow.activity;
            myClass = myTeacher.classesObj[classId];
            myStudent = myClass.studentsObj[studentId];
            if (!myStudent.activitiesObj[activityId]) {
                myActivity = new Object;
                myActivity.id = activityId;
                myStudent.activitiesObj[activityId] = myActivity;
                myStudent.activityIds.push(activityId);
                myActivity.eventsObj = new Object;
                myActivity.eventIds = [];
                myActivity.startTime = new Date(myRow.time).getTime();
                myActivity.actions = [];
                myActivity.hints = [];
                myActivity.hintReceived = false;
                myActivity.remediationRequested = false;
            } else {
                myActivity = myStudent.activitiesObj[activityId];
            }
        }
        if (myRow.activity && myRow.event) { // add event (but some rows have events but no activity. Ignore those.)
            classId = myRow.class_id;
            studentId = myRow.student.id;
            activityId = myRow.activity;
            eventId = myRow.event.replace(/ /g, "-");
            myClass = myTeacher.classesObj[classId];
            myStudent = myClass.studentsObj[studentId];
            myActivity = myStudent.activitiesObj[activityId];
            if (!myActivity.eventsObj[eventId]) {
                myEvent = new Object;
                myEvent.id = eventId;
                myActivity.eventsObj[eventId] = myEvent;
                myActivity.eventIds.push(eventId);
                myEvent.actions = [];
            } else {
                myEvent = myActivity.eventsObj[eventId];
            }
            myEvent.actions.push(myRow);
            if ((myEvent.id != "Guide-alert-received") && (myEvent.id != "Modal-dialog-shown") && (myEvent.id != "Notifications-shown")) {
            myRow.index = myStudent.actions.length;
            myStudent.actions.push(myRow);
            }
            if (eventId == "Guide-hint-received") {
                myActivity.hintReceived = true;
                myStudent.hintReceived = true;
                myClass.hintReceived = true;
            } else if (eventId == "Guide-remediation-requested") {
                myActivity.remediationRequested = true;
                myStudent.remediationRequested = true;
                myClass.remediationRequested = true;
            } else if ((eventId == "ITS-Data-Updated") && (myStudent.actions.length > 1)) {
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
    pruneData(myTeacher); //add classes to myTeacher but only if they have more than three students. Add students with more than three activities to those classes.
    teachersObj[myTeacher.id] = myTeacher
    return myTeacher;
}

function getProbs(myRow) { //Extracts prob objects from data when the event is ITS-Data-Updated. Returns an array of prob objects. If the event is not ITS-Data-Updated, returns null
    var myProbs = [],
        myProb,
        myStudent = myRow.student;
    if (myStudent.actions.length > 1) {
        var previousRow = myRow.student.actions[myRow.student.actions.length - 2];
    }
    var oldProbs = previousRow.probs,
        data = myRow.parameters.studentModel,
        conceptIds = data.match(/(?<="conceptId"=>")([^"]+)/g),
        currentProbs = data.match(/(?<="probabilityLearned"=>)([^,]+)/g),
        initProbs = data.match(/(?<="L0"=>)([^,]+)/g),
        attempts = data.match(/(?<="totalAttempts"=>)([^,]+)/g);
    for (var i = 0; i < currentProbs.length; i++) {
        myProb = new Object;
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