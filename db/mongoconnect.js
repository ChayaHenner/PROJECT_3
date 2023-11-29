const mongoose = require('mongoose');
const { UserModel } = require('../models/userModel');

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb://127.0.0.1:27017/project');

  console.log("mongo connect started");
}