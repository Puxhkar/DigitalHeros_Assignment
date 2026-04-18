const fs = require('fs');
const path = require('path');

// Brand rename: DigitalHeros -> BirdiePay
// Skip cookie/storage keys (those are internal identifiers - keep as-is to avoid auth breakage)
const SKIP_PATTERNS = ['digitalheros_mock_session', 'digitalheros_mock_db'];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.json')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Replace display names only - be careful not to touch internal keys
      const original = content;
      
      // Replace display/UI occurrences
      content = content.replace(/DigitalHeros - Subscribe\. Score\. Win\. Give\./g, 'BirdiePay - Subscribe. Score. Win. Give.');
      content = content.replace(/DigitalHeros Premium Polo Shirt/g, 'BirdiePay Premium Polo Shirt');
      content = content.replace(/Exclusive DigitalHeros Golf Towel/g, 'Exclusive BirdiePay Golf Towel');
      content = content.replace(/Curious about DigitalHeros/g, 'Curious about BirdiePay');
      content = content.replace(/© {new Date\(\)\.getFullYear\(\)} DigitalHeros\./g, '© {new Date().getFullYear()} BirdiePay.');
      content = content.replace(/'DigitalHeros'/g, "'BirdiePay'");
      content = content.replace(/"DigitalHeros"/g, '"BirdiePay"');
      content = content.replace(/' \| DigitalHeros'/g, "' | BirdiePay'");
      content = content.replace(/"title": "DigitalHeros"/g, '"title": "BirdiePay"');
      content = content.replace(/title: 'DigitalHeros'/g, "title: 'BirdiePay'");
      content = content.replace(/template: '%s \| DigitalHeros'/g, "template: '%s | BirdiePay'");
      content = content.replace(/DigitalHeros\. All rights reserved/g, 'BirdiePay. All rights reserved');
      content = content.replace(/through your DigitalHeros subscription/g, 'through your BirdiePay subscription');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Renamed in ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./components');
processDirectory('./lib');
console.log('Done!');
