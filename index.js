const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const restaurants = [];

const server = express()
  .use((req, res) => res.send({}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", socket => {
  console.log("connection :", socket.request.connection._peername);
  socket.on("name", name => {
    io.emit("userJoined", name + " entrou na sala.");
  });
  socket.on("addRestaurant", restaurant => {
    this.restaurants.push(restaurant);
    io.emit("newRestaurant", this.restaurants);
  });
  socket.on("vote", vote => {
    io.emit("userVoted ", vote);
  });
});
