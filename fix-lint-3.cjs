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

// AdminOrders.jsx
replaceInFile('./src/components/admin/AdminOrders.jsx', [
  { search: /const totalOrders = filteredOrders.length;\s*/, replace: '' }
]);

// AdminOverview.jsx
replaceInFile('./src/components/admin/AdminOverview.jsx', [
  { search: /BarChart3, /, replace: '' },
  { search: / Calendar /, replace: ' ' }
]);

// AdminProducts.jsx
replaceInFile('./src/components/admin/AdminProducts.jsx', [
  { search: /useState, /, replace: '' }
]);

// AdminUsers.jsx
replaceInFile('./src/components/admin/AdminUsers.jsx', [
  { search: / Save, /, replace: ' ' },
  { search: /const \[activeView, setActiveView\] = useState\('list'\);\s*/, replace: '' }
]);

// CartContext.jsx, ThemeContext.jsx, WishlistContext.jsx
['CartContext.jsx', 'ThemeContext.jsx', 'WishlistContext.jsx'].forEach(file => {
  let content = fs.readFileSync(`./src/context/${file}`, 'utf8');
  if (!content.includes('eslint-disable react-refresh/only-export-components')) {
    fs.writeFileSync(`./src/context/${file}`, '/* eslint-disable react-refresh/only-export-components */\n' + content, 'utf8');
    console.log('Fixed', file);
  }
});

// AdminDashboard.jsx
replaceInFile('./src/pages/AdminDashboard.jsx', [
  { search: /throw new Error\("Stats fetch failed"\);/, replace: 'throw new Error("Stats fetch failed", { cause: err });' },
  { search: /\} catch \(err\) \{\r?\n\s*toast.error\("Failed to delete product."\);/g, replace: '} catch {\n        toast.error("Failed to delete product.");' },
  { search: /\} catch \(err\) \{\r?\n\s*toast.error\("Failed to delete category."\);/g, replace: '} catch {\n        toast.error("Failed to delete category.");' },
  { search: /\} catch \(err\) \{\r?\n\s*toast.error\("Failed to execute account termination."\);/g, replace: '} catch {\n        toast.error("Failed to execute account termination.");' },
  { search: /\} catch \(err\) \{\r?\n\s*\/\/ Fallback: Generate generic/g, replace: '} catch {\n      // Fallback: Generate generic' }
]);

// Orders.jsx
replaceInFile('./src/pages/Orders.jsx', [
  { search: /Package, /, replace: '' }
]);

// Register.jsx
replaceInFile('./src/pages/Register.jsx', [
  { search: /const \[gender, setGender\] = useState\(''\);\s*/, replace: '' } // Just in case it's still there
]);
