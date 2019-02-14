var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const restaurants = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
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

http.listen(3000, () => {
  console.log("listening on *:3000");
});
