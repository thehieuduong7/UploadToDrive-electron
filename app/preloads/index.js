const { contextBridge } = require("electron");
const { ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer,
	shell,
});

contextBridge.exposeInMainWorld("home", {
	handleUploadStatus: (callback) => ipcRenderer.on("run-reply", callback),
	handleListStatus: (callback) => ipcRenderer.on("get-list-status", callback),
	handleListData: (callback) => ipcRenderer.on("get-list-data", callback),
	handleNextTimeCron: (callback) =>
		ipcRenderer.on("next-time-cron-reply", callback),
});
