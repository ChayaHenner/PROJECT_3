const mongoose = require('mongoose');
const { UserModel } = require('../models/userModel');

main().catch(err => console.log(err));

async function main() {
    //! await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@clusterchaya.zoha4yp.mongodb.net/class_29`);

    mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb://127.0.0.1:27017/project');

  console.log("mongo connect started");
}