"use-strict";

const mailer = require("nodemailer");
const aws = require("aws-sdk");

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-west-1",
});

const transport = mailer.createTransport({
  SES: { ses, aws },
});

module.exports = async (message) => {
  const result = new Promise((resolve, reject) => {
    transport.sendMail(message, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  }).catch((err) => {
    console.log(err);
    return false;
  });

  return await result;
};
