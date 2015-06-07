/*
business-functions (model)
*/

function getNotes() {
    return JSON.parse(localStorage.getItem("notes"));
}

function setNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// the created-timestamp is used as the unique identifier of a note
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

// populate form fields of the update page
function getNoteValuesByNoteKeyParameter() {
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

    // save notes with new note
    setNotes(notes);

    goto("index.html")
}

function updateNote() {

    // ToDo: validate input

    // retrieve stored values to update later
    var noteToUpdate = findNote(getNoteKeyParameter(),getNotes());
    console.log(noteToUpdate.title);
    if (typeof noteToUpdate.created == 'undefined') { // no existing note found, create a new note
        addNewNote();
    } else {

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
        notes[findNoteIndex(getNoteKeyParameter(), notes)] = noteToUpdate;

        // save updated notes
        setNotes(notes);

        goto("index.html");
    }
}

function deleteNode() {
    // retrieve stored notes
    var notes = getNotes();
    notes.splice(findNoteIndex(getNoteKeyParameter(),notes),1);
    // save updated notes
    setNotes(notes);
    goto("index.html");
}

