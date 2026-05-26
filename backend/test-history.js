const API_BASE = "http://localhost:4000";

async function testHistory() {
  try {
    // Login
    console.log("🔐 Logging in...");
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "giahuy",
        password: "123456"
      })
    });

    const loginData = await loginRes.json();
    if (!loginData.token) {
      console.log("❌ Login failed!");
      return;
    }

    const token = loginData.token;
    console.log("✅ Token received");

    // Get history
    console.log("\n📚 Fetching history...");
    const historyRes = await fetch(`${API_BASE}/api/history`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const historyData = await historyRes.json();
    console.log("\n📖 History Response:");
    console.log(JSON.stringify(historyData, null, 2));

    if (historyData.data && historyData.data.length > 0) {
      console.log("\n🖼️ First item cover:", historyData.data[0].cover);
      console.log("🖼️ First item title:", historyData.data[0].title);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testHistory();
