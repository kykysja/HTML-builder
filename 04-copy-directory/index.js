const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fsPromises.rmdir(newFolderPath, { recursive: true });

  async function copyDirContents(folderPath, newFolderPath) {
    await fsPromises.mkdir(newFolderPath, { recursive: true });

    const folderContents = await fsPromises.readdir(folderPath, { withFileTypes: true });

    folderContents.forEach((el) => {
      if (!el.isDirectory()) {
        fsPromises.copyFile(path.join(folderPath, el.name), path.join(newFolderPath, el.name));
      } else {
        copyDirContents(path.join(folderPath, el.name), path.join(newFolderPath, el.name));
      }
    });
  }
  copyDirContents(folderPath, newFolderPath);
}

copyDir();
