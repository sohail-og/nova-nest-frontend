const fs = require('fs');

['src/components/admin/AdminOrders.jsx', 'src/components/admin/AdminOverview.jsx', 'src/components/admin/AdminProducts.jsx', 'src/components/admin/AdminUsers.jsx', 'src/pages/Orders.jsx', 'src/pages/Register.jsx'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;
  c = c.replace(/const totalOrders = filteredOrders\.length;\s*/g, '');
  c = c.replace(/Calendar, /g, '');
  c = c.replace(/useState, /g, '');
  c = c.replace(/Save, /g, '');
  c = c.replace(/const \[activeView, setActiveView\] = useState\('list'\);\s*/g, '');
  c = c.replace(/Package, /g, '');
  c = c.replace(/const \[gender, setGender\] = useState\(''\);\s*/g, '');
  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Fixed', f);
  }
});
