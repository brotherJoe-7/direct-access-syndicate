const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/blue-/g, 'green-')
    .replace(/indigo-/g, 'emerald-')
    .replace(/purple-/g, 'teal-');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkSync(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
      replaceInFile(filePath);
    }
  }
};

walkSync(directoryPath);
console.log('Color replacement complete.');
