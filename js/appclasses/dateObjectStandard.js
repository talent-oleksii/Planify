class DateObjectStandard extends DateObject {

    static activeDateObject;
    static taskCanvas = $(".task-canvas");
    static noteCanvas = $(".note-canvas");
    static notesContainer = $(".note-canvas-content-wrapper");
    static placeholder = $(".longterm-planning");
    static allSections = [
        ".unfinished-tasks .section-main .tasks-container", 
        ".finished-tasks .section-main .tasks-container"
    ];

    static unfinishedSection = $(DateObjectStandard.allSections[0]);
    static finishedSection = $(DateObjectStandard.allSections[1]);

    static dateTag = "currentDate";
    static dateDisplayTag = "currentDateDisplay";
    static domElementTemplate = `
        <div class='date-selector' data-date='~currentDate~'>
            <p>~currentDateDisplay~</p>
        </div>
    `;

    constructor(
        date, 
        dateDisplay, 
        tasks, 
        notes, 
        tasksJsonReader, 
        notesJsonReader, 
        deletedTasksJsonReader, 
        deletedNotesJsonReader
    ) {

        super(
            [    
                DateObjectStandard.dateTag,
                DateObjectStandard.dateDisplayTag
            ],
            [
                date,
                dateDisplay
            ],
            date,
            tasks, 
            notes, 
            tasksJsonReader, 
            notesJsonReader, 
            deletedTasksJsonReader, 
            deletedNotesJsonReader
        );
        
        this._active = false;

        this._currentTaskId = this._tasksJsonReader.getCurrentIdCount(this._tasks);
        this._currentNoteId = this._notesJsonReader.getCurrentIdCount(this._notes);

        this._notesContainer = this.constructor.notesContainer;
        this._finishedTasksContainer = this.constructor.finishedSection;
        this._unfinishedTasksContainer = this.constructor.unfinishedSection;
    }


    get active() { return this._active; }
    get notesContainer() { return this._notesContainer; }
    get finishedTasksContainer() { return this._finishedTasksContainer; }
    get unfinishedTasksContainer() { return this._unfinishedTasksContainer; }

    set active(val) { this._active = val; }
    set notesContainer(val) { this._notesContainer = val; }
    set finishedTasksContainer(val) { this._finishedTasksContainer = val; }
    set unfinishedTasksContainer(val) { this._unfinishedTasksContainer = val; }


    showDashboard(animationSpeed, easing) {
        this.constructor.placeholder.stop().animate({
            "top": "-100vh",
            "opacity": 0
        }, animationSpeed, easing);
        this.constructor.taskCanvas.stop().animate({
            "top": 0,
            "opacity": 1
        }, animationSpeed, easing);
        this.constructor.noteCanvas.stop().animate({
            "top": 0,
            "opacity": 1
        }, animationSpeed, easing);
        this.configureTaskCanvas();
        this.configureNoteCanvas();
    }

    hideDashboard(animationSpeed, easing) {
        this.constructor.taskCanvas.stop().animate({
            "top": "-200px",
            "opacity": 0
        }, animationSpeed, easing);
        this.constructor.noteCanvas.stop().animate({
            "top": "200px",
            "opacity": 0
        }, animationSpeed, easing);
    }

    calendarClickEvent() {

        let animationSpeed = 400;
        let animationTimeout = 200;
        let easing = "easeInOutCubic";

        this._tasks = this._tasksJsonReader.getChildren(this.identifier);
        this._notes = this._notesJsonReader.getChildren(this.identifier);
        this._noteObjects = [];
        this._taskObjects = [];

        this.hideDashboard(animationSpeed, easing);

        if (this.constructor.activeDateObject !== undefined && 
            this.constructor.activeDateObject != this) {
            
            this.constructor.activeDateObject.objectDomElement.css(
                "background-color", 
                "transparent"
            );
            this.constructor.activeDateObject.active = false;

        }

        if (!this._active) {
            this._objectDomElement.css(
                "background-color", 
                "rgba(255, 255, 255, 0.3)"
            );  
            this._active = true;

            let timeout = typeof(this.constructor.activeDateObject) === "undefined" ? 
                0 : animationSpeed + animationTimeout;

            this.constructor.activeDateObject = this;

            setTimeout(() => {
                this.showDashboard(animationSpeed, easing);
            }, timeout);

        } else {
            this._objectDomElement.css("background-color", "transparent");
            this.constructor.activeDateObject = undefined;
            this._active = false;

            this.constructor.placeholder.stop().animate({
                "top": 0,
                "opacity": 1
            }, animationSpeed, easing);
        }

    }

    configureEvents() {

        this._objectDomElement.on("click", () => this.calendarClickEvent());

    }

    configureDragula() {

        for (let section of this.constructor.allSections) {
            if (!global.drake.containers.includes(document.querySelector(section))) {
                global.drake.containers.push(document.querySelector(section));
            }
        }

        global.drake.on("drag", function(el, source) {
            $(el).css("opacity", "0.5");
        });
        global.drake.on("dragend", function(el) {
            $(el).css("opacity", "1");
        });
    }


    configureChildren(
        children, 
        configMethod, 
        sortFunction=function(configuredChildren) {
            return configuredChildren;
        }
    ) {

        let configuredChildren = [];

        for (let child in children) {
            configuredChildren.push(configMethod.apply(this, [child]));
        }

        configuredChildren = sortFunction.apply(this, [configuredChildren]);

        for (let child in configuredChildren) {
            configuredChildren[child].placeInDom();
        }

    }

    configureTaskCanvas() {

        // TODO: change this to use the configureChildren method!

        this.removeTaskCanvas();

        this.configureChildren(
            this._tasks,
            this.configureNewTaskObject,
            (configuredChildren) => {
                return configuredChildren.sort(function(a, b) {
                    let x = a.startTime;
                    let y = b.startTime;
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        
                    // TODO: modify this function to take endTime into account if no sort happens.
        
                });
            }
        );

    }

    configureNoteCanvas() {

        this.removeNoteCanvas();

        this.configureChildren(
            this._notes, 
            this.configureNewNoteObject
        );

    }

    removeNoteCanvas() {

        this.constructor.noteCanvas
            .find(".note-canvas-content-wrapper")
            .children()
            .each(function() {
                $(this).remove();
            });
    }

    removeTaskCanvas() {
        this.constructor.finishedSection.children().each(function() {
            $(this).remove();
        });
        this.constructor.unfinishedSection.children().each(function() {
            $(this).remove();
        });
    }

}