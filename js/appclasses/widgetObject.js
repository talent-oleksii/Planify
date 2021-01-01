// this is the super class of the app. Everything with a dom object and 
// some properties which have to be tracked will be a "widget"

class WidgetObject {
    
    static templateFormatSymbol = "~";
    static formatRawDomString(formatList, replaceList, domTemplate) {

        if (formatList.length != replaceList.length) {
            console.log("%c util, l. 31: formatList length not equal to replaceList length", 
                        "color: red");
            return;
        } else {
    
            for (let index=0; index<formatList.length; index++) {
                let formatString = 
                    `${WidgetObject.templateFormatSymbol}${formatList[index]}${WidgetObject.templateFormatSymbol}`;

                let replaceString = replaceList[index];

                domTemplate = domTemplate.replace(
                    new RegExp(formatString, "g"), 
                    replaceString
                );
            }

            return domTemplate;
    
        }
    
    }

    constructor(formatList, replaceList) {

        this._objectDomElement = $(WidgetObject.formatRawDomString(
            formatList, 
            replaceList,
            this.constructor.domElementTemplate
        ));

    }

    get objectDomElement() { return this._objectDomElement; }
    set objectDomElement(val) { this._objectDomElement = val; }

}