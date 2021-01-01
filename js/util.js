class LinkedListNode {
    constructor(value, next=null) {
        this.value = value;
        this.next = next;
    }
}

class CalendarMode extends LinkedListNode {

    constructor(value, svgUrl, next=null) {
        super(value, next);
        this.svgUrl = svgUrl;
    }

}

function getTag(element) {
    return element.prop("tagName").toLowerCase();
}

function reverseDate(dateString) {
    return dateString.split("-").reverse().join("-");
}

function returnPxValue(cssValue) {
    cssValue = cssValue.replace("px", "");
    return parseInt(cssValue);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}