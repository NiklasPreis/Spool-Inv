import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  spools: {
    getAll: () => ipcRenderer.invoke('spool:getAll'),
    add: (spool: unknown) => ipcRenderer.invoke('spool:add', spool),
    update: (id: number, spool: unknown) => ipcRenderer.invoke('spool:update', id, spool),
    delete: (id: number) => ipcRenderer.invoke('spool:delete', id),
    getStats: () => ipcRenderer.invoke('spool:getStats')
  }
})
