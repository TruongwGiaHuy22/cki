const pool = require("./src/config/db");

async function test() {
  try {
    // Tìm user giahuy
    const [users] = await pool.query(
      "SELECT user_id, username FROM users WHERE username = ?",
      ["giahuy"]
    );
    console.log("👤 Users named 'giahuy':", users);

    if (users.length > 0) {
      const userId = users[0].user_id;
      console.log("\n📚 Finding novels created by user ID:", userId);

      // Tìm truyện được tạo bởi user này
      const [novels] = await pool.query(
        "SELECT idln, title, created_by FROM QLTT WHERE created_by = ?",
        [userId]
      );
      console.log("📖 Novels:", novels);
    }

    // Check all users and their created novels
    const [allUsers] = await pool.query(
      "SELECT user_id, username FROM users LIMIT 10"
    );
    console.log("\n\n📋 All users:", allUsers);

    for (const user of allUsers) {
      const [count] = await pool.query(
        "SELECT COUNT(*) as cnt FROM QLTT WHERE created_by = ?",
        [user.user_id]
      );
      console.log(`  User ${user.username} (ID: ${user.user_id}) has ${count[0].cnt} novels`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

test();
