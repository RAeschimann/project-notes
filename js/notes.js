
function goto(url){
    window.location.replace(url);
}

function changeSkin(){
    var style = document.getElementById("skins").value;
    if (style) {
        document.getElementById("skin-css").href = "css/" +style + ".css";
    }
}

function addNewNote(){

    // ToDo: validate input

    // get notes from local storage
    var notes =  JSON.parse(localStorage.getItem("notes"));

    // add new note to notes
    var newNote = {};
    newNote["title"] = document.getElementById("title").value;
    newNote["description"] = document.getElementById("description").value;
    newNote["priority"] = document.querySelector('input[name="priority"]:checked').value;
    newNote["duedate"] = document.getElementById("duedate").value;
    newNote["created"] = new Date();
    newNote["finished"];
    var i = 0;
    console.log("Notes keys before: "+i);
    console.log("Notes before: "+ JSON.stringify(notes));

    if (notes) {
        i = Object.keys(notes).length;
        console.log("Notes keys before: "+i);
        notes[i] = newNote;
    } else {
        notes = {};
        notes[i] = newNote;
    }

    console.log("Notes after: "+JSON.stringify(notes));
    console.log("Notes keys after: " + Object.keys(notes).length);

    // save updated notes
    localStorage.setItem("notes",JSON.stringify(notes));

    goto("index.html")
}

function renderNotes(){

    var renderNotesHTMLTemplate = Handlebars.compile($("#notes-template").html());
    var notes =  JSON.parse(localStorage.getItem("notes"));
    $("#displayNotes").html(renderNotesHTMLTemplate(notes));

}



function prettyDateFormat(date) {
    var dateStr;
    if (!date) {
        dateStr = "Irgendwann";
    } else {
        // ToDo: check for today and this week
        dateStr = date;
    }

    return dateStr;
}

function sort(i){
    // ToDo: sort entries
    alert("ToDo: sort list with type " + i);
}

function hideFinished() {
    // ToDo: hide all finishid notes
    alert("ToDo: hide all finishid notes");
}

function showMoreContent(i) {
    // ToDo: show full description of a note
    alert("ToDo: show full description of a note " + i);
}

function editNote(i) {
    // use url parameter noteKey in between pages.
    goto("edit.html?noteKey=" +i);
}

function getNoteKeyParameter() {
    // get i from url - parameter "noteKey"
    var noteKey = decodeURIComponent(window.location.search.match(/(\?|&)noteKey\=([^&]*)/)[2]);
    return noteKey;
}

function setNoteValuesByNoteKeyParameter() {
     var note =  (JSON.parse(localStorage.getItem("notes")))[getNoteKeyParameter()];;

    // set values to dom
    document.getElementById("title").value = note.title;
    document.getElementById("description").value = note.description;
    document.querySelector('input[name="priority"]:checked').value = note.priority;
    document.getElementById("duedate").value = note.duedate;
}

function updateNote() {

    // ToDo: validate input

    // retrieve stored values to update later
    var notes = JSON.parse(localStorage.getItem("notes"));
    var noteToUpdate = notes[getNoteKeyParameter()];

    // update note values
    noteToUpdate.title = document.getElementById("title").value;
    noteToUpdate.description = document.getElementById("description").value;
    noteToUpdate.priority = document.querySelector('input[name="priority"]:checked').value;
    noteToUpdate.duedate = document.getElementById("duedate").value;

    // add updated note to notes Object
    notes[getNoteKeyParameter()] = noteToUpdate;

    // save updated notes
    localStorage.setItem("notes",JSON.stringify(notes));

    goto("index.html")
}

$(function() {
    renderNotes();
});