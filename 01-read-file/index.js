const fs = require('fs');
const path = require('path');

async function logFileContent() {
  const filePath = path.join(__dirname, 'text.txt');
  const reader = fs.createReadStream(filePath, 'utf-8');

  reader.on('data', (data) => console.log(data.toString()));
  reader.on('error', (e) => console.log(e));
}

logFileContent();
