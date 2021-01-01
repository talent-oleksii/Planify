const fs = require("fs");

class PreferencesJSONHandler {

    constructor(path) {
        this._path = path;
        const jsonString = fs.readFileSync(this._path);
        this._preferences = JSON.parse(jsonString);
    }

    get path() { return this._path; }
    set path(val) { this._path = val; }

    writePreferences() {
        fs.writeFileSync(this._path, JSON.stringify(this._preferences), err => {
            if (err) {
                console.log("error occured while updating / writing to json file", err);
            }
        });
    }

    getPreference(property) {
        return this._preferences[property];
    }

    setPreferences(property, value) {

        this._preferences[property] = value;
        this.writePreferences();

    }

}

class JsonHandler {

    constructor(path) {
        this._path = path;

        const jsonString = fs.readFileSync(this._path);
        this._jsonObjects = JSON.parse(jsonString);
    }


    readJson() {

        fs.readFile(this._path, "utf-8", (err, jsonString) => {

            if (err) {
                console.log("error while reading json file: ", err);
                return;
            }
            
            try {
                let parsedJsonFile = JSON.parse(jsonString);
                console.log("parse completed");
                return parsedJsonFile;
            } catch(err) {
                console.log("error while parsing json file: ", err);
            }
            
        });

    }

    writeToJson() {

        fs.writeFileSync(this._path, JSON.stringify(this._jsonObjects, null, 4), err => {
            if (err) {
                console.log("error occured while updating / writing to json file", err);
            }
        });
    
    }


    getCurrentIdCount(objectChildren=undefined, identifier=undefined) {

        let currentObject;

        if (typeof(identifier) !== "undefined") {
            currentObject = this._jsonObjects[identifier];

            if (typeof(currentObject) === "undefined") {
                return 1;
            }

        } else if (typeof(objectChildren) !== "undefined") {
            currentObject = objectChildren;
        } else {
            console.log("error: l. 87 jsonclasses")
        }

        let allKeys = Object.keys(currentObject);

        
        if (allKeys.length > 0) {
                
            let lastElement = allKeys[allKeys.length - 1];

            let idSet = lastElement.split("-");
            let id = parseInt(idSet[idSet.length - 1]) + 1;

            return id;

        } else {
            return 1;
        }


    }


    updateChild(identifierOne, identifierTwo, newObject) {
        
        if (typeof(this._jsonObjects[identifierOne]) == "undefined") {
            this._jsonObjects[identifierOne] = {};
        }
        if (typeof(this._jsonObjects[identifierOne][identifierTwo]) == "undefined") {
            this._jsonObjects[identifierOne][identifierTwo] = {};
        }

        this._jsonObjects[identifierOne][identifierTwo] = newObject;

        this.writeToJson();
        
    }

    addToJson(identifierOne, identifierTwo, newObject) {

        if (!this._jsonObjects[identifierOne]) {
            this._jsonObjects[identifierOne] = {};
        }

        this._jsonObjects[identifierOne][identifierTwo] = newObject;

        this.writeToJson();

    }

    removeChild(identifierOne, identifierTwo) {

        // will return the task as we would need to add it to the deleted file or vice versa

        let taskCopy = this._jsonObjects[identifierOne][identifierTwo];
        delete this._jsonObjects[identifierOne][identifierTwo];

        if (Object.keys(this._jsonObjects[identifierOne]).length <= 0) {
            delete this._jsonObjects[identifierOne];
        }

        this.writeToJson();
        return taskCopy;

    }


    getChildren(identifier) {

        // returns tasks for specific date

        let children = this._jsonObjects[identifier];

        if (children != undefined) {
            return children;
        } else {
            return {};
        }

    }

    get jsonObjects() { return this._jsonObjects; }
    set jsonObjects(val) { this._jsonObjects = val; }

}

global.preferencesJsonReader = new PreferencesJSONHandler("./json/preferences.json");
