import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { getAllSpools, addSpool, updateSpool, deleteSpool, getStats } from './database'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 760,
    minWidth: 900,
    minHeight: 580,
    show: false,
    autoHideMenuBar: true,
    title: 'SpoolInv',
    backgroundColor: '#111827',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win.on('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('spool:getAll', () => getAllSpools())
  ipcMain.handle('spool:add', (_e, spool) => addSpool(spool))
  ipcMain.handle('spool:update', (_e, id, spool) => updateSpool(id, spool))
  ipcMain.handle('spool:delete', (_e, id) => deleteSpool(id))
  ipcMain.handle('spool:getStats', () => getStats())

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
