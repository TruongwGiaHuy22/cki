const fetch = require("node-fetch");

const API_BASE = "http://localhost:4000";

async function test() {
  try {
    // Test 1: GET /api/novels (public)
    console.log("=== Test 1: GET /api/novels (public) ===");
    const res1 = await fetch(`${API_BASE}/api/novels`);
    const data1 = await res1.json();
    console.log("Status:", res1.status);
    console.log("Data length:", data1.data?.length || data1.length || 0);
    console.log("");

    // Test 2: GET /api/novels/my (require auth, no token)
    console.log("=== Test 2: GET /api/novels/my (no token) ===");
    const res2 = await fetch(`${API_BASE}/api/novels/my`);
    const data2 = await res2.json();
    console.log("Status:", res2.status);
    console.log("Response:", JSON.stringify(data2, null, 2));
    console.log("");

    // Test 3: GET /api/novels/my (with fake token)
    console.log("=== Test 3: GET /api/novels/my (with invalid token) ===");
    const res3 = await fetch(`${API_BASE}/api/novels/my`, {
      headers: {
        "Authorization": "Bearer invalid_token"
      }
    });
    const data3 = await res3.json();
    console.log("Status:", res3.status);
    console.log("Response:", JSON.stringify(data3, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
