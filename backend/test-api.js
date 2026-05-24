const fetch = require("node-fetch");

const API_BASE = "http://localhost:4000";

async function test() {
  try {
    // 1. Login with giahuy account
    console.log("🔐 Logging in as giahuy...");
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "giahuy",
        password: "123456" // Change this to actual password
      })
    });

    const loginData = await loginRes.json();
    console.log("Login response:", loginData);

    if (!loginData.token) {
      console.log("❌ No token received!");
      return;
    }

    const token = loginData.token;
    console.log("✅ Token:", token);

    // 2. Call /api/novels/my with token
    console.log("\n📚 Fetching /api/novels/my...");
    const novelsRes = await fetch(`${API_BASE}/api/novels/my`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const novelsData = await novelsRes.json();
    console.log("Novels response:", JSON.stringify(novelsData, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
