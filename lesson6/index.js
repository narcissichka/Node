const socket = require("socket.io");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { default: faker } = require("@faker-js/faker");

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  const readStream = fs.createReadStream(indexPath);
  readStream.pipe(res);
});

const io = socket(server);
const usersMap = {};
io.on("connection", (client) => {
  usersMap[client.id] = {
    id: client.id,
    username: faker.name.findName(),
  };
  const connectedMessage = `......................User ${
    usersMap[client.id].username
  } connected!`;
  const disConnectedMessage = `......................User ${
    usersMap[client.id].username
  } disconnected!`;
  let usersInChatMessage = `
    ${io.engine.clientsCount} users in chat
    ......................`;

  client.emit("server-msg", connectedMessage);
  client.broadcast.emit("server-msg", connectedMessage);
  client.emit("server-msg", usersInChatMessage);
  client.broadcast.emit("server-msg", usersInChatMessage);

  client.on("client-msg", (data) => {
    const payload = `
    ${usersMap[client.id].username}: ${data.message}
    `;
    client.broadcast.emit("server-msg", payload);
    client.emit("server-msg", payload);
  });

  client.on("disconnect", () => {
    client.broadcast.emit("server-msg", disConnectedMessage);
    client.broadcast.emit("server-msg", usersInChatMessage);
    delete usersMap[client.id];
  });

  //   console.log(usersMap);
});

server.listen(5555);
