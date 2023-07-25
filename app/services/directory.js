const fs = require('fs');

function checkDirectoryPath(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

function checkFilePath(path) {
  try {
    return fs.existsSync(path)
  } catch (error) {
    return false;
  }
}


module.exports = {
    checkDirectoryPath,
    checkFilePath
}
