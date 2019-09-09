//Loop over the IDs in objectIds to turn them into objects, then create a column of checkboxes or radio buttons for each object, labeled by the id of that object with the <countField> of the object in parentheses. Color the nameField and countField appropriately. If the buttons are already present and are being replaced, keep track of their checked status and persist it in the new buttons.

function makeButtons(objects, objectIds, counts, type, nameField, name, onchange, title, destination) {
    var string,
        count,
        id,
        statusArray = [];
    //Keep the conceptButton checked when the student changes, if it exists.
    if (name == "conceptButton") {
        //get the checked/notchecked status of the button array so that we can reproduce it when we're done.
        buttons = document.getElementsByName(name);
        if (buttons.length > 0) {
            for (var y = 1; y < buttons.length; y++) {
                myStatus = {
                    id: buttons[y].id,
                    checked: buttons[y].checked
                };
                statusArray.push(myStatus); //Contains all the buttons that are checked.
            }
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
        destination.innerHTML = "<b>" + title + "</b><br><br>";
        destination.innerHTML += "<input type='checkbox' + name = " + name + " onchange='toggleSelectAll(\"" + name + "\");'></input> all/none<br>";
        for (var m = 0; m < objects.length; m++) {
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
        //Restore checked status of concepts button.
        if (name == "conceptButton") {
            var newButtons = document.getElementsByName(name);
            for (var x = 0; x < newButtons.length; x++) {
                newButtons[x].checked = false;
                for (var z = 0; z < statusArray.length; z++) {
    //Check to see if the buttons in the arrays have ids. They won't, for instance, if they are "all/none" buttons.
                    if (newButtons[x].id && statusArray[z].id) {
                        newName = conceptsObj[newButtons[x].id].name;
                        oldName = conceptsObj[statusArray[z].id].name
                        if (newName == oldName) {
                            newButtons[x].checked = statusArray[z].checked;
                        }
                    }
                }
            }
        }
    }
}

    function toggleSelectAll(checkboxName) {
        var checkboxArray = document.getElementsByName(checkboxName);
        if (checkboxArray[0].checked) {
            for (var i = 0; i < checkboxArray.length - 1; i++) {
                checkboxArray[i + 1].checked = true;
            }
        } else {
            for (var j = 0; j < checkboxArray.length - 1; j++) {
                checkboxArray[j + 1].checked = false;
            }
        }
        setSelectedObjects();
        showTeachers();
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
        showClasses();
    }


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

    function showStudents() { //Sets up the students checkboxes which are labeled with the ids of the students. Eventually there will be one checkbox for each student enrolled in at least one of the selected classes. The span fields contain the number of concepts engaged in by each student; onchange runs "showConcepts"

        var theseStudents = [], //all student objects of selected classes
            theseStudentIds = [], //all student ids of selected classes
            counts = [];
            setSelectedObjects();
        if (selectedClasses.length == 0) {
            studentsPara.innerHTML = "";
            activitiesPara.innerHTML = "";
            eventsPara.innerHTML = "";
            actionsPara.innerHTML = "";
            graphDiv.innerHTML = "";
        } else {
            for (var i = 0; i < selectedClasses.length; i++) {
                myClass = selectedClasses[i];
                for (var j = 0; j < myClass.studentIds.length; j++) {
                    myStudentId = myClass.studentIds[j];
                    myStudent = myClass.studentsObj[myStudentId];
                    myCount = myStudent.activityIds.length;
                    theseStudentIds.push(myStudentId);
                    theseStudents.push(myStudent);
                    counts.push(myCount);
                }
            }
            makeButtons(theseStudents, theseStudentIds, counts, "radio", "id", "studentButton", "showConcepts()", "Student IDs", studentsPara);
        }
        showConcepts();
    }

    function showConcepts() {
        //Sets up the concepts checkboxes, which are labeled with the names of the union of the activities engaged by all the selected students. Span fields contain the number of activities that contain probability learned fields for that concept; onchange runs "showActivities"

        var conceptNamesByStudent = [],
            unionConceptNames = [], //Names are repeated from student to student
            unionConceptIds = [], //Needed to identify the concept objects globally
            unionConcepts = [], //Will contain the union of the concept objects
            counts = [];
        setSelectedObjects();
        if (selectedStudents.length == 0) {
            conceptsPara.innerHTML = "";
            activitiesPara.innerHTML = "";
            eventsPara.innerHTML = "";
            actionsPara.innerHTML = "";
            graphDiv.innerHTML = "";
            csvDiv.style.display = "none";
        } else {
            csvDiv.style.display = "inline"; //Run over the concepts fields for those students and collect the union of the names of those activities
            for (var i = 0; i < selectedStudents.length; i++) {
                myStudent = selectedStudents[i];
                if (!myStudent.conceptNames) {
                    console.log("Student " + myStudent.id + " has no conceptNames field.");
                }
                if (myStudent.conceptNames.length > 1) {
                    conceptNamesByStudent[i] = myStudent.conceptNames;
                    conceptNamesByStudent[i].sort(function (a, b) {
                        var x = a.toLowerCase();
                        var y = b.toLowerCase();
                        if (x < y) {
                            return -1;
                        }
                        if (x > y) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }
            unionConceptNames = conceptNamesByStudent[0];
            //Start with the first element and iteratively compare to all the others

            for (var j = 1; j < conceptNamesByStudent.length; j++) { //start with the second element
                unionConceptNames = union(unionConceptNames, conceptNamesByStudent[j]);
            }
            //Get the concepts corresponding to the union of the concept names (needed for the buttons)
            for (var k = 0; k < unionConceptNames.length; k++) {
                try {
                    unionConcepts[k] = myStudent.concepts[unionConceptNames[k]];
                    unionConceptIds[k] = unionConcepts[k].id;
                    counts[k] = unionConcepts[k].countChangedProbs;
                } catch (err) {
                    console.log(err);
                }
            }
            makeButtons(unionConcepts, unionConceptIds, counts, "radio", "name", "conceptButton", "showConceptDescription(this.id);showActivities()", "Concepts", conceptsPara);
            setSelectedObjects();
            if (selectedConcepts.length == 1) {
                makeGraph(selectedConcepts);
            } else {
                graphDiv.innerHTML = "";
            }
        }
    }

    function showActivities() { //Sets up the activites checkboxes, which are labeled with the names of the intersection of the activities engaged by all the selected students. Span fields contain the number of events executed within each activity; onchange runs "showEvents"
        var tableButton = document.getElementById("tableButton"),
            csvDiv = document.getElementById("csvDiv"),
            probTable = document.getElementById("probTable");
        var intersectingActivityNames = [],
            intersectingActivityIds = [],
            intersectingActivities = [],
            activityNamesByStudent = [],
            counts = [];
        setSelectedObjects();
        if (selectedConcepts.length == 0) {
            activitiesPara.innerHTML = "";
            eventsPara.innerHTML = "";
            actionsPara.innerHTML = "";
            csvDiv.style.display = "none";
            probTable.style.display = "none";
            graphDiv.innerHTML = "";
        } else {
            csvDiv.style.display = "inline";
            //Run over the activities fields for those students and collect the intersection of the names of those activities
            for (var i = 0; i < selectedStudents.length; i++) {
                myStudent = selectedStudents[i];
                activityNamesByStudent[i] = myStudent.activityNames;
                activityNamesByStudent[i].sort(function (a, b) {
                    var x = a.toLowerCase();
                    var y = b.toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                });
            }
            intersectingActivityNames = activityNamesByStudent[0]; //Start with the first element and iteratively compare to all the others in names

            for (var j = 1; j < activityNamesByStudent.length; j++) { //start with the second element
                intersectingActivityNames = intersection(intersectingActivityNames, activityNamesByStudent[j]);
            }
            for (var k = 0; k < intersectingActivityNames.length; k++) {
                intersectingActivities[k] = myStudent.activitiesByName[intersectingActivityNames[k]];
            }
            //Sort activities by increasing start time;
            intersectingActivities.sort(function (a, b) {
                return a.startTime - b.startTime;
            });
            //And set up the activityIds array
            for (var l = 0; l < intersectingActivities.length; l++) {
                intersectingActivityIds.push(intersectingActivities[l].id);
                counts[l] = intersectingActivities[l].eventNames.length;
            }

            makeButtons(intersectingActivities, intersectingActivityIds, counts, "checkbox", "name", "activityButton", "showEvents()", "Activities", activitiesPara);
            makeGraph(selectedConcepts);
            showEvents();
        }
    }

    function showEvents() { //Sets up the events checkboxes. Span contains the number of actions executed within each event; onchange runs "showActions"
        var intersectingEventNames = [],
            intersectingEventIds = [],
            intersectingEvents = [],
            eventNamesByStudent = [],
            counts = [];
        setSelectedObjects();
        if (selectedActivities.length == 0) {
            eventsPara.innerHTML = "";
            actionsPara.innerHTML = "";
        } else {
            for (var i = 0; i < selectedActivities.length; i++) {
                myActivity = selectedActivities[i];
                eventNamesByStudent[i] = myActivity.eventNames;
                eventNamesByStudent[i].sort(function (a, b) {
                    var x = a.toLowerCase();
                    var y = b.toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                });
            }
            intersectingEventNames = eventNamesByStudent[0]; //Start with the first element and iteratively compare to all the others in names
            for (var j = 1; j < eventNamesByStudent.length; j++) { //start with the second element
                intersectingEventNames = intersection(intersectingEventNames, eventNamesByStudent[j]);
            }
            for (var k = 0; k < intersectingEventNames.length; k++) {
                intersectingEvents[k] = myActivity.eventsByName[intersectingEventNames[k]];
                intersectingEventIds.push(intersectingEvents[k].id);
                counts.push(intersectingEvents[k].actions.length);
            }
            makeButtons(intersectingEvents, intersectingEventIds, counts, "checkbox", "name", "eventButton", "showActions()", "Events", eventsPara);
        }
        showActions();
    }

    function showActions() {
        var acts = [],
            myEvent,
            myFields,
            myActions,
            myAction;

        setSelectedObjects();
        if (selectedEvents.length == 0) {
            actionsPara.innerHTML = "";
        } else if (selectedStudents.length != 1) {
            actionsPara.innerHTML = "<b>Actions can only be shown for one student at a time.</b>";
        } else {
            actionsPara.innerHTML = "<b>Actions</b><br>";
            acts = [];
            for (var i = 0; i < selectedEvents.length; i++) {
                myEvent = selectedEvents[i];
                for (var j = 0; j < myEvent.actions.length; j++) {
                    acts.push(myEvent.actions[j]);
                }
            }
            acts.sort(function (a, b) {
                return a.index - b.index;
            });
            for (var k = 0; k < acts.length; k++) {
                myAction = acts[k];
                myFields = [];
                if (myAction.parameters) {
                    myParameters = myAction.parameters;
                    myFields = Object.getOwnPropertyNames(myParameters);
                }
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
        } else {
            tableSpan.textContent = "Show table";
        }
        makeProbTable();
    }

    //Check the tableSpan text field. If it displays "Show table" hide the table and the div; otherwise set the div and the table to "inline"
    function makeProbTable() {
        var div = document.getElementById("probDiv");
        var table = document.getElementById("probTable");
        var body = document.getElementById("probTableBody");
        clear(body);
        var tableSpan = document.getElementById("tableSpan");
        if (tableSpan.textContent == "Show table") {
            div.style.display = "none";
            table.style.display = "none";
        } else {
            div.style.display = "inline";
            table.style.display = "inline";
        }
        var ss = [];
        setSelectedObjects();
        ss = selectedStudents;
        for (var i = 0; i < ss.length; i++) {
            myStudent = ss[i];
            var actNames = myStudent.activityNames;
            if (actNames.length > 0) {
                actNames.sort(function (a, b) {
                    var acts = myStudent.activitiesByName;
                    return acts[a].startTime - acts[b].startTime;
                });
                for (var j = 0; j < actNames.length; j++) {
                    myActivityName = actNames[j];
                    myActivity = myStudent.activitiesByName[myActivityName];
                    myEvent = myActivity.eventsByName["ITS-Data-Updated"];
                    if (myEvent) { //Some activities – e.g., the tutorial – don't have events
                        myActions = myEvent.actions;
                        for (var k = 0; k < myActions.length; k++) {
                            myAction = myActions[k];
                            addCSVRow(myStudent, myActivity, myEvent, myAction);
                        }
                    }
                }
            }
        }
    }

    function addCSVRow(myStudent, myActivity, myEvent, myAction) {
        var index = myAction.index,
            myClass = myStudent.class,
            myTeacher = myClass.teacher,
            probDiv = document.getElementById("probDiv"),
            probTableBody = document.getElementById("probTableBody");
        var probRow = document.createElement("tr");
        var teacherCell = document.createElement("td");
        var classCell = document.createElement("td");
        var studentCell = document.createElement("td");
        var dateCell = document.createElement("td");
        var timeCell = document.createElement("td");
        var challengeCell = document.createElement("td");
        var indexCell = document.createElement("td");
        var priorActionCell = document.createElement("td");
        var LG99A = document.createElement("td");
        var LG1A3 = document.createElement("td");
        var LG1C2a = document.createElement("td");
        var LG1C2b = document.createElement("td");
        var LG1C2c = document.createElement("td");
        var LG1C2d = document.createElement("td");
        var LG1C2e = document.createElement("td");
        var LG1C3 = document.createElement("td");
        var LG1C4a = document.createElement("td");
        var LG1C4b = document.createElement("td");
        var LG1C4c = document.createElement("td");
        var LG1C4d = document.createElement("td");
        var LG1C4e = document.createElement("td");
        var LG1P1 = document.createElement("td");
        var LG1P2 = document.createElement("td");
        var LG1P3 = document.createElement("td");
        var LG2P1 = document.createElement("td");
        var LG3P1 = document.createElement("td");
        var LG3P2 = document.createElement("td");
        var LG3P3 = document.createElement("td");
        var LG3P4 = document.createElement("td");

        LG99A.id = "LG99.A" + index;
        LG1A3.id = "LG1.A3" + index;
        LG1C2a.id = "LG1.C2a" + index;
        LG1C2b.id = "LG1.C2b" + index;
        LG1C2c.id = "LG1.C2c" + index;
        LG1C2d.id = "LG1.C2d" + index;
        LG1C2e.id = "LG1.C2e" + index;
        LG1C3.id = "LG1.C3" + index;
        LG1C4a.id = "LG1.C4a" + index;
        LG1C4b.id = "LG1.C4b" + index;
        LG1C4c.id = "LG1.C4c" + index;
        LG1C4d.id = "LG1.C4d" + index;
        LG1C4e.id = "LG1.C4e" + index;
        LG1P1.id = "LG1.P1" + index;
        LG1P2.id = "LG1.P2" + index;
        LG1P3.id = "LG1.P3" + index;
        LG2P1.id = "LG2.P1" + index;
        LG3P1.id = "LG3.P1" + index;
        LG3P2.id = "LG3.P2" + index;
        LG3P3.id = "LG3.P3" + index;
        LG3P4.id = "LG3.P4" + index;

        LG1A3.innerHTML = "";
        LG1C2a.innerHTML = "";
        LG1C2b.innerHTML = "";
        LG1C2c.innerHTML = "";
        LG1C2d.innerHTML = "";
        LG1C2e.innerHTML = "";
        LG1C3.innerHTML = "";
        LG1P1.innerHTML = "";
        LG1P2.innerHTML = "";
        LG1P3.innerHTML = "";
        LG1C4a.innerHTML = "";
        LG1C4b.innerHTML = "";
        LG1C4c.innerHTML = "";
        LG1C4d.innerHTML = "";
        LG1C4e.innerHTML = "";
        LG2P1.innerHTML = "";
        LG3P1.innerHTML = "";
        LG3P2.innerHTML = "";
        LG3P3.innerHTML = "";
        LG3P4.innerHTML = "";

        probRow.appendChild(teacherCell);
        probRow.appendChild(classCell);
        probRow.appendChild(studentCell);
        probRow.appendChild(dateCell);
        probRow.appendChild(timeCell);
        probRow.appendChild(challengeCell);
        probRow.appendChild(indexCell);
        probRow.appendChild(priorActionCell);
        probRow.appendChild(LG99A);
        probRow.appendChild(LG1P1);
        probRow.appendChild(LG1P2);
        probRow.appendChild(LG1A3);
        probRow.appendChild(LG1C2a);
        probRow.appendChild(LG1C2b);
        probRow.appendChild(LG1C2c);
        probRow.appendChild(LG1C2d);
        probRow.appendChild(LG1C2e);
        probRow.appendChild(LG1C3);
        probRow.appendChild(LG1P3);
        probRow.appendChild(LG1C4a);
        probRow.appendChild(LG1C4b);
        probRow.appendChild(LG1C4c);
        probRow.appendChild(LG1C4d);
        probRow.appendChild(LG1C4e);
        probRow.appendChild(LG2P1);
        probRow.appendChild(LG3P1);
        probRow.appendChild(LG3P2);
        probRow.appendChild(LG3P3);
        probRow.appendChild(LG3P4);
        probTableBody.appendChild(probRow);

        teacherCell.innerHTML = myTeacher.id;
        classCell.innerHTML = myClass.id;
        studentCell.innerHTML = myStudent.id;
        dateCell.innerHTML = myAction.time.split("T")[0];
        timeCell.innerHTML = myAction.time.match(/(?<=T)([^Z]+)/)[0];
        challengeCell.innerHTML = myActivity.name;
        indexCell.innerHTML = myAction.index;
        var priorAction = myStudent.actions[index - 1];
        priorActionCell.innerHTML = priorAction.event;
        if (myAction.probs.length > 0) {
            for (var j = 0; j < myAction.probs.length; j++) {
                var myProb = myAction.probs[j];
                document.getElementById(myProb.id + index).innerHTML = myProb.value;
            }
        }
    }

    function tableToCSV(headerRow, body) { //Converts an HTML table to a csv file
        var returnCSV = "";
        var bodyRow;
        var headerCell;
        var text;
        var contents;
        for (var i = 0; i < headerRow.children.length; i++) {
            headerCell = headerRow.children[i];
            text = headerCell.innerText;
            contents = text.match(/[^"^\s]+/)[0];
            returnCSV += contents;
            if (i != headerRow.children.length - 1) {
                returnCSV += ",";
            } else {
                returnCSV += "\n";
            }
        }
        for (var j = 0; j < body.children.length; j++) {
            bodyRow = body.children[j];
            for (var k = 0; k < bodyRow.children.length; k++) {
                contents = bodyRow.children[k].innerText;
                returnCSV += contents;
                if (k != bodyRow.children.length - 1) {
                    returnCSV += ",";
                } else {
                    returnCSV += "\n";
                }
            }
        }
        return (returnCSV);
    }

    function clear(element) { //Have to work backwards otherwise the loop doesn't work!
        var children = element.childNodes;
        if (children.length > 3) {
            for (var i = children.length; i > 0; i--) {
                element.removeChild(children[i - 1]);
            }
        }
    }

    function downloadFile() {
        var nameInput = document.getElementById("csvFileName");
        var fileName = nameInput.value;
        var header = document.getElementById("probHeaderRow");
        var table = document.getElementById("probTable");
        var body = document.getElementById("probTableBody");
        makeProbTable();
        csvFile = tableToCSV(header, body);
        saveData()(csvFile, fileName);
    }

    function saveData(data, name) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var blob = new Blob([data], {
                type: "text/csv;encoding:utf-8"
            });
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }