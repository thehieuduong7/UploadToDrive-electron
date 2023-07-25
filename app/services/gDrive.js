// service.js
const { google } = require('googleapis');
const path = require('path');

class GDriveService {
  constructor (opts){
    this.keyPath = opts?.keyPath
  }
  getGDrive() {
    const KEYFILEPATH = this.keyPath //path.join(__dirname, 'service.json');
    const SCOPES = ['https://www.googleapis.com/auth/drive', "https://www.googleapis.com/auth/cloud-platform"]
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });
    const driveService = google.drive({ version: 'v3', auth: auth});
    return driveService;
  };
}
const gDriveService = new GDriveService()



module.exports = {
  gDriveService
};
