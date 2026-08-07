const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

// AdminProducts.jsx
replaceInFile('./src/components/admin/AdminProducts.jsx', [
  { search: /import \{ useState \} from 'react';\r?\n/, replace: '' }
]);

// AdminUsers.jsx
replaceInFile('./src/components/admin/AdminUsers.jsx', [
  { search: /Save, /g, replace: '' },
  { search: /const \[activeView, setActiveView\] = useState\('list'\);\s*/g, replace: '' }
]);

// Register.jsx
replaceInFile('./src/pages/Register.jsx', [
  { search: /const \[gender, setGender\] = useState\(''\);\s*/g, replace: '' }
]);
