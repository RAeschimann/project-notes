/**
view functions
*/

// function is called once all the DOM elements of the page are ready to be used
;$(function () {
    "use strict";
    applySkin();
    // check for editor or index page
    if ((/(update)/.test(window.location.pathname))) {
        // render editor page and register click event handlers
        var renderEditorHTMLTemplate = Handlebars.compile($("#editor-template").html());
        $("#editor").html(renderEditorHTMLTemplate(Notes.findNote(Notes.getNoteKeyParameter())));
        $("#editor").on("click", editorClickEventHandler);
    } else {
        // render index page and register click event handlers
        sortAndRenderNotesByNumber("created");
        $("#toolbar").on("click", toolbarClickEventHandler);
        $("#displayNotes").on("click", notesClickEventHandler);
        $("#sorting").on("click", sortClickEventHandler);
        $("#filter").on("click", filterClickEventHandler);
    }
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
    // set actual skin in dropdown
    $("#skins").val(style);
}

function showMore(id) {
    alert("ToDo: show full description of note " + id);
    /*
    $("#"+id).find(".block-ellipsis").each(function () {
        $(this).removeClass("block-ellipsis");
        $(this).addClass("showless");
    });
    */
}

function showLess(id) {
    alert("ToDo: show minimized description of note " + id);
}

// rendering notes html with handlebars
function renderNotes(notes) {
    var renderNotesHTMLTemplate = Handlebars.compile($("#notes-template").html());
    $("#displayNotes").html(renderNotesHTMLTemplate(notes));
}

Handlebars.registerHelper("prettyDateFormat", function (date) {

    // ToDo: are there any libs for such pretty date formats?
    var dateStr;
    if (!date) {
        dateStr = "Irgendwann";
    } else {
        // ToDo: check for today and this week
        // ToDo: use moments.js for date formatting
        var d = new Date(date);
        dateStr  = d.getDate() + "." + (d.getMonth()+1)+ "."+d.getFullYear();
    }
    return dateStr;
});

Handlebars.registerHelper("setIsFinished", function (isFinished) {
    var checked = (isFinished) ? "checked" : "";
    return checked;
});

Handlebars.registerHelper("setPriority", function (priority, i) {
    var checked = (priority == i) ? "checked" : "";
    return checked;
});

Handlebars.registerHelper("prettifyTimestamp", function (timestamp) {
    // ToDo: use moments.js for date formatting
    var d = new Date(timestamp);
    var dateStr  = d.getDate() + "." + (d.getMonth()+1)+ "."+d.getFullYear();
    return dateStr;
});


// sorting notes on display (non persistent)
function sortAndRenderNotesByNumber(sorttype){
    var arrayOfNotes = Notes.getNotes();
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


/**
 controller functions
 */

// event-handlers
function notesClickEventHandler(event) {
    var action = event.target.getAttribute("data-action");
    var id = event.target.closest("li").getAttribute("id");
    if (action === "edit-note") {
        editNote(id);
        return;
    }
    if (action === "finished") {
        Notes.changeStatus(id);
        sortAndRenderNotesByNumber("created");
        return;
    }
    if (action === "showmore") {
        showMore(id);
        return;
    }
    if (action === "showless") {
        showLess(id);
        return;
    }
}

function toolbarClickEventHandler(event) {
    var action = event.target.getAttribute("data-action");
    if (action === "new-note") {
        newNote();
        return;
    }
}

function sortClickEventHandler(event) {
    var action = event.target.getAttribute("data-sort");
    if (action) {
        sortAndRenderNotesByNumber(action);
    }
}

function editorClickEventHandler(event) {
    var action = event.target.getAttribute("data-action");
    if (action === "updateNote") {
        Notes.updateNote();
        return;
    }
    if (action === "deleteNote") {
        Notes.deleteNote();
        return;
    }
    if (action === "gotoIndex") {
        goto("index.html");
        return;
    }
}

function filterClickEventHandler(event) {

    var action = event.target.getAttribute("id");

    // ToDo: display default view without finished notes
    // ToDo: create a function for calling this filter from other methods

    if (action === "show-finished") {
        $("#notes").find("li").each(function () {
            $(this).removeClass("hide");
            var isFinished = $(this).find('input[name="isFinished"]:checked').val();
            if (!isFinished) {
                $(this).addClass("hide");
            }
        });
        $("#show-finished").addClass("hide");
        $("#hide-finished").removeClass("hide");
        return;
    }

    if (action === "hide-finished") {
        $("#notes").find("li").each(function () {
            $(this).removeClass("hide");
            var isFinished = $(this).find('input[name="isFinished"]:checked').val();
            if (isFinished) {
                $(this).addClass("hide");
            }
        });
        $("#hide-finished").addClass("hide");
        $("#show-finished").removeClass("hide");
    }
}
