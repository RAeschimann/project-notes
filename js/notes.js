
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
function displayNotes(){

    var listHTML = "";
    var notes =  JSON.parse(localStorage.getItem("notes"));
    var i = 0;
    var j = Object.keys(notes).length;
    while (i < j) {
        var note = notes[i];
        var date = prettyDateFormat(note.duedate);
        listHTML += '<ul id="note-'+i+'" class="entry">';
        listHTML += '<li class="date">'+date+'</li>';
        listHTML += '<li class="title">'+note.title+'</li>';
        listHTML += '<li class="priority">Wichtigkeit: '+note.priority+'</li>';
        listHTML += '<li class="finished"><input id="finished-entry-'+i+'" type="checkbox">Finished</li>';
        listHTML += '<li class="description">'+note.description+' [<a onclick="showMoreContent('+i+')" href="#" class="todo">Show more</a>]</li>';
        listHTML += '<li class="edit"><button class="todo" id="edit-note-'+i+'" onclick="editNote('+i+')">Bearbeiten</button></li>';
        listHTML += '</ul>';
        i++;
    }
    document.getElementById("displayNotes").innerHTML = listHTML;

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
    // ToDo: make note i editable
    alert("ToDo: make note " + i + " editable");
}

