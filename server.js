var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var log = require("chalk-log");
var httpModule = require("http");
var socketIo = require("socket.io");
var path = require("path");

var app = express();
var http = httpModule.createServer(app);

app.use(cors());
app.use(bodyParser.json());

app.io = socketIo(http);

const port = process.env.PORT || 8000;

//TODO: delete this, it's only for testing....
app.get("/test", function (req, res) {
  const test = { hello: "world" };
  res.json(test);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client-web/build"));
  app.get("*", (req, res) => {
    res.sendFile(res.sendFile(path.resolve(__dirname, "client-web", "build", "index.html")));
  });
}

http.listen(port, function () {
  log.log(`Server listening on port ${port}`);
});
