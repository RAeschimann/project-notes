/**
 * navigation functions
 *
 * encapsulated in "class" Navigation
 * using "revealing module pattern"
 */

var Navigation = (function () {

    "use strict";

    // navigation in between pages
    function goto(url) {
        window.location = url;
    }

    // public accessible functions
    return {
        goto: goto
    };

})();



/**
 * business functions
 *
 * encapsulated in "class" Notes
 * using "revealing module pattern"
 */

var Notes = (function () {

    "use strict";

    function getNotes() {
        $.getJSON("/notes", function(notes){
        console.log("get notes from server and save them to localstorage");
        localStorage.setItem("notes", JSON.stringify(notes));
        });
        return JSON.parse(localStorage.getItem("notes"));
    }

    function updateNote() {
        // ToDo: validate input

        // retrieve stored values to update later
        var noteToUpdate = findNote(getNoteKeyParameter());

        // new note
        if (typeof noteToUpdate.created === 'undefined') { // no existing note found, create a new note
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
                noteToUpdate.isFinished = false;
                noteToUpdate.finished = 0;
            }

            // add updated note to notes Object
            updateNotes(getNoteKeyParameter(), noteToUpdate);

            Navigation.goto("index.html");
        }
    }

    function deleteNote() {
        // retrieve stored notes
        var notes = getNotes();
        notes.splice(findNoteIndex(getNoteKeyParameter()), 1);
        // save updated notes
        setNotes(notes);
        Navigation.goto("index.html");
    }

    function getNoteKeyParameter() {
        // get i from url - parameter "noteKey"
        var notekey = 0;
        try {
            var noteKey = decodeURIComponent(window.location.search.match(/(\?|&)noteKey\=([^&]*)/)[2]);
            // check if note key is a valid timestamp (positiv integer)
            notekey = (/^\+?\d+$/.test(noteKey)) ? noteKey : 0;
        } catch (err) {
            console.log(err);
        }

        return notekey;
    }

    // the created-timestamp is used as the unique identifier of a note
    function findNote(created) {
        var notes = getNotes();
        if (notes) {
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].created == created) {
                    return notes[i];
                }
            }
        }
        return {};
    }

    function changeStatus(id) {
        var note = findNote(id);
        if (!note.isFinished) {
            // set finished status
            note.isFinished = true;
            note.finished = new Date().getTime();
        } else {
            // reset finished status
            note.isFinished = false;
            note.finished = 0;
        }

        updateNotes(id, note);

    }

    /* private functions */

    function setNotes(notes) {

        // send notes to server
        $.ajax({
            type: "POST",
            url: "/notes",
            data: JSON.stringify(notes),
            success: function(data) { console.log('data posted'); },
            contentType: "application/json",
            dataType: 'json'
        });
        localStorage.setItem("notes", JSON.stringify(notes));
    }


    function findNoteIndex(created) {
        var notes = getNotes();
        for (var i = 0; i < notes.length; i++) {
            if (notes[i].created == created) {
                return i;
            }
        }
        return {};
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

        Navigation.goto("index.html");
    }

    function updateNotes(id, note) {

        // add updated note to notes Object
        var notes = getNotes();
        notes[findNoteIndex(id)] = note;

        // save updated notes
        setNotes(notes);

    }

    // public accessible functions
    return {
        getNotes: getNotes,
        findNote: findNote,
        getNoteKeyParameter: getNoteKeyParameter,
        updateNote: updateNote,
        deleteNote: deleteNote,
        changeStatus: changeStatus
    };

})();