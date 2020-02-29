var express = require("express");
var router = express.Router();

// requires Digitaliz's Customer's Model
var Customer = require("../../models/customer.js");

// requires Marco's Customer's Model
var MarcosCustomer = require("../../models/marcosCustomer.js");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ success: true, message: "Welcome to Digitaliz's Customer API" });
});

// retrieves customer of Digitaliz
router.get("/customers/:email", function(req, res, next) {
  var email = req.params.email;
  Customer.findOne({ email: email }, (err, customerData) => {
    if (err) {
      res.json({
        messages: [
          {
            text:
              "❌ Email verification failed. \n Error: To connect with a support agent, please update your registered email id so that we can pull your information from our database.",
            quick_replies: [
              {
                title: "Retry Verification",
                value: "Retry Verification",
                payload: {
                  goToBlock: "s6fba3e4b-2040-4089-9aa7-fbb1c9d669ad"
                }
              }
            ]
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: "null",
              website: "null",
              firstNameApi: "null",
              lastNameApi: "null"
            }
          }
        ]
      });
    }
    if (customerData) {
      var noData = "NA";
      var allServices = customerData.activeServices;
      var arrServices = allServices.replace(/\n/g, ",").split(",");

      console.log(arrServices, "test");
      var totalServices = arrServices.length;
      if (totalServices <= 1) {
        arrServices = allServices;
      }
      res.json({
        messages: [
          {
            text:
              "✅ Email Verified Successfully, please choose an appropriate product/service type for your support query",
            quick_replies: [
              {
                title: totalServices > 1 ? arrServices[0] : arrServices,
                value: totalServices > 1 ? arrServices[0] : arrServices
              },
              {
                title: totalServices >= 2 ? arrServices[1] : noData,
                value: totalServices >= 2 ? arrServices[1] : noData
              },
              {
                title: totalServices >= 3 ? arrServices[2] : noData,
                value: totalServices >= 3 ? arrServices[2] : noData
              },
              {
                title: totalServices >= 4 ? arrServices[3] : noData,
                value: totalServices >= 4 ? arrServices[3] : noData
              }
            ]
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: customerData.activeServices,
              website: customerData.website,
              firstNameApi: customerData.firstName,
              lastNameApi: customerData.lastName
            }
          }
        ]
      });
    } else {
      res.json({
        messages: [
          {
            text:
              "❌ Email verification failed. \n Error: To connect with a support agent, please update your registered email id so that we can pull your information from our database.",
            quick_replies: [
              {
                title: "Retry Verification",
                value: "Retry Verification",
                payload: {
                  goToBlock: "s6fba3e4b-2040-4089-9aa7-fbb1c9d669ad"
                }
              }
            ]
          }
        ],
        actions: [
          {
            type: "set_variable",
            data: {
              activeServices: "null",
              website: "null",
              firstNameApi: "null",
              lastNameApi: "null"
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

// marcos customer's API functions
// 1. Add Customer by ID - POST - /marcos/customer/new
// 2. Delete Customer by ID - POST - /marcos/customer/delete/:id
// 3. Retrieve a Customer by ID - GET - /marcos/customer/:id
// 4. Retrieves all customerID's - GET - /marcos/customer/all

// adds a new CustomerId to db
router.post("/marcos/customer/new", function(req, res, next) {
  // finding if a customer exists already
  MarcosCustomer.findOne(
    { customerId: req.body.customerId },
    (err, retcustomerId) => {
      console.log(retcustomerId, "customer id");
      if (retcustomerId === null) {
        // creating a new customer
        MarcosCustomer.create(
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
                createdCustomer: createdCustomer
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
    }
  );
});

// Retrieve a Customer by ID - GET - /marcos/customer/:id
router.get("/marcos/customer/:id", function(req, res, next) {
  var customerIdInBody = req.params.id;
  console.log(customerIdInBody, "hey");
  MarcosCustomer.findOne(
    { customerId: customerIdInBody },
    (err, customersData) => {
      console.log(customersData, "hey 2");
      if (err) {
        res.json({
          messages: [
            {
              text: "❌ Error Message for Customer Not Found.",
              quick_replies: [
                {
                  title: "Error Title",
                  value: "Error Value",
                  payload: {
                    goToBlock: "s6fba3e4b-2040-4089-9aa7-fbb1c9d669ad"
                  }
                }
              ]
            }
          ],
          actions: [
            {
              type: "set_variable",
              data: {
                existingCustomer: "no"
              }
            }
          ]
        });
      }
      if (customersData) {
        res.json({
          messages: [
            {
              text:
                "✅ Customer ID Verified, \n Leider kann ich Dich anhand dieser ID nicht in meiner Kunden- / Partnerliste finden. Entweder Du versuchst es noch einmal, oder Du holst Dir einfach den Zugang zum VIP Club zum regulären Preis, der noch immer hammer günstig ist! Wir sehen uns auf der anderen Seite!"
            }
          ],
          actions: [
            {
              type: "set_variable",
              data: {
                existingCustomer: "yes"
              }
            }
          ]
        });
      } else {
        res.json({
          messages: [
            {
              text: "❌ Error Message for Customer Not Found.",
              quick_replies: [
                {
                  title: "Error Titles",
                  value: "Error Value",
                  payload: {
                    goToBlock: "s6fba3e4b-2040-4089-9aa7-fbb1c9d669ad"
                  }
                }
              ]
            }
          ],
          actions: [
            {
              type: "set_variable",
              data: {
                existingCustomer: "no"
              }
            }
          ]
        });
      }
    }
  );
});

// route to delete a single marco's customer's Object
// [DELETE] - api/v1/marcos/customer/delete/:id
router.delete("/marcos/customer/delete/:id", (req, res, next) => {
  var customerIdInBody = req.params.id;
  MarcosCustomer.findOneAndDelete(
    { customerId: customerIdInBody },
    (err, deletedCustomer) => {
      if (err) {
        return err;
      }
      if (deletedCustomer) {
        res.json({
          status: 200,
          success: true,
          message: "✅MARCO's CUSTOMER DELETED SUCCESSFULLY",
          description: deletedCustomer
        });
      } else {
        res.json({
          status: 400,
          success: false,
          message: "❌SOMETHING WENT WRONG, CANNOT DELETE CUSTOMER's DATA",
          error: { ...err }
        });
      }
    }
  );
});

// retrieves all Ids of Marcos in JSON Format
router.get("/marcos/allCustomer/", (req, res, next) => {
  MarcosCustomer.find({}, function(err, allCustomerData) {
    res.json({
      allIds: { ...allCustomerData }
    });
  });
});

module.exports = router;
