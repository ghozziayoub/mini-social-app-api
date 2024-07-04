const app = require("./app");
const env = require("./config/env");
const connectToDB = require("./config/db");
const server = require("http").createServer(app);
const PORT = env.PORT;

(async () => {
  await connectToDB();
  server.listen(PORT, function () {
    console.log(`🌐 server running on port ${PORT}...`);
  });
})();
