const app = require("./src/app");

const server = app.listen("3000", (req, res) => {
  console.log("server started");
});

server.timeout = 600000;
