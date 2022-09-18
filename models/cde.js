const {Schema, model} = require("mongoose");

var CDESchema = new Schema({
    user_id: String,
    name: String,
});

var CDE = model('CDE', CDESchema);

module.exports = CDE
