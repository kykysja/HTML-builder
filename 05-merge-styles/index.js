const fs = require('fs');
const path = require('path');

const styleFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleCssPath = path.join(distFolderPath, 'bundle.css');
const newLineChar = process.platform === 'win32' ? '\r\n' : '\n';

fs.open(bundleCssPath, 'w', (err) => {
  if (err) throw err;
});

async function mergeStyles() {
  fs.readdir(styleFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (!file.isDirectory() && path.parse(file.name).ext === '.css') {
          fs.readFile(path.join(styleFolderPath, file.name), 'utf-8', (err, data) => {
            fs.appendFile(bundleCssPath, `${newLineChar}${data.toString()}`, (err) => {
              if (err) console.log(err);
            });
          });
        }
      });
    }
  });
}

mergeStyles();
