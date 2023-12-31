const mongoose = require('mongoose');
const Joi = require("joi");

const toysSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    price: Number,
    img_url:String,
    user_id: String,

    date_created: {
        type: Date, default: Date.now()
    },
    user_id:String

})


exports.ToyModel = mongoose.model("Toys", toysSchema);
exports.validateToy = (_reqBody) => {
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(3).max(100).required(),
        img_url: Joi.string().min(3).max(100).required(),
        category: Joi.string().min(3).max(15).required(),
        price: Joi.number().min(1).max(9999).required()
    })
    return schemaJoi.validate(_reqBody);
}