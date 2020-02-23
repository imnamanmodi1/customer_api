var express = require("express");
var router = express.Router();

var Customer = require("../../models/customer.js");

Customer; /* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ success: true, message: "Welcome to Digitaliz's Customer API" });
});

router.get("/customers/:email", function(req, res, next) {
  var email = req.params.email;
  Customer.findOne({ email: email }, (err, customerData) => {
    if (err) {
      res.json({
        messages: [
          {
            text: "Sorry, Email Not Found"
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              userName: "Digi Demo",
              userPhone: "+123456789"
            }
          }
        ]
      });
    }
    if (customerData) {
      // var servicesArr = customerData.activeServices;
      // var lengthOfServices = servicesArr.length;
      // var formattedServices;
      // for (i = 0; i < lengthOfServices + 1; i++) {
      //   formattedServices += servicesArr[i];
      // }
      res.json({
        messages: [
          {
            text: "Great, Email found"
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: customerData.activeServices
            }
          }
        ]
      });
    }
  });
});

router.post("/customers/new", function(req, res, next) {
  // finding if a customer exists already
  Customer.findOne({ email: req.body.email }, (err, customerData) => {
    console.log(customerData, "customer");
    if (customerData === null) {
      // creating a new category
      Customer.create(
        {
          ...req.body
        },
        (err, createdCustomer) => {
          if (err) return next(err);
          if (createdCustomer) {
            res.json({
              status: 200,
              success: true,
              message: "✅New Customer Added`",
              createdCategory: createdCustomer
            });
          }
        }
      );
    } else {
      res.json({
        status: 500,
        success: false,
        message: "❌Customer Already Exists"
      });
    }
  });
});

module.exports = router;
