const app = require("./app");
const { port } = require("./config/env");
const pool = require("./config/db");
const { initializeForum } = require("./config/initDb");

async function bootstrap() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Kết nối Database thành công");
    
    // Khởi tạo forum tables
    await initializeForum();
    
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

bootstrap();
