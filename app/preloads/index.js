const {contextBridge} = require('electron')
const upload = require('../services/upload')
const {ipcRenderer, shell} = require('electron')

contextBridge.exposeInMainWorld('apiUpload', {
    ...upload,
})

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer,
    shell,
    handleUploadStatus: (callback) => ipcRenderer.on('run-reply', callback),
    handleListStatus: (callback) => ipcRenderer.on('get-list-status', callback),
    handleListData: (callback) => ipcRenderer.on('get-list-data', callback),
    handleNextTimeCron: (callback) => ipcRenderer.on('next-time-cron-reply', callback),
})

