const { app, BrowserWindow } = require("electron");

function createMainWindow() {

    let mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 800,
        minHeight: 500,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile("index.html");
    //mainWindow.removeMenu();

    mainWindow.on("closed", function() {
        mainWindow = null;
    });

}

app.on("ready", createMainWindow);
app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow === null) {
        createMainWindow();
    }
});

