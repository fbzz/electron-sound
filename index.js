const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const fs = require("fs");

const server = express()
  .use((req, res) => res.send({}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

let blacklist = JSON.parse(fs.readFileSync("ip_blacklist.json", "utf8"));
const restaurants = JSON.parse(fs.readFileSync("restaurants.json", "utf8"));

function addIPtoblacklist(ip) {
  blacklist.list.push(ip);
  fs.writeFileSync("ip_blacklist.json", JSON.stringify(blacklist));
  console.log("Ip added to the blacklist");
}

io.on("connection", socket => {
  socket.on("name", name => {
    io.emit("userJoined", name + " entrou na sala.");
    io.emit("restaurant", restaurants);
  });
  socket.on("addRestaurant", restaurant => {
    this.restaurants.push(restaurant);
    io.emit("newRestaurant", this.restaurants);
  });
  socket.on("vote", vote => {
    console.log("connection :", socket.request.connection._peername.address);
    io.emit("userVoted ", { message: "vai se fode" });
  });
});
