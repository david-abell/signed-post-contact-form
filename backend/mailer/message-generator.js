"use-strict";

require("dotenv").config({ path: "../.env" });

module.exports = async (event) => {
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.EMAIL_TO;
  const {
    formFields: { firstName, lastName, userEmail, message },
  } = event;

  const messageBody = `
  First Name: ${firstName}
  Last Name: ${lastName}
  Email: ${userEmail}
  Message:
  ${message}
  `;

  const email = {
    to: emailTo,
    from: emailFrom,
    replyTo: `${firstName} ${lastName} <${userEmail}>`,
    subject: "Contact Form",
    text: messageBody,
    // attachments: files.map(({ filename, content, contentType, encoding }) => {
    //   return {
    //     filename,
    //     content,
    //     contentType,
    //     encoding,
    //   };
    // }),
  };
  return email;
};
