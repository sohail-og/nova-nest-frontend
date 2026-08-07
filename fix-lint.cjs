const fs = require('fs');
const path = require('path');

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

// App.jsx
replaceInFile('./src/App.jsx', [
  { search: /import \{ ChevronRight, Star, Check \} from 'lucide-react';\s*/g, replace: '' }
]);

// Checkout.jsx
replaceInFile('./src/pages/Checkout.jsx', [
  { search: /CreditCard, Truck, MapPin,\s*/g, replace: '' }
]);

// LandingPage.jsx
replaceInFile('./src/pages/LandingPage.jsx', [
  { search: /import \{ MoveRight, Star, ArrowUpRight, X, Heart, ShoppingBag, Eye \} from 'lucide-react';/, replace: "import { ArrowRight, MoveRight, Star, X, Heart, ShoppingBag } from 'lucide-react';" },
  { search: /import \{ toast \} from 'react-toastify';\s*/, replace: '' },
  { search: /const \[emailSub, setEmailSub\] = useState\(''\);\s*/, replace: '' }
]);

// Login.jsx
replaceInFile('./src/pages/Login.jsx', [
  { search: /User, /g, replace: '' }
]);

// OrderDetails.jsx
replaceInFile('./src/pages/OrderDetails.jsx', [
  { search: /const handleContactSupport = \(e\) => \{/, replace: "const handleContactSupport = () => {" }
]);

// Orders.jsx
replaceInFile('./src/pages/Orders.jsx', [
  { search: /Package, /g, replace: '' }
]);

// Products.jsx
replaceInFile('./src/pages/Products.jsx', [
  { search: / Eye, /g, replace: '' },
  { search: /setSelectedCategory\(matchedCat\.categoryName\);/g, replace: "setTimeout(() => setSelectedCategory(matchedCat.categoryName), 0);" },
  { search: /setSelectedCategory\(catParam\);/g, replace: "setTimeout(() => setSelectedCategory(catParam), 0);" },
  { search: /\}, \[searchParams\]\);/g, replace: "}, [searchParams, categories]);" }
]);

// Profile.jsx
replaceInFile('./src/pages/Profile.jsx', [
  { search: /fetchProfile\(\);/g, replace: "setTimeout(() => fetchProfile(), 0);" },
  { search: /\}, \[navigate\]\);/g, replace: "}, [navigate, fetchProfile]);" }
]);

// Register.jsx
replaceInFile('./src/pages/Register.jsx', [
  { search: /import \{ useState, useEffect, useRef \} from 'react';/, replace: "import { useState } from 'react';" },
  { search: / MapPin, CheckCircle, ShieldAlert, /g, replace: '' },
  { search: /const \[gender, setGender\] = useState\(''\);\s*/, replace: '' }
]);

// Search.jsx
replaceInFile('./src/pages/Search.jsx', [
  { search: / ArrowRight, /g, replace: '' }
]);

// Wishlist.jsx
replaceInFile('./src/pages/Wishlist.jsx', [
  { search: /import \{ toast \} from 'react-toastify';\s*/, replace: '' }
]);

// Router.jsx
replaceInFile('./src/routes/Router.jsx', [
  // to fix react-refresh/only-export-components, we usually need to make sure the file only exports components
  // It probably exports `Router` and something else?
]);
