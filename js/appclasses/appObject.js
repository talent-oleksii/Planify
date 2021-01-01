class AppObject {

    // TODO: store all variables into this object as static properties.
    // dom elements etc. that are used multiple times will be stored here!!!!!!

    // jsonReaders:

    static tasksJsonReader = new JsonHandler("./json/shortterm-tasks.json");
    static notesJsonReader = new JsonHandler("./json/notes.json");
    static longtermPlansJsonReader = new JsonHandler("./json/longterm-plans.json");

    static deletedNotesJsonReader = new JsonHandler("./json/deleted-notes.json");
    static deletedTasksJsonReader = new JsonHandler("./json/deleted-shortterm-tasks.json");
    static deletedLongtermPlansJsonReader = new JsonHandler("./json/deleted-longterm-plans.json");

    static preferencesJsonReader = new PreferencesJSONHandler("./json/preferences.json");


    // calendar properties:

    static calendarMode1 = new CalendarMode("WEEK", "./assets/svgs/view_agenda-white-18dp.svg");
    static calendarMode2 = new CalendarMode("MONTH", "./assets/svgs/view_module-white-18dp.svg");

    static calendarMode = AppObject.preferencesJsonReader.getPreference("calendarMode") == "WEEK" ? AppObject.calendarMode1 : AppObject.calendarMode2;
    
    static currentForwardExpand = 0;
    static currentBackwardExpand = 0;


    // taskcanvas properties:

    static expandedTaskCanvas = "unfinished";
    static taskCanvas = $(".task-canvas");

}

AppObject.calendarMode2.next = AppObject.calendarMode1;
AppObject.calendarMode1.next = AppObject.calendarMode2;