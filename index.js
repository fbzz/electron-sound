const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const moment = require("moment-timezone");
const momentDurationFormatSetup = require("moment-duration-format");

momentDurationFormatSetup(moment);
moment.tz('America/Sao_Paulo')

const server = express()
  .use("/", express.static("public"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

let timeToEnd = 86400;


const startDate = moment(new Date()).tz('America/Sao_Paulo');
// Do your operations
const endDate   = moment(new Date()).tz('America/Sao_Paulo');

console.log(startDate);

endDate.hours(12);
endDate.minutes(0);
endDate.second(0);

console.log(endDate);

timeToEnd = (endDate.valueOf() - startDate.valueOf()) / 1000;


let convertedTime = null;
setInterval(function() {
    timeToEnd--;

  const duration = moment.duration(timeToEnd, 'seconds');

  const formatted = duration.format("hh:mm:ss");

    console.log(formatted);
  convertedTime = formatted
}, 1000);

let blacklist = JSON.parse(fs.readFileSync("ip_blacklist.json", "utf8"));
let restaurants = JSON.parse(fs.readFileSync("restaurants.json", "utf8"));

function addIPtoblacklist(ip) {
  blacklist.list.push(ip);
  fs.writeFileSync("ip_blacklist.json", JSON.stringify(blacklist));
  console.log("Ip added to the blacklist");
}

function contVotes(rest) {
  const index = restaurants.findIndex(data => data.id == rest.id);
  restaurants[index].votes += 1;
}

function checkTheBlackList(ip) {
  const filt = blacklist.list.filter(res => {
    return res === ip;
  });
  if (filt.length > 0) {
    return true;
  }
  return false;
}

function startCounter(io) {
  setInterval(function() {
    countdown--;
    io.sockets.emit("timer", { countdown: convertedTime });
  }, 1000);

  const date = new Date(null);
  date.setSeconds(60 * 60); // specify value for SECONDS here
  this.setState({ time: date.toISOString().substr(11, 8) });
}

io.on("connection", socket => {
  setInterval(function() {
    io.emit("timer", { countdown: convertedTime });
  }, 1000);

  if (checkTheBlackList(socket.request.connection._peername.address)) {
    io.emit("userVotedRejected", { partials: restaurants });
    return;
  }

  socket.on("name", name => {
    socket.name = name;
    io.emit("userJoined", name + " entrou na sala.");
    io.emit("restaurant", restaurants);
  });

  socket.on("addRestaurant", restaurant => {
    restaurants = [
      ...restaurants,
      {
        id:
          restaurants.length > 0
            ? Math.max(...restaurants.map(i => i.id)) + 1
            : 1,
        name: restaurant.restaurantName,
        description: "",
        votes: 0,
        url: restaurant.restaurantImageUrl
      }
    ];

    fs.writeFileSync("restaurants.json", JSON.stringify(restaurants));
    io.emit("restaurant", restaurants);
  });

  socket.on("removeRestaurant", restaurant => {
    restaurants = restaurants.filter(item => item.id !== restaurant.id);

    fs.writeFileSync("restaurants.json", JSON.stringify(restaurants));
    io.emit("restaurant", restaurants);
  });

  socket.on("vote", vote => {
    addIPtoblacklist(socket.request.connection._peername.address);
    contVotes(vote);
    io.emit("userVoted", {
      message: socket.name + " Votou em " + vote.name,
      partials: restaurants
    });
  });
});
