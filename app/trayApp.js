const {Tray, Menu, app, BrowserWindow} = require("electron")
const path = require('path')
const createTray = ()=>{
    let tray = new Tray(path.join(__dirname, './assets/images/trayIcon.png'));
    const options = [
        {
            label: "Open app",
            click: ()=>{
                BrowserWindow.getAllWindows().forEach((window) => {
                    window.show();
                  });
            }
        },
        {
            label: "Quit",
            click: ()=>{
                BrowserWindow.getAllWindows().forEach((window) => {
                    window.destroy();
                  });
                tray.destroy()
                app.quit()
            }
        },
    ];
    const contextMenu = Menu.buildFromTemplate(options);
    tray.setContextMenu(contextMenu);
    const handleTrayClick = () => {
        tray.popUpContextMenu();
      };
    tray.on("click", handleTrayClick);
    return tray;
}

module.exports = {createTray}
