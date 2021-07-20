"use-strict";

module.exports.success = (event) => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(
    {
      message: "Form submitted successfully",
      success: true,
      input: event,
    },
    null,
    2
  ),
});

module.exports.error = (event) => ({
  statusCode: 500,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(
    {
      message: "Server Error, please try again later",
      success: false,
      input: event,
    },
    null,
    2
  ),
});
