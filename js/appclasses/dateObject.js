
// put all events etc. into this object as its static properties!!!!


class DateObject extends WidgetObject {

    // add a click event to objectDomElement so that the taskCanvas is shown when clicked.
    
    constructor(
        formatList,
        replaceList,
        date,
        tasks, 
        notes, 
        tasksJsonReader, 
        notesJsonReader, 
        deletedTasksJsonReader, 
        deletedNotesJsonReader
    ) {

        super(
            formatList,
            replaceList
        );

        this._identifier = date;
        this._tasks = tasks;
        this._taskObjects = [];
        this._notes = notes;
        this._noteObjects = [];

        this._tasksJsonReader = tasksJsonReader;
        this._notesJsonReader = notesJsonReader;
        this._deletedTasksJsonReader = deletedTasksJsonReader;
        this._deletedNotesJsonReader = deletedNotesJsonReader;

        this.configureEvents();
    }

    configureNewTaskObject(currentTask) {

        let id = currentTask;
        let name = this._tasks[currentTask][TaskObject.headingTag];
        let desc = this._tasks[currentTask][TaskObject.descriptionTag];

        let startTime = this._tasks[currentTask][TaskObject.startTimeTag];
        let endTime = this._tasks[currentTask][TaskObject.endTimeTag];
        let finished = this._tasks[currentTask][TaskObject.finishedTag];

        let newTaskObject = new TaskObject(
            this,
            startTime,
            endTime,
            name,
            desc,
            finished,
            id
        );

        this._taskObjects.push(newTaskObject);

        return newTaskObject; 

    }

    
    configureNewNoteObject(note) {

        // TODO: make this more dry

        let id = note;
        let heading = this._notes[note][NoteObject.headingTag];
        let content = this._notes[note][NoteObject.contentTag];
        let position = this._notes[note][NoteObject.posTag];
        let color = this._notes[note][NoteObject.colorTag];

        let newNoteObject = new NoteObject(
            this,
            heading,
            content,
            id,
            position,
            color
        );

        this._noteObjects.push(newNoteObject);

        return newNoteObject;

    }


    get identifier() { return this._identifier; }
    get tasks() { return this._tasks; }
    get notes() { return this._notes; }
    get taskObjects() { return this._taskObjects; }
    get noteObjects() { return this._noteObjects; }
    get currentTaskId() { return this._currentTaskId; }
    get currentNoteId() { return this._currentNoteId; }
    get tasksJsonReader() { return this._tasksJsonReader; }
    get notesJsonReader() { return this._notesJsonReader; }
    get deletedTasksJsonReader() { return this._deletedTasksJsonReader; }
    get deletedNotesJsonReader() { return this._deletedNotesJsonReader; }

    set identifier(val) { this._identifier = val; }
    set tasks(val) { this._tasks = val; }
    set notes(val) { this._notes = val; }
    set taskObjects(val) { this._taskObjects = val; }
    set noteObjects(val) { this._noteObjects = val; }
    set currentTaskId(val) { this._currentTaskId = val; }
    set currentNoteId(val) { this._currentNoteId = val; }
    set tasksJsonReader(val) { this._tasksJsonReader = val; }
    set notesJsonReader(val) { this._notesJsonReader = val; }
    set deletedTasksJsonReader(val) { this._deletedTasksJsonReader = val; }
    set deletedNotesJsonReader(val) { this._deletedNotesJsonReader = val; }
    
    
}