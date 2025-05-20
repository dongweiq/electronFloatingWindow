const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 380,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    skipTaskbar: true, // 不在任务栏显示
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // 设置窗口层级为浮动层，确保在最上层
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver'); // 设置为最高层级

  // 允许拖动
  mainWindow.setMovable(true);

  require('@electron/remote/main').enable(mainWindow.webContents);
  mainWindow.loadFile('index.html');

  // 初始隐藏窗口
  mainWindow.hide();
}

function toggleWindow() {
  if (!mainWindow) {
    createWindow();
    return;
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindow();

  // 注册全局快捷键
  globalShortcut.register('Alt+Space', () => {
    toggleWindow();
  });

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

// 注销快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 