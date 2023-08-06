const { app, BrowserWindow } = require("electron");
const path = require("path");
const { createTray } = require("./trayApp");

require("./ipc/ipcMain");
function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 1000,
		webPreferences: {
			preload: path.join(__dirname, "./preloads/index.js"),
			nodeIntegration: true,
			sandbox: false,
		},
	});
	win.webContents.openDevTools();
	win.loadFile("app/views/HomePage/index.html");
	win.on("close", (event) => {
		event.preventDefault();
		win.hide();
	});
}

app.whenReady().then(() => {
	createWindow();
	createTray();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
