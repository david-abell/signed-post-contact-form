"use-strict";

// require("dotenv").config({ path: "../.env" });
const transport = require("./transport");
const responseGenerator = require("./response-generator");
const messageGenerator = require("./message-generator");

module.exports = async (event) => {
  // console.log(event);
  try {
    const email = await messageGenerator(event);
    const emailResult = await transport(email);

    if (!emailResult) {
      return responseGenerator.error(event);
    }

    return responseGenerator.success(event);
    // return !!emailResult
    //   ? responseGenerator.success(event)
    //   : responseGenerator.error(event);
  } catch (err) {
    console.log(err);
    return responseGenerator.error(event);
  }
};

// module.exports.sendMail = sendMail;
