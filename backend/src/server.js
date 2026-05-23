const app = require("./app");
const { port } = require("./config/env");
const pool = require("./config/db");

async function bootstrap() {
  try {
    await pool.query("SELECT 1");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

bootstrap();
