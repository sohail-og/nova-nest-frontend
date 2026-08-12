const axios = require("axios");
async function test() {
  try {
    console.log("Testing GET without JWT...");
    const res1 = await axios.get("https://nova-nest-backend-production.up.railway.app/api/products", { timeout: 15000 });
    console.log("GET without JWT SUCCESS, status:", res1.status);
  } catch (e) { console.log("GET without JWT ERROR:", e.message); }

  try {
    console.log("Testing GET with JWT...");
    const res2 = await axios.get("https://nova-nest-backend-production.up.railway.app/api/products", { 
      headers: { "Authorization": "Bearer dummy_token_123" }, timeout: 15000 
    });
    console.log("GET with JWT SUCCESS, status:", res2.status);
  } catch (e) {
    if(e.response) {
       console.log("GET with JWT ERROR status:", e.response.status);
    } else {
       console.log("GET with JWT ERROR:", e.message);
    }
  }

  try {
    console.log("Testing OPTIONS...");
    const res3 = await axios.options("https://nova-nest-backend-production.up.railway.app/api/products", { 
      headers: { "Origin": "https://nova-nest-frontend.vercel.app", "Access-Control-Request-Method": "GET" }, timeout: 15000 
    });
    console.log("OPTIONS SUCCESS, status:", res3.status);
    console.log("OPTIONS headers:", res3.headers["access-control-allow-origin"]);
  } catch (e) { console.log("OPTIONS ERROR:", e.message); }
}
test();
