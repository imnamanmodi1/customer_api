var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MarcosCustomerSchema = new Schema(
  {
    customerId: {
      type: Number,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

var MarcosCustomer = mongoose.model("MarcosCustomer", MarcosCustomerSchema);
module.exports = MarcosCustomer;
