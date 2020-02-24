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
            text:
              "Sorry email not found, please make sure you are entering your registered email id."
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: "null",
              website: "null"
            }
          }
        ]
      });
    }
    if (customerData) {
      var noData = "NA";
      var allServices = customerData.activeServices;
      var arrServices = allServices.split(",");
      console.log(arrServices, "test");
      var totalServices = arrServices.length;
      if (totalServices <= 1) {
        arrServices = allServices;
      }
      res.json({
        messages: [
          {
            text: "✅ Email Verified Successfully"
          }
        ],
        quick_replies: [
          {
            title: totalServices > 1 ? arrServices[0] : arrServices,
            value: totalServices > 1 ? arrServices[0] : arrServices,
            payload: {
              goToBlock: "sbaa42403-9fb9-4c2a-a033-0a0afb892816"
            }
          },
          {
            title: totalServices >= 2 ? arrServices[1] : noData,
            value: totalServices >= 2 ? arrServices[1] : noData,
            payload: {
              goToBlock:
                totalServices >= 2
                  ? "sbaa42403-9fb9-4c2a-a033-0a0afb892816"
                  : noData
            }
          },
          {
            title: totalServices >= 3 ? arrServices[2] : noData,
            value: totalServices >= 3 ? arrServices[2] : noData,
            payload: {
              goToBlock:
                totalServices >= 3
                  ? "sbaa42403-9fb9-4c2a-a033-0a0afb892816"
                  : noData
            }
          },
          {
            title: totalServices >= 4 ? arrServices[3] : noData,
            value: totalServices >= 4 ? arrServices[3] : noData,
            payload: {
              goToBlock:
                totalServices >= 4
                  ? "sbaa42403-9fb9-4c2a-a033-0a0afb892816"
                  : noData
            }
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: customerData.activeServices,
              website: customerData.website
            }
          }
        ]
      });
    } else {
      res.json({
        messages: [
          {
            text:
              "❌ Email verification failed. Error: Provided email is not registered in our database, retry with correct email id"
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: "null",
              website: "null"
            }
          }
        ]
      });
    }
  });
});

// adds a new customer to db
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
              message: "✅New Customer Added",
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

// Updates an existing customer -- PUT

module.exports = router;
