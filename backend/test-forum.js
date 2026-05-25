const fetch = require("node-fetch");

const API_BASE = "http://localhost:4000";

async function testForum() {
  try {
    // 1. Login 
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
    console.log("Login response:", loginData);

    if (!loginData.token && !loginData.data?.token) {
      console.log("❌ No token received!");
      return;
    }

    const token = loginData.token || loginData.data.token;
    console.log("✅ Token obtained");

    // 2. Get all posts
    console.log("\n📋 Fetching forum posts...");
    const postsRes = await fetch(`${API_BASE}/api/forum/posts`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const postsData = await postsRes.json();
    console.log("Posts count:", postsData.data?.length || 0);
    
    if (postsData.data && postsData.data.length > 0) {
      const post = postsData.data[0];
      console.log("First post ID:", post.post_id, "User ID:", post.user_id);

      // 3. Try to update the post
      console.log("\n✏️ Trying to update post...");
      const updateRes = await fetch(`${API_BASE}/api/forum/posts/${post.post_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: "Updated title " + new Date().getTime(),
          content: "Updated content",
          category: post.category
        })
      });

      const updateData = await updateRes.json();
      console.log("Update response status:", updateRes.status);
      console.log("Update response:", updateData);

      // 4. Try to delete the post
      console.log("\n🗑️ Trying to delete post...");
      const deleteRes = await fetch(`${API_BASE}/api/forum/posts/${post.post_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const deleteData = await deleteRes.json();
      console.log("Delete response status:", deleteRes.status);
      console.log("Delete response:", deleteData);
    } else {
      console.log("⚠️ No posts found to test update/delete");
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testForum();
