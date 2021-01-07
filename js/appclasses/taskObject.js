class TaskObject extends UserMadeWidgetObject {

    // these are used when configuring the taskcanvas and when formating the template string
    
    static idPrefix = "task";
    
    static descriptionTag = "taskDescription";
    static headingTag = "taskHeading";
    static startTimeTag = "startTime";
    static endTimeTag = "endTime";
    static idTag = "id";
    static finishedTag = "finished";
    static tooltipTag = "tooltip";

    static uncompletedTooltip = "complete task";
    static completedTooltip = "undo completion";

    static allJsonTags = [
        TaskObject.headingTag, 
        TaskObject.descriptionTag,
        TaskObject.startTimeTag,
        TaskObject.endTimeTag,
        TaskObject.finishedTag
    ];

    // this will be the symbol used to format things
    static domElementTemplate = 
    `
        <div class='task' data-task-id='~id~'>
            <div class='task-content-wrapper'>
                <header class='task-header'>    
                    <section class='heading'>
                        <article class='horizontal-scrollbar'>
                            <p class='start-time-text' placeholder='Start Time' contenteditable='true' contentbreakable='false' spellcheck='false'
                                ${TaskObject.jsonRepresentDataTag}='${TaskObject.startTimeTag}'
                            >~${TaskObject.startTimeTag}~</p>
                            -
                            <p class='end-time-text' placeholder='End Time' contenteditable='true' contentbreakable='false' spellcheck='false'
                                ${TaskObject.jsonRepresentDataTag}='${TaskObject.endTimeTag}'
                            >~${TaskObject.endTimeTag}~</p>
                            <h4 class='task-name-text' placeholder='Task Name / Heading' contenteditable='true' contentbreakable='false' spellcheck='false'
                                ${TaskObject.jsonRepresentDataTag}='${TaskObject.headingTag}'
                            >~${TaskObject.headingTag}~</h4>
                        </article>
                    </section>
                    <section class='tools'>
                        <div class="complete-btn tool btn" title="~${TaskObject.tooltipTag}~">
                        </div>
                        <div class="delete-btn tool btn" title="delete task">
                        </div>
                    </section>
                </header>
                <section class='task-description'>
                    <article class='task-description-text' contenteditable='true' contentbreakable='true' spellcheck='false' placeholder='Task Description'
                        ${TaskObject.jsonRepresentDataTag}='${TaskObject.descriptionTag}'
                    >~${TaskObject.descriptionTag}~</article>
                </section>
            </div>
        </div>
    `;

    constructor(parentDateObject, startTime, endTime, taskHeading, taskDescription, finished, id) {

        super(
            [
                TaskObject.idTag,
                TaskObject.startTimeTag,
                TaskObject.endTimeTag,
                TaskObject.headingTag,
                TaskObject.descriptionTag,
                TaskObject.tooltipTag
            ],
            [
                id,
                startTime,
                endTime,
                taskHeading,
                taskDescription,
                TaskObject.uncompletedTooltip
            ],
            parentDateObject,
            id,
            parentDateObject.tasksJsonReader,
            parentDateObject.deletedTasksJsonReader
        );

        this.configureDomElements();

        this._startTime = startTime;
        this._endTime = endTime;
        this._heading = taskHeading;
        this._description = taskDescription;
        this._finished = finished;

        this.configureEvents();
    }

    configureDomElements() {

        this._header                    = this._objectDomElement.find(".task-header");
        this._headerHeading             = this._objectDomElement.find(".heading");
        this._tools                     = this._objectDomElement.find(".tools");
        this._completeBtn               = this._objectDomElement.find(".complete-btn");
        this._deleteBtn                 = this._objectDomElement.find(".delete-btn");
        this._taskDescriptionElement    = this._objectDomElement.find(".task-description");

        this._startTimeDomElement       = this._header.find(".start-time-text");
        this._endTimeDomElement         = this._header.find(".end-time-text");
        this._headingDomElement         = this._header.find(".task-name-text");
        this._descriptionDomElement     = this._taskDescriptionElement.find(".task-description-text");

        this._editableElements.push(
            this._startTimeDomElement, 
            this._endTimeDomElement, 
            this._headingDomElement, 
            this._descriptionDomElement
        );

    }

    attachToSibling(taskSection, parentTask) {

        let completeBtnUrl = "url('./assets/svgs/complete-btn.svg')";
        let undoBtnUrl = "url('./assets/svgs/undo-btn.svg')";

        if ($(taskSection).hasClass("finished-tasks")) {
            parentTask
                .detach()
                .appendTo(DateObjectStandard.unfinishedSection);
        } else if ($(taskSection).hasClass("unfinished-tasks")) {
            parentTask
                .detach()
                .appendTo(DateObjectStandard.finishedSection);
        } else {
            console.log("error l. 609");
        }

        
        parentTask.css({
            "height": "auto",
            "margin": "20px",
            "opacity": 1,
            "left": "0"
        });

        if ($(taskSection).hasClass("finished-tasks")) {
            this._deleteBtn.css("display", "none");
            this._completeBtn.css("background-image", completeBtnUrl);
        } else if ($(taskSection).hasClass("unfinished-tasks")) {
            this._deleteBtn.css("display", "block");
            this._completeBtn.css("background-image", undoBtnUrl);
        } else {
            console.log("error l. 462");
        }

    }
    completeBtnClickEvent() {

        this._finished = !this._finished;
        this._completeBtn.attr("title", this.finished ? TaskObject.completedTooltip : TaskObject.uncompletedTooltip);
        this.updateInJson();

        let parentTask = this._completeBtn.parents(".task");
        let animationOffset = 
            $(parentTask).outerWidth() + 
            returnPxValue($(parentTask).css("margin-left")) * 2;

        let taskSection = parentTask.parents(".tasks-section");

        $(parentTask).stop().animate({
            "opacity": 0,
            "left": animationOffset
        }, 300, () => {

            $(parentTask).stop().animate({
                "height": 0,
                "margin": "0px"
            }, 200, () => {
                this.attachToSibling(taskSection, parentTask);
            });

        });
        
    }

    configureEvents() {

        this._completeBtn.on("click", () => this.completeBtnClickEvent());
        this._deleteBtn.on("click", () => this.deleteBtnClickEvent());

        super.configureEvents();

    }

    get objectDomElement() { return this._objectDomElement; }
    get startTime() { return this._startTime; }
    get endTime() { return this._endTime; }
    get taskHeading() { return this._heading; }
    get taskDescription() { return this._description; }
    get finished() { return this._finished; }

    set objectDomElement(val) { this._objectDomElement = val; }
    set startTime(val) { this._startTime = val; }
    set endTime(val) { this._endTime = val; }
    set taskHeading(val) { this._heading = val; }
    set taskDescription(val) { this._description = val; }
    set finished(val) { this._finished = val; }

    placeInDom() {

        if (this._finished) {
            this._deleteBtn.css("display", "block");
            this._completeBtn.css("background-image", "url('./assets/svgs/undo-btn.svg')");
            this._parentObject.finishedTasksContainer.append(this.objectDomElement);
        } else {
            this._parentObject.unfinishedTasksContainer.append(this.objectDomElement);
        }
    }

}