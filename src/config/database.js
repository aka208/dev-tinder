const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://akashbtw_db_user:Uy29TKVhvcT4PJqE@cluster0.gcwleop.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
