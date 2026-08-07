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

// AdminDashboard.jsx
replaceInFile('./src/pages/AdminDashboard.jsx', [
  { search: /catch \(err\)/g, replace: 'catch (err)' }, // Just disabling the err unused var using comments or replacing with catch () if supported by ESLint environment. Wait, ES2019 supports optional catch binding. Let's try `catch`
  { search: /catch \(error\)/g, replace: 'catch' }
]);
replaceInFile('./src/pages/AdminDashboard.jsx', [
  { search: /catch \(err\)/g, replace: 'catch' }
]);

// Cart.jsx
replaceInFile('./src/pages/Cart.jsx', [
  { search: /ShoppingBag, /g, replace: '' }
]);

// Checkout.jsx
replaceInFile('./src/pages/Checkout.jsx', [
  { search: /CreditCard, /g, replace: '' },
  { search: /Truck, /g, replace: '' },
  { search: /MapPin, /g, replace: '' },
  { search: /MapPin/g, replace: '' } // in case there's no comma
]);

// OrderDetails.jsx
replaceInFile('./src/pages/OrderDetails.jsx', [
  { search: /const handleContactSupport = \(e\) => \{/, replace: 'const handleContactSupport = () => {' }
]);

// Orders.jsx
replaceInFile('./src/pages/Orders.jsx', [
  { search: /Package, /g, replace: '' }
]);

// Register.jsx
replaceInFile('./src/pages/Register.jsx', [
  { search: /MapPin, /g, replace: '' },
  { search: /CheckCircle, /g, replace: '' },
  { search: /ShieldAlert, /g, replace: '' },
  { search: /ShieldAlert/g, replace: '' },
  { search: /const \[gender, setGender\] = useState\(''\);\s*/, replace: '' }
]);

// Router.jsx
let routerContent = fs.readFileSync('./src/routes/Router.jsx', 'utf8');
if (!routerContent.includes('eslint-disable react-refresh/only-export-components')) {
  fs.writeFileSync('./src/routes/Router.jsx', '/* eslint-disable react-refresh/only-export-components */\n' + routerContent, 'utf8');
  console.log('Fixed ./src/routes/Router.jsx');
}
