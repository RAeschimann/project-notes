/*
view functions
*/

// function is called once all the DOM elements of the page are ready to be used
;$(function () {
    "use strict";
    applySkin();
    $("#displayNotes").on("click", notesClickEventHandler);
    $("#sorting").on("click", sortClickEventHandler);
    $("#filter").on("click", filterClickEventHandler);
    //$("#editor").on("click", editorClickEventHandler);
});


// navigation in between pages
function goto(url) {
    window.location.replace(url);
}
function editNote(i) {
    /* use url parameter noteKey as a reference to a note in between pages.
    the value of noteKey is the created timestamp of a note.
    the created-timestamp of a note is used as the unique identifier (i) */
    goto("update.html?noteKey=" + i);
}
function newNote() {
    // use url parameter noteKey=0 to add a new note
    goto("update.html?noteKey=0");
}


//css style switching
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



// rendering notes html with handlebars
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


// sorting notes on display (non persistent)
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
                return 0; // equal
            }
        });
        renderNotes(arrayOfNotes);
    }
}


/*
 controller functions
 */

// event-handlers
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
