"use strict";

function goto(url) {
    window.location.replace(url);
}

function changeSkin() {
    var style = $("#skins").val();
    if (style) {
        $('#skin-css').attr('href', 'css/' + style + '.css');
    }
}

function addNewNote() {

    // ToDo: validate input

    // get notes from local storage
    var notes = JSON.parse(localStorage.getItem("notes"));
    if (!notes) {
        notes = {};
    }

    // add new note to notes
    var newNote = {};
    newNote["title"] = $("#title").val();
    newNote["description"] = $("#description").val();
    newNote["priority"] = $('input[name="priority"]:checked').val();
    newNote["duedate"] = $("#duedate").val();
    newNote["finished"] = false;
    // use timestamp as note id
    var id = new Date().getTime();
    notes[id] = newNote;

    // save notes
    localStorage.setItem("notes", JSON.stringify(notes));

    goto("index.html")
}

function renderNotes() {

    var renderNotesHTMLTemplate = Handlebars.compile($("#notes-template").html());
    var notes = JSON.parse(localStorage.getItem("notes"));
    $("#displayNotes").html(renderNotesHTMLTemplate(notes));
}

function editNote(i) {
    // use url parameter noteKey in between pages.
    goto("edit.html?noteKey=" + i);
}

function getNoteKeyParameter() {
    // get i from url - parameter "noteKey"
    var noteKey = decodeURIComponent(window.location.search.match(/(\?|&)noteKey\=([^&]*)/)[2]);
    return noteKey;
}

function setNoteValuesByNoteKeyParameter() {
    var note = (JSON.parse(localStorage.getItem("notes")))[getNoteKeyParameter()];

    // set values to dom
    $("#title").val(note.title);
    $("#description").val(note.description);
    var prioId = "#prio" + note.priority;
    $(prioId).prop("checked", true);
    $("#duedate").val(note.duedate);
    if (note.finished) {
        $('input[name="finished"]').prop("checked", true);
    }
}

function updateNote() {

    // ToDo: validate input

    // retrieve stored values to update later
    var notes = JSON.parse(localStorage.getItem("notes"));
    var noteToUpdate = notes[getNoteKeyParameter()];

    // update note values
    noteToUpdate.title = $("#title").val();
    noteToUpdate.description = $("#description").val();
    noteToUpdate.priority = $('input[name="priority"]:checked').val();
    noteToUpdate.duedate = $("#duedate").val();
    var statusFinished = ($('input[name="finished"]:checked').val()) ? true : false;
    if (statusFinished) {
        noteToUpdate.finished = true;
    }

    // add updated note to notes Object
    notes[getNoteKeyParameter()] = noteToUpdate;

    // save updated notes
    localStorage.setItem("notes", JSON.stringify(notes));

    goto("index.html")
}

function deleteNode() {
    // retrieve stored notes
    var notes = JSON.parse(localStorage.getItem("notes"));
    delete notes[getNoteKeyParameter()];
    // save updated notes
    localStorage.setItem("notes", JSON.stringify(notes));
    goto("index.html");
}

/*
 function sortNotes(s1, s2, sortType){
 if (sortType === "priority") {
 return s1.priority < s2.priority;
 } else {
 // Default: sort with creation date
 //s1.key < s2.key;
 }
 }
 */

function notesClickEventHandler(event) {

    var action = event.target.getAttribute("data-action");
    var id = event.target.closest("li").getAttribute("id");

    if (action === "edit") {
        editNote(id);
        return;
    }
    if (action === "status") {
        alert("ToDo: store new status of note " + id);
        // ToDo: setStatus(id);
        return;
    }
    if (action === "showmore") {
        // ToDo: showMore(id);
        alert("ToDo: show full description of note " + id);
        return;
    }
    if (action === "showless") {
        // ToDo: showLess(id);
        return;
    }
}

function sortClickEventHandler(event) {

    var action = event.target.getAttribute("data-sort");
    // ToDo: get action and sort notes
    alert("ToDo: sort notes after " + action);
    return;

}

function editorClickEventHandler(event) {
    // ToDo: event doesn't arrive from #editor ?
    console.log(event);
    var action = event.target.getAttribute("data-action");
    if (action === "deleteNote") {
        deleteNode();
        return;
    }

}

function filterClickEventHandler(event) {

    var action = event.target.textContent;

    // ToDo: Use a dropdown for filters like "show all, show open, show finished, etc. ???

    if (action === "Abgeschlossene anzeigen") {
        $("#notes").find("li").each(function () {
            $(this).removeClass("hide");
            var isFinished = $(this).find('input[name="status"]:checked').val();
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
            var isFinished = $(this).find('input[name="status"]:checked').val();
            if (isFinished) {
                $(this).addClass("hide");
            }
        });
        $("#hide-finished").html('Abgeschlossene anzeigen');
        return;
    }

    // ToDo: show all or refresh page

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

Handlebars.registerHelper('setStatus', function (finished) {
    var checked = (finished) ? "checked" : "";
    return checked;
});

$(function () {
    renderNotes();
    $("#displayNotes").on("click", notesClickEventHandler);
    $("#sorting").on("click", sortClickEventHandler);
    $("#filter").on("click", filterClickEventHandler);
    //$("#editor").on("click", editorClickEventHandler);
});