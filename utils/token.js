var crypto = require("crypto");

//crear hash de un texto
//module.exports = (text) => crypto.createHash("md5").update(text).digest("hex");

const generateToken = (length) => {
  return new Promise((resolve) => {
    crypto.randomBytes(24, function (err, buffer) {
      var token = buffer.toString("hex");
      resolve(token);
    });
  });
};

module.exports = generateToken;
