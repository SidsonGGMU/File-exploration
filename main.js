const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require("url");
const path = require("path");
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/electron-angular-file-exploration/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
    if (mainWindow === null) createWindow();
})


ipcMain.on('checkConnection', (event, arg) => {
    checkConnection();
})

ipcMain.on('browseDirectory', (event, arg) => {
    browseDirectory();
})


function checkConnection() {
    mainWindow.webContents.send('reply', '2-From Electron!')
}

function browseDirectory() {
    dialog.showOpenDialog({ title: 'Choisir un dossier', properties: ['openDirectory'] }, (filePaths) => {
        //console.log("Racine : ", filePaths[0]);
        fs.readdir(filePaths[0], function(err,files) {
            /* for(var i = 0, l = files.length; i < l; i++) {
              var filePath = files[i];
              console.log("Element : ", filePath);
            } */
            mainWindow.webContents.send('reply', {racine: filePaths[0], files_of_folder: files});
          });
    });
}