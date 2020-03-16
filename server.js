const express = require("express");
const path = require("path");
const WebSocket = require("ws");

const socketServer = new WebSocket.Server({ port: 3030 });

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = 8765;

app.listen(port, () => {
  console.log(`listening http://localhost:${port}`);
});

const messages = ["Start chatting"];

socketServer.on("connection", socketClient => {
  console.log('connected');
  console.log('client length currently: ', socketServer.clients.size);
  socketClient.send(JSON.stringify(messages));

  socketClient.on("message", message => {
    messages.push(message);

    socketServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message]));
      }
    });
  });

  socketClient.on('close', () => {
    console.log('closed');
    console.log("Clients's number:" , socketServer.clients.size);
  });
});