class Alert extends WidgetObject {

    constructor(formatList, replaceList) {
        super(formatList, replaceList);
    }

}

class ConfirmAlert extends Alert {

    static titleTag = "title";
    static textTag = "text";
    
    static domElementTemplate = `
        <div class='custom-alert'>
            <main class='custom-alert-main'>
                <article>
                    <h1>~title~</h1>
                    <p>~text~</p>
                </article>
                <div class='button-section'>
                    <button class='confirm-btn'>Yes</button>
                    <button class='deny-btn'>No</button>
                </div>
            </main>
        </div>
    `;

    constructor(title, text, confirmFunction, functionThis, parent=$(".app-content")) {
        super(
            [ConfirmAlert.titleTag, ConfirmAlert.textTag],
            [title, text]
        );
        this._parent = parent;
        this._confirmFunction = confirmFunction;
        this._functionThis = functionThis;

        this.configureDomElements();
        this.configureEvents();
    }

    configureDomElements() {
        this._confirmButton = this._objectDomElement.find(".confirm-btn");
        this._denyButton = this._objectDomElement.find(".deny-btn");
    }

    configureEvents() {
        this._confirmButton.on("click", () => this.confirmMethod());
        this._denyButton.on("click", () => this.removeFromDom());
    }

    confirmMethod() {
        this._confirmFunction.apply(this._functionThis, null);
        this.removeFromDom();
    }

    removeFromDom() {
        this._objectDomElement.stop().animate({
            "left": `-${this._objectDomElement.innerWidth()}px`
        }, 500, () => {
            this._objectDomElement.remove();
            delete this;
        });
    }
    
    placeInDom() {
        this._parent.append(this._objectDomElement);
    }

}

class TempAlert extends Alert {

}