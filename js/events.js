const { remote } = require("electron");

function titlebarEvents() {

    $(".minimize").on("click", function() {
        remote.getCurrentWindow().minimize();
    });
    $(".maximize").on("click", function() {
        if (remote.getCurrentWindow().isMaximized()) {
            remote.getCurrentWindow().unmaximize();
        } else {
            remote.getCurrentWindow().maximize();
        }
    });
    $(".exit").on("click", function() {
        remote.app.quit();
    });

}

function switchToMonthMode() {

    console.log("month mode");

    // approach:
    // unload all DateObjects, then redo the css of the calendar
    // unload the current TaskCanvas, NoteCanvas and LongtermCanvas

    expandCalendarMonth();

}
function switchToWeekMode() {

    console.log("week mode");

    // TODO:
    // unload all MonthObjects etc.
    
    expandCalendarWeek();

}

function calendarEvents() {
    
    $(".expand-backward").on("click", function() {
        if (AppObject.calendarMode.value == "WEEK") {

            expandCalendarWeek("backward");

        } else if (AppObject.calendarMode.value == "MONTH") {

            console.log("not implemented");

        }
    });
    $(".expand-forward").on("click", function() {
        if (AppObject.calendarMode.value == "WEEK") {

            expandCalendarWeek("forward");

        } else if (AppObject.calendarMode.value == "MONTH") {

            console.log("not implemented");

        }
    });

    $(".switch-mode-btn").on("click", function() {

        AppObject.calendarMode = AppObject.calendarMode.next;
        AppObject.preferencesJsonReader.setPreferences("calendarMode", AppObject.calendarMode.value);
        AppObject.currentBackwardExpand = 0;
        AppObject.currentForwardExpand = 0;
        $(this).css("background-image", `url(${AppObject.calendarMode.next.svgUrl})`);

        if (AppObject.calendarMode.value == "WEEK") {

            switchToWeekMode();

        } else if (AppObject.calendarMode.value == "MONTH") {
            
            switchToMonthMode();

        } else {
            console.log(`error, incorrect calendar mode value: ${AppObject.calendarMode.value}`);
        }

    });

}

function taskCanvasEvents() {

    $(".expand-btn").each(function() {
        
        $(this).on("click", function() {

            let dataExpandSection = $(this).attr("data-expand-section");

            if (AppObject.expandedTaskCanvas != dataExpandSection) {

                // setting the global variable

                AppObject.expandedTaskCanvas = dataExpandSection;

                // animating

                let parentSection = $(this).parent();
                let nonExpandHeight = $(parentSection).css("height");

                let parentSectionScrollcontainer = $(parentSection).children(".section-main");
                let siblingSection = parentSection.siblings();
                let siblingSectionScrollcontainer = $(siblingSection).children(".section-main");
                

                $(parentSection).css("height", `calc(100% - ${nonExpandHeight} - 5px)`);
                $(siblingSection).css("height", nonExpandHeight);
                $(parentSectionScrollcontainer).css("opacity", 1);
                $(siblingSectionScrollcontainer).css("opacity", 0);

            };

        });

    });


    $(".add-task").on("click", function() {

        let newTaskObject = new TaskObject(
            DateObjectStandard.activeDateObject,
            "",
            "",
            "",
            "",
            false,
            `task-${DateObjectStandard.activeDateObject.currentTaskId}`,
        );
        newTaskObject.updateInJson()
        newTaskObject.placeInDom();

        DateObjectStandard.activeDateObject.taskObjects.push(newTaskObject);

        DateObjectStandard.activeDateObject.currentTaskId++;
    });

    $(".remove-all-tasks").on("click", function() {
    
        new ConfirmAlert("Confirm Delete?", "Are you sure you want to delete these widgets?", () => {
            for (let taskObject of DateObjectStandard.activeDateObject.taskObjects) {
                if (taskObject.finished) {
                    taskObject.deleteSelf();
                }
            }
        }, null).placeInDom();

    });

}

function noteCanvasEvents() {

    $(".add-note").on("click", function() {

        // add a noteObject with no properties, then set it to edit mode!

        let newNoteObject = new NoteObject(
            DateObjectStandard.activeDateObject,
            "",
            "",
            `note-${DateObjectStandard.activeDateObject.currentNoteId}`,
            {
                "x": 0.1,
                "y": 0.1
            },
            "#b5ae4e"
        );
        newNoteObject.updateInJson();
        newNoteObject.placeInDom();
        DateObjectStandard.activeDateObject.noteObjects.push(newNoteObject);

        DateObjectStandard.activeDateObject.currentNoteId++;

    });

    $(".remove-all-notes").on("click", function() {

        new ConfirmAlert("Confirm Delete?", "Are you sure you want to delete these widgets?", () => {
            for (let noteObject of DateObjectStandard.activeDateObject.noteObjects) {
                noteObject.deleteSelf();
            }
        }, null).placeInDom();

    });

}

