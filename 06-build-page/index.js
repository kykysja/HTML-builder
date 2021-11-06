const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const templateHtmlPath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const styleFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const distFolderPath = path.join(__dirname, 'project-dist');
const distHtmlPath = path.join(distFolderPath, 'index.html');
const distStylePath = path.join(distFolderPath, 'style.css');
const distAssetsPath = path.join(distFolderPath, 'assets');

const newLineChar = process.platform === 'win32' ? '\r\n' : '\n';

async function createDistDir() {
  await fsPromises.rm(distFolderPath, { recursive: true, force: true });
  await fsPromises.mkdir(distFolderPath, { recursive: true });
}

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
  styles.reverse();

  fsPromises.open(distStylePath, 'w');
  styles.forEach((el) => {
    fs.appendFile(distStylePath, `${newLineChar}${el}`, (err) => {
      if (err) console.log(err);
    });
  });
}

async function copyAssets() {
  async function copyDirContent(from, to) {
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
  copyDirContent(assetsFolderPath, distAssetsPath);
}

async function buildHTML() {
  async function getTemplateHtml() {
    const template = await fsPromises.readFile(templateHtmlPath, 'utf-8');
    return template;
  }

  async function getComponents(files) {
    const components = [];
    for (const file of files) {
      if (!file.isDirectory() && path.parse(file.name).ext === '.html') {
        const data = await fsPromises.readFile(path.join(componentsFolderPath, file.name), 'utf-8');
        components.push({ name: path.parse(file.name).name, data });
      }
    }
    return components;
  }

  const files = await fsPromises.readdir(componentsFolderPath, { withFileTypes: true });
  const components = await getComponents(files);

  let template = await getTemplateHtml();

  components.forEach((component) => {
    const regExp = new RegExp(`{{${component.name}}}`, 'g');
    template = template.replace(regExp, `${component.data}`);
  });

  fsPromises.open(distHtmlPath, 'w');
  fsPromises.appendFile(distHtmlPath, template);
}

async function buildPage() {
  await createDistDir();
  await copyAssets();
  await buildHTML();
  await mergeStyles();
}

buildPage();
