class WeekObject extends WidgetObject {
    

    static container = ".week-container";
    static weekNumberTag = "weekNum";

    static allTAgs

    static domElementTemplate = 
        `<div class="week">
            <h1>Week ~weekNum~</h1>
        </div>`;


    constructor(dateObjects, weekDomElement, weekNumber) {
        super(
            [
                WeekObject.weekNumberTag
            ],
            [
                weekNumber
            ],
            WeekObject.domElementTemplate
        );


        this._dateObjects = dateObjects;

        this._weekDomElement = weekDomElement;
        
        for (let dateObject of dateObjects) {
            this._weekDomElement.append(dateObject.objectDomElement);
        }

        this._weekNumber = weekNumber;
    }

    placeWeekElementInDom(addMode) {

        if (addMode == "append") {        
            $(WeekObject.container).append(this._weekDomElement);
        } else if (addMode == "prepend") {        
            $(WeekObject.container).prepend(this._weekDomElement);
        }

    }

}