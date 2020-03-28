import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let winType = 'mainWin', mainWindow, miniWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1002,
    height: 670,
    minWidth: 1002,
    minHeight: 670,
    useContentSize: true,
    transparent: false,
    // titleBarStyle: 'hiddenInset',
    frame: false, // PS:隐藏窗口菜单
    resizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
//开启小窗口
function openMiniWin() {
  miniWindow = new BrowserWindow({
    width: 334,
    height: 52,
    x: 1002,
    y: 100,
    title: '云音乐',
    parent: miniWindow,
    hasShadow: false,
    show: false,
    resizable: false,
    useContentSize: true,
    transparent: false,
    frame: false,
    resizable: true,
    movable: true,
    backgroundColor: 'rgb(43,43,43)',
    webPreferences: {
      nodeIntegration: true
    }
  });
  miniWindow.loadURL(winURL + "/#/miniPage")

  miniWindow.on('closed', () => {
    miniWindow = null;
  })
}

//登录窗口最小化
ipcMain.on('min', () => {
  mainWindow.minimize();
})
//登录窗口最大化
ipcMain.on('max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
})
ipcMain.on('close', () => {
  mainWindow.hide();
})

ipcMain.on('mini', () => {
  winType = 'miniWin'
  miniWindow.show();
  mainWindow.hide();
})

ipcMain.on('closeMini', () => {
  miniWindow.hide();
})

ipcMain.on('showMain', () => {
  winType = 'mainWin'
  mainWindow.show();
  miniWindow.hide();
})

app.on('ready', () => {
  createWindow();
  openMiniWin();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  console.log('winType', winType);
  console.log('main', mainWindow.isVisible());
  console.log('mini', miniWindow.isVisible());
  if (mainWindow === null) {
    createWindow()
  } else if (winType === 'miniWin') {
    if (!miniWindow.isVisible()) miniWindow.show();
  } else if (winType === 'mainWin') {
    if (!mainWindow.isVisible()) mainWindow.show();
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
