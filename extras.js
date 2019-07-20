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
        destination.innerHTML += "<input type='checkbox' + name = " + name + " onchange='toggleSelectAll(\"" + name + "\")'></input> all/none<br>"
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
}
