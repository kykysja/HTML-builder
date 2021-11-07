const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('');

    files.forEach((file) => {
      if (!file.isDirectory()) {
        fs.stat(path.join(folderPath, `${file.name}`), (err, stats) => {
          const fileName = path.parse(file.name).name;
          const fileExt = path.parse(file.name).ext.slice(1);
          const fileSize = stats.size;

          console.log(`${fileName} - ${fileExt} - ${fileSize}`);
        });
      }
    });
  }
});
