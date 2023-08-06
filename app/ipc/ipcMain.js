const { ipcMain } = require("electron");
const { checkDirectoryPath, checkFilePath } = require("../services/directory");
const { uploadService } = require("../services/upload");
const { gDriveService } = require("../services/gDrive");
const { cronService } = require("../services/cronService");
const constStore = require("../config/constStore");
const { store } = require("../services/store");
const upload = async (event) => {
	try {
		event.sender.send("run-reply", "ziping");
		let outputPath = await uploadService.createZipArchive();
		event.sender.send("run-reply", "uploading");
		await uploadService.uploadSingleFile(outputPath);
		event.sender.send("run-reply", "done");
	} catch (error) {
		event.sender.send("run-reply", error);
	}
};

ipcMain.on("run", (event) => {
	console.log(uploadService, gDriveService);
	upload(event);
});

const getList = async (event) => {
	try {
		event.sender.send("get-list-status", "loading");
		let data = await uploadService.getListFile();
		event.sender.send("get-list-data", data);
		event.sender.send("get-list-status", "done");
	} catch (err) {
		event.sender.send("get-list-status", err);
		event.sender.send("get-list-data", []);
	}
};

ipcMain.on("get-list", (event) => {
	getList(event);
});

ipcMain.on("check-path", (event, text) => {
	event.returnValue = checkDirectoryPath(text);
});
ipcMain.on("check-file-path", (event, text) => {
	event.returnValue = checkFilePath(text);
});

function initConfig() {
	uploadService.gDriveFolderId = store.get(constStore.G_DRIVER_FOLDER_ID);
	uploadService.folderPath = store.get(constStore.FOLDER_PATH);
	uploadService.storePath = store.get(constStore.STORE_PATH);
	uploadService.winrarExec = store.get(constStore.WINRAR_EXEC_PATH);
	gDriveService.keyPath = store.get(constStore.G_DRIVER_API_PATH);
}
initConfig();

ipcMain.on("submit-config", (event, form) => {
	store.set(constStore.FOLDER_PATH, form["input-directory-path"]);
	store.set(constStore.G_DRIVER_API_PATH, form["input-gdriver"]);
	store.set(constStore.G_DRIVER_FOLDER_ID, form["input-gdriver-folder-id"]);
	store.set(constStore.WINRAR_EXEC_PATH, form["input-winrar-path"]);
	store.set(constStore.STORE_PATH, form["input-store-path"]);
	initConfig();
});

ipcMain.on("get-config", (event) => {
	const form = {};
	form["input-directory-path"] = store.get(constStore.FOLDER_PATH);
	form["input-gdriver"] = store.get(constStore.G_DRIVER_API_PATH);
	form["input-gdriver-folder-id"] = store.get(constStore.G_DRIVER_FOLDER_ID);
	form["input-winrar-path"] = store.get(constStore.WINRAR_EXEC_PATH);
	form["input-store-path"] = store.get(constStore.STORE_PATH);
	form["input-cron-expression"] = store.get(constStore.CRON_EXPRESSION);
	event.returnValue = form;
});

ipcMain.on("next-time-cron", (event) => {
	replyNextTime = () => {
		event.sender.send("next-time-cron-reply", cronService.getNext());
	};
	replyNextTime();
	// cronService.func = async () => {
	// 	console.log("cron job running");
	// 	// uploadService.autoRun();
	// 	replyNextTime();
	// };
});

ipcMain.on("cron-reload", (event, cronExpression) => {
	cronService.cronExpression = cronExpression;
	cronService.reloadCron();
	event.returnValue = cronService.isRunning;
});

ipcMain.on("cron-start", (event) => {
	cronService.start();
	event.returnValue = cronService.isRunning;
});

ipcMain.on("cron-stop", (event) => {
	cronService.stop();
	event.returnValue = cronService.isRunning;
});

ipcMain.on("cron-status", (event) => {
	event.returnValue = cronService.isRunning;
});
