class NoteObject extends UserMadeWidgetObject {
   
    static idPrefix = "note";

    static headingTag = "noteHeading";
    static contentTag = "noteContent";
    static idTag = "id";
    static posTag = "position";
    static positionXTag = "x";
    static positionYTag = "y";
    static colorTag = "color";

    static allJsonTags = [
        NoteObject.headingTag,
        NoteObject.contentTag,
        NoteObject.posTag,
        NoteObject.colorTag
    ];

    static allNoteObjects = [];

    static colorPickerChangeTag = "color-change";

    static domElementTemplate = `
        <div class='note' data-note-id='~id~'>
            <div class='note-content-wrapper'>
                <header class='note-header'>
                    <h1 class='note-heading-text' 
                        ${TaskObject.jsonRepresentDataTag}='${NoteObject.headingTag}'
                        placeholder='note heading' contenteditable='true' contentbreakable='false' spellcheck='false'
                    >~noteHeading~</h1>
                    <div class='tools'>
                        <div class='delete-btn tool btn' title="delete note"></div>
                    </div>
                </header>
                <main class='note-main'>
                    <article 
                        class='note-content-text' 
                        ${TaskObject.jsonRepresentDataTag}='${NoteObject.contentTag}'
                        placeholder='note description' contenteditable='true' contentbreakable='true' spellcheck='false'
                    >~noteContent~</article>
                </main>
            </div>
            <div class="color-input" title="click to change note color">
                <input type="color" name="colorPicker" class='color-picker'>
            </div>
        </div>
    `;

    static updateEvents() {
        $(window).on("resize", () => {
            NoteObject.allNoteObjects.forEach((e) => {
                e._objectDomElement.css({
                    "left": e._position[NoteObject.positionXTag] * e._parentObject.constructor.notesContainer.innerWidth(),
                    "top": e._position[NoteObject.positionYTag] * e._parentObject.constructor.notesContainer.innerHeight()
                });
            });
        });
    }

    constructor(parentObject, heading, content, id, position, color) {
        super(
            [
                NoteObject.headingTag,
                NoteObject.contentTag,
                NoteObject.idTag
            ],
            [
                heading,
                content,
                id
            ],
            parentObject,
            id,
            parentObject.notesJsonReader,
            parentObject.deletedNotesJsonReader
        );
        
        this._heading = heading;
        this._content = content;
        this._position = position;
        this._color = color;

        this.constructor.allNoteObjects.push(this);
        this.constructor.updateEvents();

        this.configureDomElements();
        this.configureEvents();

    }

    configureDomElements() {

        this.changeAllColors(this._color);

        this._domHeading = this._objectDomElement.find(".note-heading-text");
        this._domContent = this._objectDomElement.find(".note-content-text");
        this._deleteBtn = this._objectDomElement.find(".delete-btn");
        this._colorInput = this._objectDomElement.find(".color-input");
        this._colorPicker = this._objectDomElement.find(".color-picker");

        this._editableElements.push(
            this._domHeading,
            this._domContent
        );

    }

    changeAllColors(newColor) {
        this._objectDomElement.css("background-color", newColor);
    }

    colorPickerChangeEvent() {

        let newColor = this._colorPicker.val();

        this.changeAllColors(newColor);

        this.updateJsonInfo({
            [NoteObject.colorTag]: newColor
        });
        this.updateInJson()

    }

    configureEvents() {
        
        this._deleteBtn.on("click", () => this.deleteBtnClickEvent());
        this._colorPicker.on("change", () => this.colorPickerChangeEvent());

        super.configureEvents();

    }


    placeInDom() {

        this._parentObject.constructor.notesContainer.append(this._objectDomElement);

        this._objectDomElement.css({
            "left": this._position[NoteObject.positionXTag] * this._parentObject.constructor.notesContainer.innerWidth(),
            "top": this._position[NoteObject.positionYTag] * this._parentObject.constructor.notesContainer.innerHeight()
        });

        this._objectDomElement.draggable({
            cancel: "[contenteditable='true']",
            disabled: false,
            containment: this._parentObject.constructor.notesContainer,
            opacity: 0.5,
            scrollSensitivity: 1,
            stop: (event, ui) => this.getCurrentCoordinates()
        });

        this._colorPicker.val(this._color);

    }

    getCurrentCoordinates() {

        let xCoordinate = this._objectDomElement.position().left;
        let yCoordinate = this._objectDomElement.position().top;
        let containerWidth = this._parentObject.constructor.notesContainer.innerWidth();
        let containerHeight = this._parentObject.constructor.notesContainer.innerHeight();

        let xCoordinateInPercent = xCoordinate / containerWidth;
        let yCoordinateInPercent = yCoordinate / containerHeight;


        this.updateJsonInfo({
            [NoteObject.headingTag]: this._heading,
            [NoteObject.contentTag]: this._content,
            [NoteObject.posTag]: {
                [NoteObject.positionXTag]: xCoordinateInPercent, 
                [NoteObject.positionYTag]: yCoordinateInPercent
            }
        });
        this.updateInJson();

    }

    get noteHeading() { return this._heading; }
    get noteContent() { return this._content; }
    get position() { return this._position; }
    get color() { return this._color; }

    set noteHeading(val) { this._heading = val; }
    set noteContent(val) { this._content = val; }
    set position(val) { this._position = val; }
    set color(val) { this._color = val; }

}