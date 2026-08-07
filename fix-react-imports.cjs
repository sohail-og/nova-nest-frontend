const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace `import React from 'react';` or `import React from "react";`
    content = content.replace(/^import\s+React\s+from\s+['"]react['"];?\s*$/gm, '');
    
    // Replace `import React, { ... } from 'react';` with `import { ... } from 'react';`
    content = content.replace(/import\s+React,\s*\{/g, 'import {');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed React imports:', filePath);
    }
  }
});
