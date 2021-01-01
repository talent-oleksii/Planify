// this is the template class for widgets such as notes and tasks

class UserMadeWidgetObject extends WidgetObject {

    static idJoin = "-";
    static jsonRepresentDataTag = "data-json-represent";
    static replaceHtmlDataTag = "data-replace-html";

    constructor(formatList, replaceList, parentObject, id, jsonReader, deletedJsonReader) {

        super(
            formatList,
            replaceList
        );

        this._jsonReader = jsonReader;
        this._deletedJsonReader = deletedJsonReader;
        this._parentObject = parentObject;
        this._id = id;
        this._editModeActive = false;
        this._editBtn = this._objectDomElement.find(".edit-btn");
        this._editableElements = [];

    }

    configureEvents() {

        this._editableElements.forEach(element => {

            element.on("input", () => {

                const value = element.html()

                const jsonRepresent = element.attr(UserMadeWidgetObject.jsonRepresentDataTag);

                this.updateJsonInfo({
                    [jsonRepresent]: value
                });
                this.updateInJson()

            });
            
            // preventing line breaks when pressing enter (only applied on elements with contentbreakable set to false)
            if (element.attr("contentbreakable") == "false") {
                element.on("paste", function(e) {
                    const $self = $(this);
                    setTimeout(function() {$self.html(self.text());}, 0);
                }).on("keypress", function(e) {
                    return e.which != 13;
                });
            }

        });

    }

    deleteBtnClickEvent() {
        new ConfirmAlert("Confirm Delete?", "Are you sure you want to delete this widget?", () => this.deleteSelf()).placeInDom();
    }

    deleteSelf() {

        // remove, then remove from json file, add to deleted json file.

        this._objectDomElement.stop().animate({
            "opacity": 0,
            "height": `${this._objectDomElement.innerHeight() * 0.5}px`
        }, 400, () => {
            this._objectDomElement.remove();
            let identifier = this._parentObject.identifier;
            
            this._jsonReader.removeChild(
                this._parentObject.identifier,
                this._id
            )

            delete this;

        });
    }

    updateJsonInfo(propertyDict) {

        for (let key in propertyDict) {
            this[key] = propertyDict[key];
        }

    }


    // !!!! longterm taskObject will have to do this differently
    updateInJson() {
        
        this.jsonReader.updateChild(
            this._parentObject.identifier,
            this._id,
            this.constructor.allJsonTags.reduce((obj, tag) => {
                obj[tag] = this[tag];
                return obj;
            }, {})
        );

    }

    get parentObject() { return this._parentObject; }
    get id() { return this._id; }
    get jsonReader() { return this._jsonReader; }
    get editModeActive() { return this._editModeActive; }

    set parentObject(val) { this._parentObject = val; }
    set id(val) { this._id = val; }
    set jsonReader(val) { this._jsonReader = val; }
    set editModeActive(val) { this._editModeActive = val; } 



}