function longtermCanvasEvents() {
    $(".add-goal").on("click", function() {

        let newNoteObject = new NoteObject(
            YearObject.activeYearObject,
            "",
            "",
            `note-${YearObject.activeYearObject.currentGoalId}`,
            {
                "x": 0.1,
                "y": 0.1
            },
            "#b5ae4e"
        );

        newNoteObject.updateInJson();
        newNoteObject.placeInDom();
        YearObject.activeYearObject.goalObjects.push(newNoteObject);
        
        YearObject.activeYearObject.currentGoalId++;

    });

    $(".year-form").on("submit", function(e) {
        e.preventDefault();

        let desiredYear = $(this).children(".year-input").val();
        YearObject.activeYearObject.removeFromDom();

        renderLongtermSection(desiredYear - moment().year());

    });

    $(".remove-all-goals").on("click", function() {

        new ConfirmAlert("Confirm Delete?", "Are you sure you want to delete these widgets?", () => {
            for (let noteObject of YearObject.activeYearObject.goalObjects) {
                noteObject.deleteSelf();
            }
        }, null).placeInDom();

    });

    $(".previous-year-btn").on("click", function() {
        YearObject.activeYearObject.removeFromDom();
        renderLongtermSection(YearObject.activeYearObject.identifier - 1 - moment().year());
    });

    
    $(".next-year-btn").on("click", function() {
        YearObject.activeYearObject.removeFromDom();
        renderLongtermSection(YearObject.activeYearObject.identifier + 1 - moment().year());
    });


}


function configureShorttermDateRendered(parentDateObject, startTime, endTime, taskName, taskDescription) {

    let id = `task-${parentDateObject.currentTaskId}`;

    let currentTasks = parentDateObject.tasks;
    currentTasks[id] = {
        [TaskObject.startTimeTag]: startTime,
        [TaskObject.endTimeTag]: endTime,
        [TaskObject.headingTag]: taskName,
        [TaskObject.descriptionTag]: taskDescription,
        [TaskObject.finishedTag]: false
    };
    parentDateObject.tasks = currentTasks;

    AppObject.tasksJsonReader.addToJson(parentDateObject.date, id, currentTasks[id]);

    if (parentDateObject == DateObjectStandard.activeDateObject) {
        let currentTaskObject = new TaskObject(
            parentDateObject,
            startTime,
            endTime,
            taskName,
            taskDescription,
            false,
            id
        );
        currentTaskObject.placeInDom();
    };

}

function configureShorttermDateUnrendered(taskDate, startTime, endTime, taskName, taskDescription) {

    let id = `task-${AppObject.tasksJsonReader.getCurrentIdCount(undefined, taskDate)}`;

    AppObject.tasksJsonReader.addToJson(
        taskDate,
        id,
        {
            [TaskObject.startTimeTag]: startTime,
            [TaskObject.endTimeTag]: endTime,
            [TaskObject.headingTag]: taskName,
            [TaskObject.descriptionTag]: taskDescription
        }
    );

}

function configureShorttermTask(element) {

    let taskName = element.find("#task-name").val();
    let taskDate = reverseDate(element.find("#task-date").val());
    let startTime = element.find("#start-time").val();
    let endTime = element.find("#end-time").val();
    let taskDescription = element.find("#task-description").val();

    let parentDateObject = DateObjectStandard.allDateObjects[taskDate];

    if (parentDateObject) {
        configureShorttermDateRendered(parentDateObject, startTime, endTime, taskName, taskDescription);
        parentDateObject.currentTaskId++;
    } else {
        configureShorttermDateUnrendered(taskDate, startTime, endTime, taskName, taskDescription);
    }

}

function removeAllFormContent(jqueryForm) {

    let allInputs = jqueryForm.find("input, textarea");
    allInputs.each(function() {
        if (!["button", "submit", "date", "time", "radio"].includes($(this).prop("type"))) {
            $(this).val("");
        }
    });

}

// ! deprecated
function addTaskEvents() {

    $(".add-task-form").on("submit", function(e) {
        
        e.preventDefault();


        let taskType = $(this).find("input[name='taskType']:checked").val();

        if (taskType == "shortterm-task") {

            configureShorttermTask($(this));

        } else if (taskType == "longterm-task") {

            console.log("configuring longterm task.");

        } else {
            console.log(`error: l. 130, incorrect task type: ${taskType}`);
        }

        removeAllFormContent($(".add-task-form"));
        createAlert("<h1>Task created!</h1>");

    });

    $("#cancel-btn").click(function() {
        
        let animationDuration = 1000;

        $(".app-content").animate({
            "right": "100vw"
        }, animationDuration);

        setTimeout(() => {

            removeAllFormContent($(".add-task-form"));

        }, animationDuration);

    });

}

