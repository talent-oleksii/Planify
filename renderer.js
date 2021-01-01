function expandCalendarWeek(mode="init") {

    let weekToHandle = moment();
    let today;
    let addMode = "prepend";

    if (mode == "forward") {
        AppObject.currentForwardExpand++;
        weekToHandle = weekToHandle.add(AppObject.currentForwardExpand, "week");
    } else if (mode == "backward") {
        AppObject.currentBackwardExpand++;
        weekToHandle = weekToHandle.subtract(AppObject.currentBackwardExpand, "week");
        addMode = "append";
    } else if (mode == "init") { 
        today = moment().format("DD-MM-YYYY");
    } else {
        console.log("error, invalid mode argument in expandCalendarWeek!!");
    }

    let currentDay = weekToHandle.subtract(1, "days").endOf("week").add(1, "days");
    let allDateObjects = [];

    for (let i=0; i<7; i++) {

        let currentDateString = currentDay.format("DD-MM-YYYY");
        let currentDateDisplay = currentDay.format("ddd | MMMM Do YYYY");

        if (currentDateString == today) {
            currentDateDisplay += " | (Today)";
        }

        let currentDateObject = new DateObjectStandard(
            currentDateString,
            currentDateDisplay,
            AppObject.tasksJsonReader.getChildren(currentDateString),
            AppObject.notesJsonReader.getChildren(currentDateString),
            AppObject.tasksJsonReader,
            AppObject.notesJsonReader,
            AppObject.deletedTasksJsonReader,
            AppObject.deletedNotesJsonReader
        );
        currentDay.subtract(1, "days");

        allDateObjects.push(currentDateObject);

    }

    let weekNum = weekToHandle.week();

    if (mode == "init") {
        weekNum += " | (This Week)";
    }

    let currentWeekObject = new WeekObject(
        allDateObjects,
        $(`<div class="week"><h1>Week ${weekNum}</h1></div>`),
        weekNum
    );
    currentWeekObject.placeWeekElementInDom(addMode);

}

function expandCalendarMonth(mode="init") {

}


function renderLongtermSection(offset=0) {

    //TODO: make it so that this function will see if the object has already 
    // been loaded or not. Depending on that, we load in the section differently  

    let year = moment().add(offset, "years").year();

    /*
    if (year in YearObject.allYearObjects) {
        YearObject.allYearObjects[year].placeInDom();
    } else {
        */
    new YearObject(
        year, 
        AppObject.longtermPlansJsonReader.getChildren(year),
        AppObject.longtermPlansJsonReader,
        AppObject.deletedLongtermPlansJsonReader
    ).placeInDom();
    //}
    
}

function configureLibs() {

    $(".custom-scrollbar").overlayScrollbars({
        className        : "os-theme-minimal-light",
        overflowBehavior: {
            x: "h",
            y: "s"
        },
        scrollbars : {
            visibility       : "auto",
            autoHide         : "leave",
            autoHideDelay    : 300,
            dragScrolling    : true,
            clickScrolling   : false,
            touchSupport     : true,
            snapHandle       : false
        }
    }).overlayScrollbars();
    $(".x-y-scrollbar").overlayScrollbars({
        className        : "os-theme-minimal-light",
        overflowBehavior: {
            x: "s",
            y: "s"
        },
        scrollbars : {
            visibility       : "auto",
            autoHide         : "leave",
            autoHideDelay    : 300,
            dragScrolling    : true,
            clickScrolling   : true,
            touchSupport     : true,
            snapHandle       : true
        }
    }).overlayScrollbars();

    // TODO: fix dragging.
    //dragula(AppObject.taskCanvas);

    Sortable.create($(".tasks-container")[0], {
        animation: 200
    });        

    $("p, h1, h2, h3, h4, h5, h6").each(function() {
        $(this).attr("draggable", false);
    });


}


$(function() {

    if (AppObject.calendarMode.value == "WEEK") {
        expandCalendarWeek();
    } else if (AppObject.calendarMode.value == "MONTH") {
        expandCalendarMonth();
    }

    configureLibs();    
    // maybe only call this when extra section comes into view???
    renderLongtermSection();
    handleEvents();


    let allBackgroundImages = ["background1", "background2", "background3", "background4"];
    let index = Math.round(Math.random() * (allBackgroundImages.length - 1));

    let background = allBackgroundImages[index];

    $(".planning").css("background-image", `url('./assets/images/${background}.jpg')`);
    $(".year-input").attr("min", moment().year());

    /*
    $(".calendar-section").resizable();
    $(".task-canvas").resizable();
    $(".note-canvas").resizable();
    $(".longterm-planning").resizable();
    */

});
