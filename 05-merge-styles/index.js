const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const styleFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleCssPath = path.join(distFolderPath, 'bundle.css');

const newLineChar = process.platform === 'win32' ? '\r\n' : '\n';

fs.open(bundleCssPath, 'w', (err) => {
  if (err) throw err;
});

async function mergeStyles() {
  const getStyles = async (files) => {
    const styles = [];

    for (const file of files) {
      if (!file.isDirectory() && path.parse(file.name).ext === '.css') {
        const data = await fsPromises.readFile(path.join(styleFolderPath, file.name), 'utf-8');
        styles.push(data);
      }
    }
    return styles;
  };

  const files = await fsPromises.readdir(styleFolderPath, { withFileTypes: true });
  const styles = await getStyles(files);

  styles.forEach((el) => {
    fs.appendFile(bundleCssPath, `${newLineChar}${el}`, (err) => {
      if (err) console.log(err);
    });
  });
}

mergeStyles();