async function navigationAnimation(child) {

    let animationDirection = child.attr("data-expand-direction");
    let animationPath = returnPxValue(child.css("height")) + 5;

    child.css("display", "initial");
    child.animate({
        [animationDirection]: `${animationPath}px`,
        opacity: 1
    }, 200);

    if (child.children().hasClass("item")) {
        await sleep(100);
        child = child.children();
        navigationAnimation(child);
    }

}

async function navCloseAnimation(parent) {

    let animationDirection = parent.attr("data-expand-direction");

    parent.animate({
        [animationDirection]: 0,
        opacity: 0
    }, 200, function() {
        $(this).css("display", "none");
    });

    if (parent.parent().hasClass("item")) {
        await sleep(100);
        parent = parent.parent();
        navCloseAnimation(parent);
    }

}

function renderDeletedWidgets() {

    let allDates = [...Object.keys(AppObject.deletedNotesJsonReader.jsonObjects)]
    
    for (let date in AppObject.deletedTasksJsonReader.jsonObjects) {

        if (!allDates.includes(date)) {
            allDates.push(date);
        }

    }

    allDates.sort(function(a, b) {

        let x = reverseDate(a);
        let y = reverseDate(b);

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));

    });

    let container = $(".trash-can-main .deleted-widgets-main");

    for (let date in allDates) {

        date = allDates[date];

        let currentDateObject = new DateObjectDeleted(
            container,
            date,
            date,
            AppObject.deletedTasksJsonReader.getChildren(date),
            AppObject.deletedNotesJsonReader.getChildren(date),
            AppObject.tasksJsonReader,
            AppObject.notesJsonReader,
            AppObject.deletedTasksJsonReader,
            AppObject.deletedNotesJsonReader
        );

        currentDateObject.placeInDom();
        AppObject.trashcanDateObjects.push(currentDateObject);

    }

}

function renderDeletedLongtermPlans() {

}

function renderDeletedProjects() {

}


function renderDeleted() {

    renderDeletedWidgets();
    renderDeletedLongtermPlans();
    renderDeletedProjects();

}

function toggleDeleted() {

    AppObject.trashOpen = !AppObject.trashOpen;

    if (!AppObject.trashOpen) {

        AppObject.trash.animate({
            "left": "-100vw"
        }, 400);

    } else {

        AppObject.trash.animate({
            "left": "0"
        }, 400);

        if (AppObject.trash.attr("data-loaded") == "false") {

            for (let DateObject in AppObject.trashcanDateObjects) {
                AppObject.trashcanDateObjects[DateObject].removeForever();
            }

            renderDeleted();
            AppObject.trash.attr("data-loaded", "true");
        }

    }

}


function miscEvents() {

    // menu events:

    /*
    $(".navigation-btn").on("click", function(e) {
        let child = $(this).children();
        navigationAnimation(child);

    });
    $(".exit-menu").on("click", function(e) {
        e.stopPropagation();
        navCloseAnimation($(this));
    });

    $(".trash-can-btn").on("click", function(e) {
        e.stopPropagation();
        toggleDeleted();
    });
    */
    $(".trash-can header .scroll-subsection-btn").each(function() {
        
        $(this).on("click", function() {
            let prefix = $(this).attr("data-scroll-direction");

            $(".trash-can > main").animate({
                "left": `${prefix}=100%`
            }, 250, function() {


                // TODO: find correlation between two console logs and load.
                console.log($(".trash-can > main").css("left"));
                $(".trash-can .trash-can-subsection").each(function() {
                    console.log($(this));
                    console.log($(this).offset().left);
                });
                // ************ //

                if (returnPxValue($(".trash-can > main").css("left")) > 0) {
                    $(".trash-can > main").animate({
                        "left": "-=100%"
                    }, 100);
                } else if (returnPxValue($(".trash-can > main").css("left")) 
                            - returnPxValue($($(".trash-can > main .trash-can-subsection").get(0)).css("width")) 
                            < (-1 * returnPxValue($(".trash-can > main").css("width")))) {
                    $(".trash-can > main").animate({
                        "left": "+=100%"
                    }, 100);
                }

            });

        });
    });

    /*
    $(".app-content").scroll(function() {
        let scrollTop = $(this).scrollTop();
        $(".planning").css("top", `${scrollTop * 0.5}px`);
    });
    */

    $(".extra-section-btn").on("click", function() {
        document.querySelector(".extra-section").scrollIntoView({
            behavior: "smooth"
        });
    });


    // TODO: try to make this better
    $(".back-btn").on("click", function() {
        document.querySelector(".content-wrapper").scrollIntoView({
            behavior: "smooth"
        });
    });


}


function handleEvents() {

    titlebarEvents();
    calendarEvents();
    taskCanvasEvents();
    noteCanvasEvents();
    longtermCanvasEvents();
    addTaskEvents();
    miscEvents();

}