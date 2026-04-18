const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('£') || content.includes("'GBP'")) {
        content = content.replace(/£/g, '$');
        content = content.replace(/'GBP'/g, "'USD'");
        fs.writeFileSync(fullPath, content);
        console.log(`Replaced in ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./components');
processDirectory('./lib');
