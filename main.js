const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 300,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false, 
    transparent: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Handle file dialog
ipcMain.handle("open-file-dialog", async (event) => {
  const { app } = require("electron");
  
  const result = await dialog.showOpenDialog({
    defaultPath: path.join(app.getPath("music")),
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "Audio Files",
        extensions: ["mp3", "wav", "flac"]
      }
    ]
  });
  return result.filePaths;
});
