const mongoose = require('mongoose');
const { UserModel } = require('../models/userModel');

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb://127.0.0.1:27017/project');
    // await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@clusterchaya.zoha4yp.mongodb.net/class_29`);

  console.log("mongo connect started");
}