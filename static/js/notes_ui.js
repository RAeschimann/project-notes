;
(function ($, window, document, undefined) {

    "use strict";

    /**
     view functions
     */

    // function is called once all the DOM elements of the page are ready to be used
    $(function () {
        applySkin();
        // check for editor or index page
        if ((/(update)/.test(window.location.pathname))) {
            // render editor page and register click event handlers
            var renderEditorHTMLTemplate = Handlebars.compile($("#editor-template").html());
            $("#editor").html(renderEditorHTMLTemplate(Notes.findNote(Notes.getNoteKeyParameter())));
            $("#editor").on("click", editorClickEventHandler);
        } else {
            // render index page and register event handlers
            sortAndRenderNotesByNumber("created", "date", "desc");
            $("#toolbar").on("click change", toolbarClickEventHandler);
            $("#displayNotes").on("click", notesClickEventHandler);
            $("#sorting").on("click", sortClickEventHandler);
            $("#filter").on("click", filterClickEventHandler);
        }
    });

    function editNote(i) {
        /* use url parameter noteKey as a reference to a note in between pages.
         the value of noteKey is the created timestamp of a note.
         the created-timestamp of a note is used as the unique identifier (i) */
        Navigation.goto("update.html?noteKey=" + i);
    }

    function newNote() {
        // use url parameter noteKey=0 to add a new note
        Navigation.goto("update.html?noteKey=0");
    }

    //css style switching
    function changeSkin() {
        var style = $("#skins").val();
        // store in session
        sessionStorage.setItem("skin_style", style);
        applySkin();
    }

    function applySkin() {
        var style = "";
        if (sessionStorage.getItem("skin_style")) {
            style = sessionStorage.getItem("skin_style");
        } else {
            style = $("#skins").val();
        }
        if (style) {
            $("#skin-css").attr("href", "css/" + style + ".css");
        }
        // set actual skin in dropdown
        $("#skins").val(style);
    }

    function dotdotdotCallback(isTruncated, originalContent) {
        if (!isTruncated) {
            $("a", this).remove();
        }
    }

    // rendering notes html with handlebars
    function renderNotes(notes) {
        var renderNotesHTMLTemplate = Handlebars.compile($("#notes-template").html());
        $("#displayNotes").html(renderNotesHTMLTemplate(notes));
        $("div.description").dotdotdot({
            after: "a.more",
            ellipsis: "... ",
            wrap: "word",
            callback: dotdotdotCallback
        });
        $("div.description").on("click", showMoreClickEventHandler);
    }

    /* display note in list only when filter and status match */
    Handlebars.registerHelper("checkFilter", function (isFinished) {
        var showFinishedNotes = $("#show-finished").hasClass("hide");
        var showOpenNotes = $("#hide-finished").hasClass("hide");
        var cssClass = " hide";
        if ((showFinishedNotes && isFinished) || (showOpenNotes && !isFinished)) {
            cssClass = "";
        }
        return cssClass;
    });

    Handlebars.registerHelper("prettyDateFormat", function (date, type) {
        var dateStr = "";
        if (!date && type === "due") {
            dateStr = "Irgendwann";
        } else {
            moment.locale('de');
            var d = moment(date);
            dateStr = d.fromNow();
        }
        return dateStr;
    });

    Handlebars.registerHelper("formatText", function (text) {
        // replace linebreaks with <br> tags
        text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
        return text;
    });

    Handlebars.registerHelper("setIsFinished", function (isFinished) {
        var checked = (isFinished) ? "checked" : "";
        return checked;
    });

    Handlebars.registerHelper("setPriority", function (priority, i) {
        var checked = (priority == i) ? "checked" : "";
        return checked;
    });


    // sorting notes on display (non persistent)
    function sortAndRenderNotesByNumber(sortproperty, type, order) {
        var arrayOfNotes = Notes.getNotes();
        if (arrayOfNotes) {
            //sorting the notes array
            arrayOfNotes.sort(function (a, b) {
                var criteriaA = a[sortproperty];
                var criteriaB = b[sortproperty];
                if (type === "number") {
                    // check for number and set NaN to -Infinity for sorting negative numbers
                    criteriaA = isNaN(criteriaA) ? -Infinity : criteriaA;
                    criteriaB = isNaN(criteriaB) ? -Infinity : criteriaB;
                    switch (order) {
                        case "desc":
                            return criteriaB - criteriaA;
                            break;
                        default:
                            return criteriaA - criteriaB;
                    }
                } else if (type === "date") {
                    // convert date to a timestamp, set NaN into the future (infinity) and sort these values as numbers
                    criteriaA = isNaN(moment(criteriaA).valueOf()) ? Infinity : moment(criteriaA).valueOf();
                    criteriaB = isNaN(moment(criteriaB).valueOf()) ? Infinity : moment(criteriaB).valueOf();
                    switch (order) {
                        case "desc":
                            return criteriaB - criteriaA;
                            break;
                        default:
                            return criteriaA - criteriaB;
                    }
                } else {
                    switch (order) {
                        case "desc":
                            if (criteriaB > criteriaA) {
                                return -1;
                            } else if (criteriaB < criteriaA) {
                                return 1;
                            } else {
                                return 0; // equal
                            }
                            break;
                        default:
                            if (criteriaA > criteriaB) {
                                return -1;
                            } else if (criteriaA < criteriaB) {
                                return 1;
                            } else {
                                return 0; // equal
                            }
                    }
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
        if (action) {
            var id = event.target.closest("li").getAttribute("id");
            if (action === "edit-note") {
                editNote(id);
                return;
            }
            if (action === "finished") {
                Notes.changeStatus(id);
                sortAndRenderNotesByNumber("created", "date", "desc");
                return;
            }
        }
    }

    function toolbarClickEventHandler(event) {
        var id = event.target.getAttribute("id");
        if (id === "new-note") {
            newNote();
        }
        if (id === "skins") {
            changeSkin();
        }
    }

    function sortClickEventHandler(event) {
        var target = event.target;
        var action = target.getAttribute("id");
        if (action) {
            var type = "date";
            var order = "desc";
            if (action === "priority") {
                type = "number";
            }
            if (action === "duedate") {
                order = "asc";
            }
            sortAndRenderNotesByNumber(action, type, order);
            $(target).addClass("active");
            $(target).siblings().removeClass("active");
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
            Navigation.goto("index.html");
        }
    }

    function filterClickEventHandler(event) {

        var action = event.target.getAttribute("id");
        var CSSCLASSHIDE = "hide";

        $("#notes").find("li").each(function () {
            $(this).removeClass(CSSCLASSHIDE);
            var isFinished = $(this).find('input[name="isFinished"]:checked').val();

            if (action === "show-finished") {
                if (!isFinished) {
                    $(this).addClass(CSSCLASSHIDE);
                }
                // reset filter and sort buttons
                $("#show-finished").addClass(CSSCLASSHIDE);
                $("#hide-finished").removeClass(CSSCLASSHIDE);
                $("#duedate").addClass(CSSCLASSHIDE);
                $("#finished").removeClass(CSSCLASSHIDE);

            } else if (action === "hide-finished") {
                if (isFinished) {
                    $(this).addClass(CSSCLASSHIDE);
                }
                // reset filter and sort buttons
                $("#show-finished").removeClass(CSSCLASSHIDE);
                $("#hide-finished").addClass(CSSCLASSHIDE);
                $("#duedate").removeClass(CSSCLASSHIDE);
                $("#finished").addClass(CSSCLASSHIDE);
            }
        });
        $("div.description").dotdotdot({
            after: "a.more",
            ellipsis: "... ",
            wrap: "word",
            callback: dotdotdotCallback
        });
        $("div.description").on("click", showMoreClickEventHandler);
    }

    function showMoreClickEventHandler(event) {
        if ($(event.target).text() == "Mehr anzeigen") {
            var div = $(event.target).closest("div.description");
            div.trigger("destroy").find("a.more").hide();
            div.css("max-height", "none");
            $("a.less", div).show();
        }
        else {
            $(event.target).hide();
            $(event.target).closest('div.description').css("max-height", "50px").dotdotdot({ after: "a.more", callback: dotdotdotCallback });
        }
    }

})(jQuery, window, document);