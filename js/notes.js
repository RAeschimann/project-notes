// GUI-functions start

function goto(url) {
    window.location.replace(url);
}

function changeSkin() {
    var style = $("#skins").val();
    console.log(style +" from dom");

    // store in session
    sessionStorage.setItem("skin_style", style);

    applySkin();
}

function applySkin(){
    var style = "";
    if (sessionStorage.getItem('skin_style')){
        style = sessionStorage.getItem('skin_style');
    } else {
        style = $("#skins").val();
    }

    if (style) {
        $('#skin-css').attr('href', 'css/' + style + '.css');
    }
}


function renderNotes(notes) {

    var renderNotesHTMLTemplate = Handlebars.compile($("#notes-template").html());
    $("#displayNotes").html(renderNotesHTMLTemplate(notes));
}



// ToDo: avoid handlebars errors in edit mode
Handlebars.registerHelper('prettyDateFormat', function (date) {

    // ToDo: are there any libs for such pretty date formats?
    var dateStr;
    if (!date) {
        dateStr = "Irgendwann";
    } else {
        // ToDo: check for today and this week
        dateStr = date;
    }
    return dateStr;
});

Handlebars.registerHelper('setStatus', function (isFinished) {
    var checked = (isFinished) ? "checked" : "";
    return checked;
});


function notesClickEventHandler(event) {

    var action = event.target.getAttribute("data-action");
    var id = event.target.closest("li").getAttribute("id");

    if (action === "edit") {
        editNote(id);
        return;
    }
    if (action === "finished") {
        alert("ToDo: store new finished status of note " + id + " and display finished date.");
        // ToDo: setFinishedStatus(id);
        return;
    }
    if (action === "showmore") {
        // ToDo: showMore(id);
        alert("ToDo: show full description of note " + id);
        return;
    }
    if (action === "showless") {
        // ToDo: showLess(id);
        alert("ToDo: show minimized description of note " + id);
    }
}

function sortClickEventHandler(event) {

    var action = event.target.getAttribute("data-sort");
    if (action) {
        sortAndRenderNotesByNumber(action);
    }

}

function editorClickEventHandler(event) {
    // ToDo: event doesn't arrive from #editor ?
    console.log(event);
    var action = event.target.getAttribute("data-action");
    if (action === "deleteNote") {
        deleteNode();
    }

}

function filterClickEventHandler(event) {

    var action = event.target.textContent;

    // ToDo: Use a dropdown for filters like "show all, show open, show finished, etc. ???
    // ToDo: Is default view without finished notes?
    // ToDo: use id's for action type instead of button names

    if (action === "Abgeschlossene anzeigen") {
        $("#notes").find("li").each(function () {
            $(this).removeClass("hide");
            var isFinished = $(this).find('input[name="isFinished"]:checked').val();
            if (!isFinished) {
                $(this).addClass("hide");
            }
        });
        $("#hide-finished").html('Offene anzeigen');
        return;
    }

    if (action === "Offene anzeigen") {
        $("#notes").find("li").each(function () {
            $(this).removeClass("hide");
            var isFinished = $(this).find('input[name="isFinished"]:checked').val();
            if (isFinished) {
                $(this).addClass("hide");
            }
        });
        $("#hide-finished").html('Abgeschlossene anzeigen');
    }

}


function sortAndRenderNotesByNumber(sorttype){

    var arrayOfNotes = getNotes();
    if (arrayOfNotes) {
        //sorting the notes array
        arrayOfNotes.sort(function(a, b) {
            var criteriaA = a[sorttype];
            var criteriaB = b[sorttype];

            if (criteriaA > criteriaB){
                return -1;
            } else if (criteriaA < criteriaB){
                return 1;
            } else{
                return 0; // equal prio
            }
        });

        renderNotes(arrayOfNotes);
    }
}



;$(function () {
    "use strict";
    sortAndRenderNotesByNumber("created");
    applySkin();
    $("#displayNotes").on("click", notesClickEventHandler);
    $("#sorting").on("click", sortClickEventHandler);
    $("#filter").on("click", filterClickEventHandler);
    //$("#editor").on("click", editorClickEventHandler);
});

// GUI-functions end






//Business-Functions start
function addNewNote() {

    // ToDo: validate input

    // get notes from local storage
    var notes = getNotes();
    if (!notes) {
        notes = [];
    }

    // add new note to notes
    var newNote = {};
    newNote["title"] = $("#title").val();
    newNote["description"] = $("#description").val();
    newNote["priority"] = $('input[name="priority"]:checked').val();
    newNote["duedate"] = $("#duedate").val();
    newNote["isFinished"] = false;
    newNote["finished"] = 0;
    // use timestamp as note id
    newNote["created"] = new Date().getTime();

    // add new note to notes
    notes.push(newNote);

    // save notes
    setNotes(notes);

    goto("index.html")
}



function editNote(i) {
    // use url parameter noteKey in between pages.
    goto("edit.html?noteKey=" + i);
}

function getNotes() {
    return JSON.parse(localStorage.getItem("notes"));
}

function setNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function findNote(created, notes) {
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].created == created) {
            return notes[i];
        }
    }
    return {};
}

function findNoteIndex(created, notes) {
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].created == created) {
            return i;
        }
    }
    return {};
}

function getNoteKeyParameter() {
    // get i from url - parameter "noteKey"
    var noteKey = decodeURIComponent(window.location.search.match(/(\?|&)noteKey\=([^&]*)/)[2]);
    return noteKey;
}

function setNoteValuesByNoteKeyParameter() {
    var note = findNote(getNoteKeyParameter(),getNotes());
    // set values to dom
    $("#title").val(note.title);
    $("#description").val(note.description);
    var prioId = "#prio" + note.priority;
    $(prioId).prop("checked", true);
    $("#duedate").val(note.duedate);
    if (note.isFinished) {
        $('input[name="isFinished"]').prop("checked", true);
    }
}

function updateNote() {

    // ToDo: validate input

    // retrieve stored values to update later
    var noteToUpdate = findNote(getNoteKeyParameter(),getNotes());

    // update note values
    noteToUpdate.title = $("#title").val();
    noteToUpdate.description = $("#description").val();
    noteToUpdate.priority = $('input[name="priority"]:checked').val();
    noteToUpdate.duedate = $("#duedate").val();
    var statusFinished = ($('input[name="isFinished"]:checked').val()) ? true : false;
    if (statusFinished) {
        noteToUpdate.isFinished = true;
        noteToUpdate.finished = new Date().getTime();
    } else {
        // reset finished date
        noteToUpdate.finished = 0;

    }

    // add updated note to notes Object
    var notes = getNotes();
    notes[findNoteIndex(getNoteKeyParameter(),notes)] = noteToUpdate;
    // save updated notes
    setNotes(notes);


    goto("index.html")
}

function deleteNode() {
    // retrieve stored notes
    var notes = getNotes();
    notes.splice(findNoteIndex(getNoteKeyParameter(),notes),1);
    // save updated notes
    setNotes(notes);
    goto("index.html");
}

//Business-Functions end

