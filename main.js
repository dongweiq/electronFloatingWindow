const { app, BrowserWindow } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 380,
    height: 380,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  win.setMovable(true);

  require('@electron/remote/main').enable(win.webContents);
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 