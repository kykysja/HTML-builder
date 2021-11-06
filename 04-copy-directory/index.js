const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  async function copyDirContent(from, to) {
    await fsPromises.rm(to, { recursive: true, force: true });
    await fsPromises.mkdir(to, { recursive: true });

    const folderContent = await fsPromises.readdir(from, { withFileTypes: true });

    folderContent.forEach((el) => {
      const elPathFrom = path.resolve(from, el.name);
      const elPathTo = path.resolve(to, el.name);
      if (el.isDirectory()) {
        copyDirContent(elPathFrom, elPathTo);
      } else {
        fsPromises.copyFile(elPathFrom, elPathTo);
      }
    });
  }
  copyDirContent(folderPath, newFolderPath);
}

copyDir();
