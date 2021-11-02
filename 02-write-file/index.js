const fs = require('fs');
const process = require('process');
const path = require('path');
const readlineModule = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const readline = readlineModule.createInterface({ input: process.stdin, output: process.stdout });

if (process.platform === 'win32') {
  readline.on('SIGINT', () => process.emit('SIGINT'));
}
process.on('SIGINT', () => process.exit());

fs.open(filePath, 'a', (err) => {
  if (err) throw err;
});

readline.write('\nHi. Please enter text:\n');

readline.on('line', (data) => {
  if (data.toString() === 'exit') {
    readline.close();
  } else {
    fs.appendFile(filePath, `${data.toString()}\n`, (err) => {
      if (err) console.log(err);
    });
  }
});

process.on('exit', () => readline.write('\nBye. Good Luck!\n'));
