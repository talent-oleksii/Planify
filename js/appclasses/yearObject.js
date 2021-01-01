class YearObject extends WidgetObject {

  static parent = $(".longterm-goal-canvas");
  static notesContainer = this.parent;

  static activeYearObject = null;

  static yearTag = "currentYear";
  static domElementTemplate = `
      <div class='year'>
        <div class='beginning-section year-section'>
          <h2>Early ~currentYear~</h2>
        </div>
        <div class='mid-section year-section'>
          <h2>Mid ~currentYear~</h2>
        </div>
        <div class='end-section year-section'>
          <h2>End of ~currentYear~</h2>
        </div>
      </div>
  `;

  constructor(year, goals, goalsJsonReader, deletedGoalsJsonReader) {

    super([YearObject.yearTag], [year]);

    this._identifier = year;
    this._goals = goals;
    this._goalObjects = [];
    this._notesJsonReader = goalsJsonReader;
    this._deletedNotesJsonReader = deletedGoalsJsonReader;
    this._currentGoalId = this._notesJsonReader.getCurrentIdCount(this._goals);

  }

  configureNewGoalObject(goal) {

    // TODO: make this more dry

    let id = goal;
    let heading = this._goals[goal][NoteObject.headingTag];
    let content = this._goals[goal][NoteObject.contentTag];
    let position = this._goals[goal][NoteObject.posTag];
    let color = this._goals[goal][NoteObject.colorTag];

    let newGoalObject = new NoteObject(
        this,
        heading,
        content,
        id,
        position,
        color
    );

    this._goalObjects.push(newGoalObject);

    return newGoalObject;

  }

  placeInDom() {
    this.constructor.activeYearObject = this;
    this.constructor.parent.append(this._objectDomElement);

    this._goals = this._notesJsonReader.getChildren(this.identifier);
    this._goalObjects = [];

    for (let child in this._goals) {
      this.configureNewGoalObject(child).placeInDom();
    }

  }

  removeFromDom() {

    for (let goal of this._objectDomElement.siblings()) {
      $(goal).remove();
    }
    this._objectDomElement.remove();

  }

  get identifier() { return this._identifier; }
  get currentGoalId() { return this._currentGoalId; }
  get notesJsonReader() { return this._notesJsonReader; }
  get deletedNotesJsonReader() { return this._deletedNotesJsonReader; }
  get goalObjects() { return this._goalObjects; }

  set identifier(val) { this._identifier = val; }
  set currentGoalId(val) { this._currentGoalId = val; }
  set notesJsonReader(val) { this._notesJsonReader = val; }
  set deletedNotesJsonReader(val) { this._deletedNotesJsonReader = val; }
  set goalObjects(val) { this._goalObjects = val; }

}