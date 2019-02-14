const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const restaurants = [];

const server = express()
  .use((req, res) => res.send({}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

let blacklist = JSON.parse(fs.readFileSync("ip_blacklist.json", "utf8"));

addIPtoblacklist = ip => {
  // blacklist.ip_blacklist.push(ip);
  // fs.writeFileSync("ip_blacklist.json", JSON.stringify(blacklist));
  console.log("Ip added to the blacklist");
};

io.on("connection", socket => {
  socket.on("name", name => {
    addIPtoblacklist(socket.request.connection._peername.address);
    console.log("connection :", socket.request.connection._peername.address);
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
