const fs = require('fs');
const path = require('path')
const mime = require('mime');
const moment = require('moment');
const util = require('util');
const {gDriveService} = require('./gDrive');
const exec = util.promisify(require('child_process').exec);


class UploadService {
constructor(opts){
    this.folderPath = opts?.folderPath;
    this.gDriveFolderId = opts?.gDriveFolderId;
    this.driveService = opts?.driveService;
    this.storePath = opts?.storePath;//"D:\\BackUp\\Work\\project\\node\\backup";
    this.winrarExec = opts?.winrarExec;
  }

  async getListFile () {
    const drive = this.driveService.getGDrive()
    const driveFilesGet = util.promisify(drive.files.list)
                              .bind(drive.files);
    try{
      const res = await driveFilesGet({
        q: `'${this.gDriveFolderId }' in parents`, // Specify the folder ID as the parent ID
        fields: 'files(name, mimeType, size, createdTime, webViewLink)',
        orderBy: 'createdTime desc',
      });
      return res.data.files;
    }catch (error){
      console.error('Error occurred while loading the file:', error);
      throw `Error occurred while loading the file: ${error}`
    }
  };

  async uploadSingleFile (filePath){
    const drive = this.driveService.getGDrive()
    const driveFilesCreate = util.promisify(drive.files.create)
                                 .bind(drive.files);
    try{
      const fileName = path.basename(filePath);
      const fileContent = fs.createReadStream(filePath);
      let file = await driveFilesCreate({
        resource: {
          name: fileName,
          parents: [this.gDriveFolderId],
        },
        media: {
          mimeType: mime.getType(filePath),
          body: fileContent,
        },
        fields: 'id',
      });
      console.log('File uploaded successfully. File ID:', file.data.id);
      return file.data;
    }catch(error){
      console.error('Error occurred while uploading the file:', error);
      throw `Error occurred while uploading the file: ${error}`
    }
  };

  generateFileZipPath(parrentPath){
    const currentDate = moment();
    let timeStr = currentDate.format('DDMMYYYY_HHmmss')
    return `${parrentPath}\\rar${timeStr}.rar`
  }

  async createZipArchive (){
    let outputPath = this.generateFileZipPath(this.storePath)
    process.chdir(this.folderPath);
    const command = `"${this.winrarExec}" a -r -ibck "${outputPath}" "."`;
    const {error} = await exec(command)
    if (error) {
      console.error(`Error occurred: ${error.message}`);
      throw "zip error"
    } else {
      console.log('File zip success. File path:', outputPath);
    }
    return outputPath
  }

  async autoRun(){
    let outputPath = await uploadService.createZipArchive();
    await uploadService.uploadSingleFile(outputPath);
  }
}


// var folderZipPath = "D:\\BackUp\\Work\\project\\node\\UploadFile"
const uploadService = new UploadService({
  driveService: gDriveService,
})

module.exports = {
  uploadService
}
