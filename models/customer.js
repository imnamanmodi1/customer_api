var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    website: {
      type: String
    },
    activeServices: { type: String }
  },
  { timestamps: true }
);

var Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
