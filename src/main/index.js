import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
app.activeWindow = 'mainWin'
let mainWindow, miniWindow, loginWindow
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
    backgroundColor: '#2d2d2d',
    useContentSize: true,
    transparent: false,
    // titleBarStyle: 'hiddenInset',
    frame: false, // PS:隐藏窗口菜单
    resizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
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
    height: 50,
    x: 1002,
    y: 100,
    title: '云音乐',
    parent: miniWindow,
    // hasShadow: false,
    show: false,
    useContentSize: true,
    transparent: false,
    frame: false,
    resizable: false,
    movable: true,
    backgroundColor: '#2d2d2d',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  });
  miniWindow.loadURL(winURL + "#/miniPage")

  miniWindow.on('closed', () => {
    miniWindow = null;
  })
}

//开启登录页
function openLogin() {
  loginWindow = new BrowserWindow({
    width: 350,
    height: 530,
    x: 545,
    y: 194,
    title: '登录页',
    parent: loginWindow,
    hasShadow: true,
    show: true,
    useContentSize: true,
    transparent: false,
    frame: false,
    resizable: false, //窗口是否可调整大小
    movable: true, //窗口是否可移动
    backgroundColor: "#FFF",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  });
  loginWindow.loadURL(winURL + "#/login")

  loginWindow.on('closed', () => {
    loginWindow = null;
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
  app.activeWindow = 'miniWin'
  miniWindow.show();
  mainWindow.hide();
})

ipcMain.on('closeMini', () => {
  miniWindow.hide();
})

ipcMain.on('showMain', () => {
  app.activeWindow = 'mainWin'
  mainWindow.show();
  miniWindow.hide();
})

ipcMain.on('showLogin', () => {
  if(!loginWindow){
    openLogin();
  }else{
    loginWindow.show();
  }
})

ipcMain.on('closeLogin', () => {
  loginWindow.close();
})

ipcMain.on('toLogin', (e,message) => {
  mainWindow.webContents.send('toLogin', message);
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
  if (mainWindow === null) {
    createWindow()
  } else if (app.activeWindow === 'miniWin') {
    if (!miniWindow.isVisible()) miniWindow.show();
  } else if (app.activeWindow === 'mainWin') {
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
